import axios from 'axios';

class APIClient {
  #instance;

  static get(...args) {
    return new APIClient().get(...args);
  }

  static put(...args) {
    return new APIClient().put(...args);
  }

  constructor(baseURL) {
    this.#instance = axios.create({
      baseURL,
      headers: { 'Content-Type': 'application/json' },
    });

    this.#instance.interceptors.response.use(({ data }) => data);
  }

  get(...args) {
    return this.#instance.get(...args);
  }

  put(...args) {
    return this.#instance.put(...args);
  }
}

export default APIClient;
