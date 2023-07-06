import React from "react";
import { Create, SimpleForm, TextInput, required } from "react-admin";

const IapCreate = () => (
  <Create>
    <SimpleForm redirect="list">
      <TextInput
        source="deviceId"
        multiline
        fullWidth={true}
        validate={required()}
      />
      <TextInput source="productId" multiline fullWidth={true} />
      <TextInput source="environment" multiline fullWidth={true} />
      <TextInput source="originalTransactionId" multiline fullWidth={true} />
      <TextInput source="transactionId" multiline fullWidth={true} />
    </SimpleForm>
  </Create>
);

export default IapCreate;
