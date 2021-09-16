import React from "react";
import {
  Create,
  SimpleForm,
  TextInput
} from "react-admin";

const ConfigCreate = props => (
  <Create {...props}>
    <SimpleForm redirect="list">
      <TextInput source="name" />
      <TextInput source="value" />
    </SimpleForm>
  </Create>
);

export default ConfigCreate;
