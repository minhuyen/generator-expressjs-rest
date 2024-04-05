import { ReasonPhrases, StatusCodes } from "http-status-codes";

export class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonStatusCode = ReasonPhrases.OK,
    data,
    total,
    limit,
    page,
    pages
  }) {
    this.message = !message ? reasonStatusCode : message;
    this.status = "success";
    this.statusCode = statusCode;
    this.data = data;
    this.total = total;
    this.limit = limit;
    this.page = page;
    this.pages = pages;
  }

  send(res, headers = {}) {
    const { statusCode, ...rest } = this;
    return res.status(statusCode).json(rest);
  }
}

export class OK extends SuccessResponse {
  constructor({ message, data }) {
    super({ message, data });
  }
}

export class CREATED extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.CREATED,
    reasonStatusCode = ReasonPhrases.CREATED,
    data
  }) {
    super({ message, statusCode, reasonStatusCode, data });
  }
}

export class LIST extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonStatusCode = ReasonPhrases.OK,
    data,
    total,
    limit,
    page,
    pages
  }) {
    super({
      message,
      statusCode,
      reasonStatusCode,
      data,
      total,
      limit,
      page,
      pages
    });
  }
}
