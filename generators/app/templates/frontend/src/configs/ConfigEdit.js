import React from "react";
import {
  Edit,
  SimpleForm,
  TextInput
} from "react-admin";

const ConfigEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" multiline fullWidth={true} />
      <TextInput source="value" multiline fullWidth={true} />
    </SimpleForm>
  </Edit>
);

export default ConfigEdit;
