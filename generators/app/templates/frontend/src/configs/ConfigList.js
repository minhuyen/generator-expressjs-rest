import React from "react";
import {
  List,
  Datagrid,
  TextField,
  TextInput,
  Filter,
  EditButton,
} from "react-admin";

const configFilters = [
  <TextInput label="Name" source="name" alwaysOn />
]

const ConfigList = () => (
  <List filters={configFilters}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="value" />
      <EditButton />
    </Datagrid>
  </List>
);

export default ConfigList;
