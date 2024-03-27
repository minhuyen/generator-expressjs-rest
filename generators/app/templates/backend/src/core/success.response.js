import { ReasonPhrases, StatusCodes } from "http-status-codes";

export class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonStatusCode = ReasonPhrases.OK,
    data
  }) {
    this.message = !message ? reasonStatusCode : message;
    this.status = statusCode;
    this.data = data;
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}
