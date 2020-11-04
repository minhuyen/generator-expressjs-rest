import React from "react";
import {
  List,
  Datagrid,
  TextField,
  TextInput,
  Filter,
  EditButton
} from "react-admin";

const ArticleFilter = props => (
  <Filter {...props}>
    <TextInput label="Search" source="title" alwaysOn />
  </Filter>
);

const ConfigList = props => (
  <List {...props} filters={<ArticleFilter />}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="value" />
      <EditButton />
    </Datagrid>
  </List>
);

export default ConfigList;
