class APIClient {
  #baseURL;
  #defaultHeaders;

  static get(url, config) {
    return new APIClient().get(url, config);
  }

  static put(url, data, config) {
    return new APIClient().put(url, data, config);
  }

  constructor(baseURL = '') {
    this.#baseURL = baseURL;
    this.#defaultHeaders = { 'Content-Type': 'application/json' };
  }

  async #request(endpoint, method, body = null, config = {}) {
    let url = endpoint;
    
    if (this.#baseURL) {
      const base = this.#baseURL.replace(/\/+$/, '');
      const path = endpoint.replace(/^\/+/, '');
      url = `${base}/${path}`;
    }

    if (config.params) {
      const params = new URLSearchParams(config.params).toString();
      url += `?${params}`;
    }

    const headers = {
      ...this.#defaultHeaders,
      ...(config.headers || {}),
    };

    const fetchConfig = {
      method,
      headers,
    };

    if (body) {
      fetchConfig.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchConfig);

    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const error = new Error(`Request failed with status ${response.status}`);
      error.response = {
        status: response.status,
        statusText: response.statusText,
        data: data
      };
      throw error;
    }

    return data;
  }

  get(url, config = {}) {
    return this.#request(url, 'GET', null, config);
  }

  put(url, data, config = {}) {
    return this.#request(url, 'PUT', data, config);
  }
}

export default APIClient;
