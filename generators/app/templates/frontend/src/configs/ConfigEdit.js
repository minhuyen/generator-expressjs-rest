import React from "react";
import {
  Edit,
  SimpleForm,
  TextInput
} from "react-admin";

const ConfigEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="value" />
    </SimpleForm>
  </Edit>
);

export default ConfigEdit;
