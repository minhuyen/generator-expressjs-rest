import Controller from "../../core/controller";
import <%=camelName%>Service from "./<%=camelName%>.service";

class <%=name%>Controller extends Controller {
  constructor(service, name) {
    super(service, name);
  }
}

export default new <%=name%>Controller(<%=camelName%>Service, "<%=name%>");
