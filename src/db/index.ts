import { Sequelize } from "sequelize-typescript";
import { Dialect } from "sequelize";
import { config, dialect } from "../config/db.config";
import User from "../models/user.model";
import Role from "../models/role.model";
import UserRole from "../models/userRole.model";

class Database {
    public sequelize: Sequelize | undefined;

    constructor() {
        this.connectToDatabase();
    }

    private async connectToDatabase() {
        this.sequelize = new Sequelize({
            database: config.DB,
            username: config.USER,
            password: config.PASSWORD,
            host: config.HOST,
            dialect: dialect as Dialect,
            pool: {
                max: config.pool.max,
                min: config.pool.min,
                acquire: config.pool.acquire,
                idle: config.pool.idle
            },
            models: [User, Role, UserRole]
        });
        try {
            await this.sequelize.authenticate();
            // Drops all tables and re-creates them on every server start.
            await this.sequelize.sync({ force: true });
            console.log("connection has been established successfully.")
            // Call seedRoles after syncing
            await this.seedRoles();
        } catch (err) {
            console.error("Unable to connect to the Database:", (err as Error).message)
        }
    }
    //The database needs to have those role records available
    private async seedRoles() {
        if (!this.sequelize) return;

        const RoleModel = this.sequelize.models.Role as typeof Role;

        const roles = ["user", "moderator", "admin"];

        for (let i = 0; i < roles.length; i++) {
            await RoleModel.findOrCreate({
                where: { name: roles[i] },
                defaults: { id: i + 1, name: roles[i] },
            });
        }

        console.log("Roles table seeded.");
    }
}

export default Database;
