import { Service } from "../../helpers/common";
import <%=name%> from "./<%=camelName%>.model";


class <%=name%>Service extends Service {
  constructor() {
    super(<%=name%>);
  }
}

export default new <%=name%>Service();
