import React from "react";
import { List, Datagrid, TextField, EmailField, TextInput } from "react-admin";

const userFilters = [
  <TextInput key="1" label="Search" source="email" alwaysOn />,
];

const UserList = () => (
  <List filters={userFilters}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="fullName" />
      <EmailField source="email" />
      <TextField source="role" />
    </Datagrid>
  </List>
);

export default UserList;
