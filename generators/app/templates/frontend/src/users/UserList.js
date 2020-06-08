import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  TextInput,
  Filter,
} from "react-admin";

const UserFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="email" alwaysOn />
  </Filter>
);

const UserList = (props) => (
  <List {...props} filters={<UserFilter />}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="username" />
      <TextField source="firstName" />
      <TextField source="lastName" />
      <EmailField source="email" />
    </Datagrid>
  </List>
);

export default UserList;
