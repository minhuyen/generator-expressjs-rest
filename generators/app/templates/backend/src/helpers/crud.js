import httpStatus from 'http-status';
import aqp from 'api-query-params';
import Response from './response';

class CRUDController {
  constructor(model, name) {
    this._model = model;
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
      const result = await this._model.create(data);
      return Response.success(res, result);
    } catch (exception) {
      next(exception);
    }
  }

  async get_queryset(req) {
    let params = aqp(req.query, {
      skipKey: 'page'
    });
    return params;
  }

  async findAll(req, res, next) {
    console.log('==========findAll==========', this._model.collection.name);
    try {
      const { filter, skip, limit, sort, population } = await this.get_queryset(
        req
      );
      const result = await this._model.paginate(filter, {
        page: skip || 1,
        limit: limit || 25,
        sort: sort || '-createdAt',
        populate: population
      });
      return Response.success(res, result);
    } catch (exception) {
      next(exception);
    }
  }

  async findOne(req, res, next) {
    try {
      const result = await this._model.findById(req.params.id);
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
      const result = await this._model.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true
        }
      );
      return Response.success(res, result);
    } catch (exception) {
      next(exception);
    }
  }

  async remove(req, res, next) {
    try {
      const result = await this._model.findByIdAndRemove(req.params.id);
      return Response.success(res, result);
    } catch (exception) {
      next(exception);
    }
  }
}

export default CRUDController;
