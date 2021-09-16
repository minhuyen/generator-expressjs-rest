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
      <TextField source="fullName" />
      <EmailField source="email" />
      <TextField source="role" />
    </Datagrid>
  </List>
);

export default UserList;
