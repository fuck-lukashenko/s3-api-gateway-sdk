import APIClient from './APIClient.js';
import NativeCrypto from './NativeCrypto.js';
import { sleep } from './utils.js';

class Client {
  #clientId;
  #logger;

  constructor({
    clientId,
    logger,
  }) {
    this.#logger = logger;
    this.#logger.info('Initializing the client...');

    this.#clientId = clientId;
  }

  async request(method, endpoint, data, headers) {
    const startTime = new Date();
    const requestId = NativeCrypto.randomUUID();
    const marker = `[${requestId}]`;
    this.#logger.info(marker, 'Processing', method.toUpperCase(), endpoint);
    this.#logger.debug(marker, { method, endpoint, data, headers });

    this.#logger.info(marker, 'Sending the request file to the S3 requests folder...');
    this.#logger.debug(marker, {
      client: {
        id: this.#clientId,
      },
      request: {
        method,
        endpoint,
        headers,
        data
      },
    });
    await this.#sendRequest(requestId, {
      client: {
        id: this.#clientId,
      },
      request: {
        method,
        endpoint,
        headers,
        data
      },
    });
    this.#logger.info(marker, 'Sent the encrypted request file to the S3 requests folder.');

    this.#logger.info(marker, 'Waiting for a response...');
    const response = await this.#responseFor(requestId, marker);
    this.#logger.info(marker, 'The response is successfully received.');
    this.#logger.debug(marker, response);
    this.#logger.info(marker, 'Done in', (new Date() - startTime).toLocaleString(), 'ms.');

    return response;
  }

  async #responseFor(requestId, marker) {
    const responseUrl = `https://s3.amazonaws.com/i.i/responses/${requestId}.json`;

    while (true) {
      try {
        const { response } = await APIClient.get(responseUrl);
        this.#logger.info(marker, 'Downloaded the response.');

        return response;
      } catch(e) {
        this.#logger.info(marker, 'There is no response yet. Waiting...');
        await sleep(10);
      }
    }
  }

  async #sendRequest(requestId, data) {
    const requestUrl = `https://s3.amazonaws.com/i.i/requests/${requestId}.json`;

    await APIClient.put(requestUrl, data);
  }
}

export default Client;
