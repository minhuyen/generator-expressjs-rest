import { Service } from '../../helpers/common';
import RefreshToken from './refreshToken.model';


class RefreshTokenService extends Service {
  constructor() {
    super(RefreshToken);
  }
}

export default new RefreshTokenService();
