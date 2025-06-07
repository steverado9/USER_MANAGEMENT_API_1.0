import { Application } from "express";
import homeRoutes from "./home.routes";
import userRoutes from "./user.routes";

export default class Routes {
    constructor(app: Application) {
        app.use("/api", homeRoutes);
        app.use("/api/users", userRoutes);
    }
}