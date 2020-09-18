
export const Api = axios.create({
 // baseURL: 'https://api-todo-sipr1901.herokuapp.com/api/'
  baseURL: 'http://localhost:3000/api/'
});

Api.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["authorization"] = 'Bearer ' + token;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);


