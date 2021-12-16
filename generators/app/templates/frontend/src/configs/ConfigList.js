import React from "react";
import {
  List,
  Datagrid,
  TextField,
  TextInput,
  Filter,
  EditButton
} from "react-admin";

const ConfigFilter = props => (
  <Filter {...props}>
    <TextInput label="Name" source="name" alwaysOn />
  </Filter>
);

const ConfigList = props => (
  <List {...props} filters={<ConfigFilter />}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="value" />
      <EditButton />
    </Datagrid>
  </List>
);

export default ConfigList;
