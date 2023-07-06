import { fetchUtils } from "react-admin";
import { stringify } from "query-string";

export default (apiUrl, httpClient = fetchUtils.fetchJson) => ({
  getList: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const _field = field === "id" ? "_id" : field;
    const query = {
      ...fetchUtils.flattenObject(params.filter),
      sort: order === "DESC" ? `-${_field}` : _field,
      page: page,
      limit: perPage,
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return httpClient(url).then(({ json }) => ({
      data: json.data.map((resource) => ({ ...resource, id: resource._id })),
      total: json.total,
    }));
  },

  getOne: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
      data: { ...json.data, id: json.data._id },
    })),

  getMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ _id: { $in: params.ids } }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    return httpClient(url).then(({ json }) => ({
      data: json.data.map((resource) => ({ ...resource, id: resource._id })),
      total: json.total,
    }));
  },

  getManyReference: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const _field = field === "id" ? "_id" : field;
    const query = {
      sort: order === "DESC" ? `-${_field}` : _field,
      page: page,
      limit: perPage,
      filter: JSON.stringify({
        ...params.filter,
        [params.target]: params.id,
      }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return httpClient(url).then(({ json }) => ({
      data: json.data.map((resource) => ({ ...resource, id: resource._id })),
      total: json.total,
    }));
  },

  create: (resource, params) =>
    httpClient(`${apiUrl}/${resource}`, {
      method: "POST",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({
      data: { ...params.data, id: json._id },
    })),

  update: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: { ...json.data, id: json.data._id } })),

  updateMany: (resource, params) => {
    return Promise.all(
      params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}`, {
          method: "PUT",
          body: JSON.stringify(params.data),
        })
      )
    ).then((responses) => ({
      data: responses.map((response) => response.json),
    }));
  },

  delete: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "DELETE",
    }).then(({ json }) => ({ data: { ...params.data, id: json.data._id } })),

  deleteMany: (resource, params) => {
    return Promise.all(
      params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}`, {
          method: "DELETE",
        })
      )
    ).then((responses) => ({
      data: responses.map((response) => response.json),
    }));
  },
});
