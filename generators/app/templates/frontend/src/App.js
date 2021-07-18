import React from "react";
import { Admin, Resource, fetchUtils } from "react-admin";
import addUploadFeature from "./addUploadFeature";
import UserIcon from "@material-ui/icons/Group";
import NotFound from "./NotFound";
import authProvider from "./authProvider";
import restProvider from "./restProvider";
import users from "./users";
import configs from "./configs";

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  const token = localStorage.getItem("token");
  options.headers.set("Authorization", `Bearer ${token}`);
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
