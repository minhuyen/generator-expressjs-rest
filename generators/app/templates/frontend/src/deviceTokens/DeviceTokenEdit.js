import React from "react";
import { Edit, SimpleForm, TextInput, required } from "react-admin";

const DeviceTokenEdit = () => (
  <Edit>
    <SimpleForm redirect="list">
      <TextInput
        source="deviceId"
        multiline
        fullWidth={true}
        validate={required()}
      />
      <TextInput source="platform" multiline fullWidth={true} />
      <TextInput source="token" multiline fullWidth={true} />
    </SimpleForm>
  </Edit>
);

export default DeviceTokenEdit;
