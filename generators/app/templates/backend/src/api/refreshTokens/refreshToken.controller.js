import { Controller } from '../../helpers/common';
import refreshTokenService from './refreshToken.service';
import { handleResponse as Response } from '../../helpers';

class RefreshTokenController extends Controller {
  constructor(service, name) {
    super(service, name);
  }
}

export default new RefreshTokenController(refreshTokenService, 'RefreshToken');
