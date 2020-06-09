import { Controller } from '../../helpers/common';
import <%=camelName%>Service from './<%=camelName%>.service';
import { handleResponse as Response } from '../../helpers';

class <%=name%>Controller extends Controller {
  constructor(service, name) {
    super(service, name);
  }
}

export default new <%=name%>Controller(<%=name%>Service, '<%=name%>');
