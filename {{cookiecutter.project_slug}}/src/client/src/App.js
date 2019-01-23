import React from "react";
import { Admin, Resource, fetchUtils } from "react-admin";
import addUploadFeature from "./addUploadFeature";
import UserIcon from "@material-ui/icons/Group";
import NotFound from "./NotFound";
import authProvider from "./authProvider";
import restProvider from "./restProvider";
import { UserList, UserEdit } from "./users";
import { CategoryList, CategoryCreate, CategoryEdit } from "./categories";
import { RecipeList, RecipeCreate, RecipeEdit } from "./recipes";

const httpClient = (url, options = {}) => {
  if (options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  const token = localStorage.getItem("token");
  options.headers.set("Authorization", `Bearer ${token}`);
  return fetchUtils.fetchJson(url, options);
};

const API_URL = process.env.API_URL || "";
const customAuthProvider = authProvider(`${API_URL}/api/v1/auth/login`);
const dataProvider = restProvider(`${API_URL}/api/v1`, httpClient);
const uploadCapableDataProvider = addUploadFeature(dataProvider);

const App = () => (
  <Admin
    title="Dating App Admin"
    dataProvider={uploadCapableDataProvider}
    authProvider={customAuthProvider}
    catchAll={NotFound}
  >
    <Resource name="users" list={UserList} edit={UserEdit} icon={UserIcon} />
    <Resource
      name="collections"
      list={CategoryList}
      edit={CategoryEdit}
      create={CategoryCreate}
      icon={UserIcon}
    />

    <Resource
      name="recipes"
      list={RecipeList}
      edit={RecipeEdit}
      create={RecipeCreate}
      icon={UserIcon}
    />
  </Admin>
);

export default App;
