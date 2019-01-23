import React from "react";
import { ImageField } from "react-admin";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  image: { width: "50px" }
};

const ConditionalImageField = ({ classes, record, ...rest }) =>
  record && record.image && typeof record.image === "string" ? (
    <ImageField
      source="image"
      // className={classes.image}
      record={record}
      {...rest}
    />
  ) : (
    <ImageField
      source="image.src"
      // className={classes.image}
      record={record}
      {...rest}
    />
  );

export default withStyles(styles)(ConditionalImageField);
