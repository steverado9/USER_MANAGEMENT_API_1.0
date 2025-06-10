import { Sequelize } from "sequelize-typescript";
import { Dialect } from "sequelize";
import { config, dialect } from "../config/db.config";
import User from "../models/user.model";
import Role from "../models/role.model";
import UserRole from "../models/userRole.model";

class Database {
    public sequelize!: Sequelize;

    constructor() {
        this.connectToDatabase();
    }

    private async connectToDatabase(): Promise<void> {
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
            await this.seedUsers();
            await this.seedRoles();
            await this.seedUserRole();
        } catch (err) {
            console.error("Unable to connect to the Database:", (err as Error).message)
        }
    }
    //The database needs to have those role records available
    private async seedRoles(): Promise<void> {
        try {
            const RoleModel = this.sequelize.models.Role as typeof Role;

            const roles = ["user", "moderator", "admin"];

            for (let i = 0; i < roles.length; i++) {
                await RoleModel.findOrCreate({
                    where: { name: roles[i] },
                    defaults: { id: i + 1, name: roles[i] },
                });
            }
            console.log("Roles table seeded.");
        } catch (err) {
            console.error("Roles Table Seeding failed:", (err as Error).message);
        }
    }

    private async seedUsers(): Promise<void> {
        try {
            const UserModel = this.sequelize.models.User as typeof User;

            await UserModel.findOrCreate({
                where: { username: "stephen1" },
                defaults: {
                    id: 1,
                    name: "stephen",
                    username: "stephen1",
                    email: "stephen@email.com",
                    password: "stephen123",
                    phone: 80,
                    website: "http://www.stephen.com"
                }
            });
            console.log("Users seeded.");
        } catch (err) {
            console.error("Users Table Seeding failed:", (err as Error).message);
        }
    }

    private async seedUserRole(): Promise<void> {
        try {
            const UserRoleModel = this.sequelize.models.UserRole as typeof UserRole;

            await UserRoleModel.findOrCreate({
                where: { userId: 1 },
                defaults: {
                    userId: 1,
                    roleId: 1
                }
            });
            console.log("UserRole seeded.");
        } catch (err) {
            console.error("UserRole Table Seeding failed:", (err as Error).message);
        }
    }
}

export default Database;
