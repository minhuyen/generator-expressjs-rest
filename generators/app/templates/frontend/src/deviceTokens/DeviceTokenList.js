import React from "react";
import { List, Datagrid, TextField, TextInput, EditButton } from "react-admin";

// eslint-disable-next-line react/jsx-key
const deviceTokenFilters = [<TextInput label="Name" source="name" alwaysOn />];

const DeviceTokenList = () => (
  <List filters={deviceTokenFilters} sort={{ field: "position", order: "ASC" }}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="deviceId" />
      <TextField source="platform" />
      <EditButton />
    </Datagrid>
  </List>
);

export default DeviceTokenList;
