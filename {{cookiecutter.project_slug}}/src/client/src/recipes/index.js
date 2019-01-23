import React from "react";
import {
  List,
  Create,
  Datagrid,
  Edit,
  SimpleForm,
  TextField,
  ImageField,
  ReferenceField,
  NumberField,
  DisabledInput,
  TextInput,
  ImageInput,
  ReferenceInput,
  SelectInput,
  NumberInput,
  SelectArrayInput
} from "react-admin";

import RichTextInput from "ra-input-rich-text";
import ConditionalImageField from "./ConditionalImageField";

const RecipeTitle = ({ record }) => {
  return <span>Recipe {record ? `"${record.name}"` : ""}</span>;
};

export const ImageFormat = record => {
  if (typeof record === "string") {
    return {
      src: record
    };
  } else {
    return record;
  }
};

const mealTypeChoices = [
  { id: "breakfast", name: "Breakfast" },
  { id: "lunch", name: "Lunch" },
  { id: "dinner", name: "Dinner" },
  { id: "stack", name: "Stack" }
];

export const RecipeList = props => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <ConditionalImageField />
      <TextField source="name" />
      <NumberField source="kcal" />
      <ReferenceField source="category" reference="collections">
        <TextField source="name" />
      </ReferenceField>
    </Datagrid>
  </List>
);

export const RecipeCreate = props => (
  <Create {...props}>
    <SimpleForm redirect="list">
      <TextInput source="name" />
      <ReferenceInput source="category" reference="collections">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <NumberInput source="kcal" />
      <RichTextInput source="summary" />
      <RichTextInput source="description" />
      <NumberInput source="net_carbs" />
      <NumberInput source="protein" />
      <NumberInput source="fat" />
      <SelectArrayInput
        label="Meal Type"
        source="meal_type"
        choices={mealTypeChoices}
      />
      <ImageInput
        source="image"
        label="Image"
        accept="image/*"
        format={ImageFormat}
      >
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Create>
);

export const RecipeEdit = props => (
  <Edit {...props} title={<RecipeTitle />}>
    <SimpleForm>
      <DisabledInput source="id" />
      <TextInput source="name" />
      <ReferenceInput source="category" reference="collections">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <NumberInput source="kcal" />
      <RichTextInput source="summary" />
      <RichTextInput source="description" />
      <NumberInput source="net_carbs" />
      <NumberInput source="protein" />
      <NumberInput source="fat" />
      <SelectArrayInput
        label="Meal Type"
        source="meal_type"
        choices={mealTypeChoices}
      />
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
