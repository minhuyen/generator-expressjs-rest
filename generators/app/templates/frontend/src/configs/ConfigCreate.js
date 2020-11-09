import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  ImageInput,
  ImageField,
  SelectInput
} from "react-admin";

import RichTextInput from "ra-input-rich-text";

const ConfigCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="value" />
    </SimpleForm>
  </Create>
);

export default ConfigCreate;
