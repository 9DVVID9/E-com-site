import swaggerJsdoc from "swagger-jsdoc";

const options = {
  // definition: this is where we specify the general information of the API.
  definition: {
    openapi: "3.0.0", // We indicate that we are using OpenAPI version 3.0
    info: {
      title: "Products API",  // Title 
      version: "1.0.0",       // Version of our API
      description: "Simple CRUD API using SQLite" 
    },
  },

  apis: ["src/routes/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);