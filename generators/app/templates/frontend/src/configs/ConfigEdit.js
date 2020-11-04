import React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  ImageInput,
  ImageField,
  SelectInput
} from "react-admin";
import RichTextInput from "ra-input-rich-text";

const ConfigEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="value" />
    </SimpleForm>
  </Edit>
);

export default ConfigEdit;
