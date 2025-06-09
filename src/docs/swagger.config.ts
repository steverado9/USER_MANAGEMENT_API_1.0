import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "User Management API",
            version: "1.0.0",
            description: "API docs for user signup, signin, and management",
        },
        servers: [
            {
                url: "http://localhost:8080/api", // base URL
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
            
    },
    apis: ["./src/routes/**/*.ts"], // path to your route files
};

export const swaggerSpec = swaggerJSDoc(options);
