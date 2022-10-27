import React from "react";
import { Admin, Resource } from "react-admin";
import * as fetchUtils from "./utils/fetch";
import decodeJwt from "jwt-decode";
import addUploadFeature from "./addUploadFeature";
import NotFound from "./NotFound";
import authProvider from "./authProvider";
import restProvider from "./restProvider";
import users from "./users";
import configs from "./configs";
import tokenProvider from "./utils/tokenProvider";

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  const token = tokenProvider.getToken();
  if (token) {
    const decodedToken = decodeJwt(token);
    const { exp } = decodedToken;
    const now = new Date();
    if (now > (exp + 5) * 1000) {
      return tokenProvider.getRefreshedToken().then((gotFreshToken) => {
        if (gotFreshToken) {
          options.headers.set(
            "Authorization",
            `Bearer ${tokenProvider.getToken()}`
          );
        }
        // return fetchUtils.fetchJson(url, options);
      });
    } else {
      options.headers.set("Authorization", `Bearer ${token}`);
      // return fetchUtils.fetchJson(url, options);
    }
  }
  return fetchUtils.fetchJson(url, options);
};

const API_URL = process.env.API_URL || "";
const dataProvider = restProvider(`${API_URL}/api/v1`, httpClient);
const uploadCapableDataProvider = addUploadFeature(dataProvider);

const App = () => (
  <Admin
    title="Awesome App Admin"
    dataProvider={uploadCapableDataProvider}
    authProvider={authProvider}
    catchAll={NotFound}
  >
    <Resource name="users" {...users} />
    <Resource name="configs" {...configs} />
  </Admin>
);

export default App;
