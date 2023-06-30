import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongooseUniqueValidator from "mongoose-unique-validator";

const <%=name%>Schema = new Schema(
  {
    field: {
      type: String,
      required: true
    },
    field2: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

<%=name%>Schema.plugin(mongoosePaginate);
<%=name%>Schema.plugin(mongooseUniqueValidator);

const <%=name%> = mongoose.model("<%=name%>", <%=name%>Schema);
export default <%=name%>;
