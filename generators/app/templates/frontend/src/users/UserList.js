import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  TextInput,
  Filter,
} from "react-admin";

const userFilters = [
  <TextInput label="Search" source="email" alwaysOn />
]


const UserList = (props) => (
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
