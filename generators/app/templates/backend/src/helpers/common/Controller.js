import httpStatus from 'http-status';
import aqp from 'api-query-params';
import Response from '../response';

class Controller {
  constructor(service, name) {
    this.service = service;
    this._name = name;
    this.findAll = this.findAll.bind(this);
    this.create = this.create.bind(this);
    this.findOne = this.findOne.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.get_queryset = this.get_queryset.bind(this);
  }

  async create(req, res, next) {
    try {
      const data = req.body;
      const result = await this.service.create(data);
      return Response.success(res, result);
    } catch (exception) {
      next(exception);
    }
  }

  get_queryset(req) {
    let params = aqp(req.query, {
      skipKey: 'page'
    });
    return params;
  }

  async findAll(req, res, next) {
    try {
      const query = this.get_queryset(req);
      const result = await this.service.findAll(query);
      return Response.success(res, result);
    } catch (exception) {
      next(exception);
    }
  }

  async findOne(req, res, next) {
    try {
      const result = await this.service.findById(req.params.id);
      if (!result) {
        return Response.error(
          res,
          {
            code: `${this._name.toUpperCase()}_NOT_FOUND`,
            message: `${this._name} does not found with id ${req.params.id}`
          },
          httpStatus.NOT_FOUND
        );
      }
      return Response.success(res, result);
    } catch (exception) {
      next(exception);
    }
  }

  async update(req, res, next) {
    try {
      const result = await this.service.update(req.params.id, req.body, {
        new: true
      });
      if (!result) {
        return Response.error(
          res,
          {
            code: `${this._name.toUpperCase()}_NOT_FOUND`,
            message: `${this._name} does not found with id ${req.params.id}`
          },
          httpStatus.NOT_FOUND
        );
      }
      return Response.success(res, result);
    } catch (exception) {
      next(exception);
    }
  }

  async remove(req, res, next) {
    try {
      const result = await this.service.remove(req.params.id);
      if (!result) {
        return Response.error(
          res,
          {
            code: `${this._name.toUpperCase()}_NOT_FOUND`,
            message: `${this._name} does not found with id ${req.params.id}`
          },
          httpStatus.NOT_FOUND
        );
      }
      return Response.success(res, result);
    } catch (exception) {
      next(exception);
    }
  }
}

export default Controller;
