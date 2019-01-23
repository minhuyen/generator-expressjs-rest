import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from "react-admin";

export default (loginUrlApi, noAccessPage = "/login") => {
  return (type, params) => {
    // called when the user attempts to log in
    if (type === AUTH_LOGIN) {
      const { username, password } = params;
      const request = new Request(loginUrlApi, {
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
        .then(({ token }) => {
          localStorage.setItem("token", token);
        });
    }
    // called when the user clicks on the logout button
    if (type === AUTH_LOGOUT) {
      localStorage.removeItem("token");
      return Promise.resolve();
    }
    // called when the API returns an error
    if (type === AUTH_ERROR) {
      const { status } = params;
      if (status === 401 || status === 403) {
        localStorage.removeItem("token");
        return Promise.reject();
      }
      return Promise.resolve();
    }
    // called when the user navigates to a new location
    if (type === AUTH_CHECK) {
      return localStorage.getItem("token")
        ? Promise.resolve()
        : Promise.reject();
    }
    return Promise.reject("Unknown method");
  };
};
