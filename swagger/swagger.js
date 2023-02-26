// this file was generated by serverless-auto-swagger
            module.exports = {
  "swagger": "2.0",
  "info": {
    "title": "Product Service",
    "version": "1"
  },
  "paths": {
    "/products": {
      "get": {
        "summary": "getProductsList",
        "description": "",
        "tags": [
          "product service"
        ],
        "operationId": "getProductsList.get.products",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [],
        "responses": {
          "200": {
            "description": "200 response"
          }
        }
      },
      "post": {
        "summary": "createProduct",
        "description": "",
        "tags": [
          "product service"
        ],
        "operationId": "createProduct.post.products",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "title",
            "in": "body",
            "required": true,
            "type": "string"
          },
          {
            "name": "description",
            "in": "body",
            "required": true,
            "type": "string"
          },
          {
            "name": "price",
            "in": "body",
            "required": true,
            "type": "number"
          },
          {
            "name": "count",
            "in": "boby",
            "required": true,
            "type": "number"
          }
        ],
        "responses": {
          "200": {
            "description": "200 response"
          }
        }
      }
    },
    "/products/{productId}": {
      "get": {
        "summary": "getProductById",
        "description": "",
        "tags": [
          "product service"
        ],
        "operationId": "getProductById.get.products/{productId}",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "productId",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "200 response"
          }
        }
      }
    }
  },
  "definitions": {},
  "securityDefinitions": {}
};