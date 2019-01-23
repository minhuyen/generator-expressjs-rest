import { stringify } from "query-string";
import {
  fetchUtils,
  GET_LIST,
  GET_ONE,
  CREATE,
  UPDATE,
  DELETE,
  GET_MANY,
  GET_MANY_REFERENCE,
  UPDATE_MANY,
  DELETE_MANY
} from "react-admin";

/**
 * Maps react-admin queries to a simple REST API
 *
 * The REST dialect is similar to the one of FakeRest
 * @see https://github.com/marmelab/FakeRest
 * @example
 * GET_LIST     => GET http://my.api.url/posts?sort=['title','ASC']&range=[0, 24]
 * GET_ONE      => GET http://my.api.url/posts/123
 * GET_MANY     => GET http://my.api.url/posts?filter={ids:[123,456,789]}
 * UPDATE       => PUT http://my.api.url/posts/123
 * CREATE       => POST http://my.api.url/posts
 * DELETE       => DELETE http://my.api.url/posts/123
 */
export default (apiUrl, httpClient = fetchUtils.fetchJson) => {
  /**
   * @param {string} type Request type, e.g GET_LIST
   * @param {string} resource Resource name, e.g. "posts"
   * @param {Object} payload Request parameters. Depends on the request type
   * @returns {Promise} the Promise for a data response
   */
  return (type, resource, params) => {
    const { url, options } = convertDataRequestToHTTP(
      apiUrl,
      type,
      resource,
      params
    );
    return httpClient(url, options).then(response =>
      convertHTTPResponse(response, type, resource, params)
    );
  };
};

/**
 * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The data request params, depending on the type
 * @returns {Object} { url, options } The HTTP request parameters
 */

const convertDataRequestToHTTP = (apiUrl, type, resource, params) => {
  let url = "";
  const options = {
    headers: new Headers({
      Accept: "application/json"
    })
  };
  switch (type) {
    case GET_LIST: {
      const { page, perPage } = params.pagination;
      const { field, order } = params.sort;
      let _field = field === "id" ? "_id" : field;
      const query = {
        ...fetchUtils.flattenObject(params.filter),
        sort: order === "DESC" ? `-${_field}` : _field,
        skip: (page - 1) * perPage,
        limit: perPage
      };
      url = `${apiUrl}/${resource}?${stringify(query)}`;
      break;
    }
    case GET_ONE:
      url = `${apiUrl}/${resource}/${params.id}`;
      break;
    case CREATE:
      url = `${apiUrl}/${resource}`;
      options.method = "POST";
      options.body = JSON.stringify(params.data);
      break;
    case UPDATE:
      url = `${apiUrl}/${resource}/${params.id}`;
      options.method = "PUT";
      options.body = JSON.stringify(params.data);
      break;
    case UPDATE_MANY: {
      const query = {
        filter: JSON.stringify({ _id: params.ids })
      };
      url = `${apiUrl}/${resource}?${stringify(query)}`;
      options.method = "PATCH";
      options.body = JSON.stringify(params.data);
      break;
    }
    case DELETE:
      url = `${apiUrl}/${resource}/${params.id}`;
      options.method = "DELETE";
      break;
    case DELETE_MANY: {
      const query = {
        filter: JSON.stringify({ _id: params.ids })
      };
      url = `${apiUrl}/${resource}?${stringify(query)}`;
      options.method = "DELETE";
      break;
    }
    case GET_MANY: {
      const query = {
        filter: JSON.stringify({ _id: params.ids })
      };
      url = `${apiUrl}/${resource}?${stringify(query)}`;
      break;
    }
    case GET_MANY_REFERENCE: {
      const { page, perPage } = params.pagination;
      const { field, order } = params.sort;
      const query = {
        sort: JSON.stringify([field, order]),
        range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
        filter: JSON.stringify({
          ...params.filter,
          [params.target]: params.id
        })
      };
      url = `${apiUrl}/${resource}?${stringify(query)}`;
      break;
    }
    default:
      throw new Error(`Unsupported Data Provider request type ${type}`);
  }
  return { url, options };
};
/**
 * @param {Object} response HTTP response from fetch()
 * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The data request params, depending on the type
 * @returns {Object} Data response
 */

const convertHTTPResponse = (response, type, resource, params) => {
  const { json } = response;
  switch (type) {
    case GET_LIST:
    case GET_MANY:
    case GET_MANY_REFERENCE:
      return {
        data: json.data.map(resource => ({ ...resource, id: resource._id })),
        total: json.total
      };
    case UPDATE:
    case DELETE:
    case GET_ONE:
      return { data: { ...json, id: json._id } };
    case CREATE:
      return { data: { ...params.data, id: json._id } };
    default:
      return { data: json };
  }
};
