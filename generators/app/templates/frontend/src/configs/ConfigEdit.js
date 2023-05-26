import React from "react";
import { Create, SimpleForm, TextInput } from "react-admin";

const ConfigCreate = () => (
  <Create>
    <SimpleForm redirect="list">
      <TextInput source="name" multiline fullWidth={true} />
      <TextInput source="value" multiline fullWidth={true} />
    </SimpleForm>
  </Create>
);

export default ConfigCreate;
