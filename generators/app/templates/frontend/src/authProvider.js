import decodeJwt from 'jwt-decode';

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
        localStorage.setItem("token", data.token);
      })
      .catch(() => {
        throw new Error('Network error')
    });
  },
  checkError: error => {
    const status = error.status;
    if (status === 401 || status === 403) {
        localStorage.removeItem('token');
        return Promise.reject();
    }
    // other error code (404, 500, etc): no need to log out
    return Promise.resolve();
  },
  checkAuth: () => {
    return localStorage.getItem("token")
      ? Promise.resolve()
      : Promise.reject();
  },
  logout: () => {
    localStorage.removeItem("token");
    return Promise.resolve();
  },
  getIdentity: () => Promise.resolve(),
  // authorization
  getPermissions: () => {
    const token = localStorage.getItem("token");
    const decodedToken = decodeJwt(token);
    const role = decodedToken.role;
    return role ? Promise.resolve(role) : Promise.reject();
  },
}

export default authProvider;

