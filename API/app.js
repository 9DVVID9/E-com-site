import express from "express";
import cors from "cors";

import usersRoutes from "./src/routes/users.routes.js";
import productsRoutes from "./src/routes/products.routes.js";
import cartRoutes from "./src/routes/cart.routes.js";
import orderRoutes from './src/routes/orders.routes.js'; //-- new import for orders routes

import * as swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./src/swagger.js";

const app = express();
app.use(cors());
app.use(express.json());

//Server Port
const port = 3000;

//Initialize Server
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});

//Base Routes
app.use("/api/products", productsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/cart", cartRoutes);
app.use('/api/orders', orderRoutes); //-- new route for orders