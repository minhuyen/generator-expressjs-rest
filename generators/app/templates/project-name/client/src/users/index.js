import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  Edit,
  SimpleForm,
  DisabledInput,
  TextInput,
  Filter
} from "react-admin";

import { validateEmail } from "../validates";

const UserTitle = ({ record }) => {
  return (
    <span>
      User {record ? `"${record.first_name} ${record.last_name}"` : ""}
    </span>
  );
};

const UserFilter = props => (
  <Filter {...props}>
    <TextInput label="Search" source="email" alwaysOn />
  </Filter>
);

export const UserList = props => (
  <List {...props} filters={<UserFilter />}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="first_name" />
      <TextField source="last_name" />
      <EmailField source="email" />
    </Datagrid>
  </List>
);

export const UserEdit = props => (
  <Edit {...props} title={<UserTitle />}>
    <SimpleForm>
      <DisabledInput source="id" />
      <TextInput source="first_name" />
      <TextInput source="last_name" />
      <TextInput source="email" validate={validateEmail} />
    </SimpleForm>
  </Edit>
);
