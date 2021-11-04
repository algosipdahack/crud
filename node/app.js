const loaders = require('./loaders');
const express = require('express');

async function startServer() {
  const app = express();
  await loaders.init({ expressApp: app });
}

startServer();