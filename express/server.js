'use strict';
const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require("body-parser");
const mongo = require('./db/conectionMongo');
const fileUpload = require('express-fileupload');
const app = express();

const router = express.Router();

console.log('ENTRA AL APP');

/* MIDDLE | bodyParser for parse to JSON format */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());

/* IMPORT ROUTER MODULES */
app.get("/", (req, res) => {
  res.send({
      description: 'Access denied',
      response: []
  });
});

const routesApp = require("./routes/appRoutes")(app);

mongo.conectar(app);
app.use('/.netlify/functions/server', router);  // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
