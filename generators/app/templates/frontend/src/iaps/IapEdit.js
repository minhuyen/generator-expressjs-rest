import React from "react";
import { Edit, SimpleForm, TextInput, required } from "react-admin";

const IapEdit = () => (
  <Edit>
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
  </Edit>
);

export default IapEdit;
