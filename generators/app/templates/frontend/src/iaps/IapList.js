import React from "react";
import { List, Datagrid, TextField, TextInput, EditButton } from "react-admin";

// eslint-disable-next-line react/jsx-key
const iapFilters = [<TextInput label="Name" source="name" alwaysOn />];

const IapList = () => (
  <List filters={iapFilters} sort={{ field: "position", order: "ASC" }}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="deviceId" />
      <TextField source="productId" />
      <TextField source="environment" />
      <TextField source="originalTransactionId" />
      <TextField source="transactionId" />
      <EditButton />
    </Datagrid>
  </List>
);

export default IapList;
