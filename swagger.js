// Optional: regenerates a basic swagger.json from the routes with swagger-autogen.
// NOTE: swagger.json in this repo is hand-tuned (examples, error responses).
// It writes to swagger-autogen-output.json so your hand-tuned swagger.json is never overwritten.
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: { title: 'CSE 341 Library API', description: 'Authors and books API' }
};

swaggerAutogen('./swagger-autogen-output.json', ['./routes/index.js'], doc);
