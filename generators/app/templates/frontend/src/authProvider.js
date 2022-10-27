import decodeJwt from 'jwt-decode';
import tokenProvider from "./utils/tokenProvider";

const API_URL = process.env.API_URL || "";

const authProvider = {
  // authentication
  login: ({ username, password }) => {
    const request = new Request(`${API_URL}/api/v1/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email: username, password }),
      headers: new Headers({ "Content-Type": "application/json" })
    });
    return fetch(request)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.message);
        }
        return response.json();
      })
      .then(({ data }) => {
        const { token } = data;
        tokenProvider.setToken(token);
      })
      .catch(() => {
        throw new Error('Network error')
    });
  },
  checkError: error => {
    const status = error.status;
    if (status === 401 || status === 403) {
        tokenProvider.removeToken();
        return Promise.reject();
    }
    // other error code (404, 500, etc): no need to log out
    return Promise.resolve();
  },
  checkAuth: () => {
    return tokenProvider.getToken()
      ? Promise.resolve()
      : Promise.reject();
  },
  logout: () => {
    tokenProvider.removeToken();
    return Promise.resolve();
  },
  getIdentity: () => Promise.resolve(),
  // authorization
  getPermissions: () => {
    const token = tokenProvider.getToken();
    if (token) {
      const decodedToken = decodeJwt(token);
      const role = decodedToken.role;
      return role ? Promise.resolve(role) : Promise.reject();
    }
    return Promise.reject();
  },
}

export default authProvider;

