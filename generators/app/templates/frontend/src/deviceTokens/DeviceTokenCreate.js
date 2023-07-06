import React from "react";
import { Create, SimpleForm, TextInput, required } from "react-admin";

const DeviceTokenCreate = () => (
  <Create>
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
  </Create>
);

export default DeviceTokenCreate;
