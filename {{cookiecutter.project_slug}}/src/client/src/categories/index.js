import React from "react";
import {
  List,
  Create,
  Datagrid,
  Edit,
  SimpleForm,
  TextField,
  ImageField,
  DisabledInput,
  TextInput,
  ImageInput
} from "react-admin";

import { ImageFormat } from "../recipes";
import ConditionalImageField from "../recipes/ConditionalImageField";

const CategoryTitle = ({ record }) => {
  return <span>User {record ? `"${record.name}"` : ""}</span>;
};

export const CategoryList = props => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <ConditionalImageField />
      <TextField source="name" />
    </Datagrid>
  </List>
);

export const CategoryCreate = props => (
  <Create {...props}>
    <SimpleForm redirect="list">
      <TextInput source="name" />
      <ImageInput source="image" label="Image" accept="image/*">
        <ImageField source="src" title="title" format={ImageFormat} />
      </ImageInput>
    </SimpleForm>
  </Create>
);

export const CategoryEdit = props => (
  <Edit {...props} title={<CategoryTitle />}>
    <SimpleForm>
      <DisabledInput source="id" />
      <TextInput source="name" />
      <ImageInput
        source="image"
        label="Image"
        accept="image/*"
        format={ImageFormat}
      >
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Edit>
);
