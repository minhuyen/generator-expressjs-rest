const tokenProvider = () => {
  const getRefreshedToken = () => {
    const refreshEndpoint = "/api/v1/auth/refresh-token";
    const request = new Request(refreshEndpoint, {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: "include",
    });
    return fetch(request)
      .then((response) => {
        if (response.status !== 200) {
          removeToken();
          return false;
        }
        return response.json();
      })
      .then(({ data }) => {
        if (data && data.token) {
          setToken(data.token);
          return true;
        }

        return false;
      });
  };

  const setToken = (token) => {
    // const decodedToken = decodeJwt(token);
    localStorage.setItem("token", token);
    return true;
  };

  const removeToken = () => {
    localStorage.removeItem("token");
    return true;
  };

  const getToken = () => {
    const token = localStorage.getItem("token");
    return token;
  };

  return {
    getRefreshedToken,
    getToken,
    setToken,
    removeToken,
  };
};

export default tokenProvider();
