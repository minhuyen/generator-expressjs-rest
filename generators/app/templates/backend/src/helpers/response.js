// https://github.com/cryptlex/rest-api-response-format
export default class Response {
  static success(res, data, status = 200) {
    res.status(status);
    if (data && data.docs) {
      return res.json({
        status: 'success',
        data: data.docs,
        total: data.totalDocs,
        limit: data.limit,
        page: data.page,
        pages: data.totalPages
      });
    }
    return res.json({
      status: 'success',
      data: data
    });
  }

  static error(res, error, status = 400) {
    res.status(status);
    return res.json({
      success: 'failed',
      error: {
        message: error.message,
        code: error.code,
        errors: error.errors
      }
    });
  }
}
