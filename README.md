# AWS S3 based API Gateway SDK for JavaScript

The SDK for the API Gateway that hides data under HTTPS interactions with widely used services and their domain names: AWS S3, so for internet providers everything would look like a regular usage of those services.

## Concept

The protocol assumes the following interaction:
- There are readable 'responses' S3 folder and writable (but not readable) 'requests' S3 folder that are used to exchange data.
- The client generates a long random path and sends request files to the 'requests' S3 folder. The request file contains the request info `{ method, path, headers, params }` and the client info `{ id }`.
- The server listens for new request files, processes them and then writes the response to the 'responses' S3 folder with the same path.

## Demo

There is a [demo app](https://s3.amazonaws.com/s3.web.app/index.html), the source is [here](https://github.com/fuck-lukashenko/s3-web-app).

## Usage

It's expected that you have a `clientId`. If don't, please contact the server maintainer to obtain your `clientId`. On the server, each `clientId` is restricted to be used for API calls with some base URL associated with it.

### Install the `s3-api-gateway-sdk` package:

For npm:
```
npm install github:fuck-lukashenko/s3-api-gateway-sdk
```

For yarn:
```
yarn add github:fuck-lukashenko/s3-api-gateway-sdk
```

### Initialize the client:
```js
import S3BasedAPIGateway from 's3-api-gateway-sdk';

const client = new S3BasedAPIGateway({
  clientId: 'your-client-id-here',
});
```

### Make API calls:
```js
  // GET request
  client.get(endpoint, params, headers);
```
```js
  // POST request
  client.post(endpoint, params, headers);
```
```js
  // PATCH request
  client.patch(endpoint, params, headers);
```
```js
  // PUT request
  client.put(endpoint, params, headers);
```
```js
  // DELETE request
  client.delete(endpoint, params, headers);
```
```js
  // HEAD request
  client.head(endpoint, params, headers);
```
```js
  // OPTIONS request
  client.options(endpoint, params, headers);
```

## Advanced usage

```js
import S3BasedAPIGateway from 's3-api-gateway-sdk';

const client = new S3BasedAPIGateway({
  clientId: 'your-client-id-here',
  logger: console, // Optional. By default, there is a silent mode.
});
```
