import { Request, Response } from "express";
import User from "../models/user.model";
import handleResponse from "../response/handleResponse";
import Role from "../models/role.model";
import config from "../config/auth.config";
import { Op } from "sequelize";
import Jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export default class UserController {
    //create a user
    async signup(req: Request, res: Response) {
        const {
            name, username, email, password, address, phone, website, company, roles, // Optional array of role names (e.g., ['admin', 'user'])
        } = req.body;
        // Basic validation
        if (!username || !email || !password) {
            handleResponse(res, 400, "Username, email, and password are required");
            return;
        }
        try {
            // Create the user with hashed password
            const user = await User.create({
                name,
                username,
                email,
                password: bcrypt.hashSync(password, 8),
                address,
                phone,
                website,
                company,
            });

            // Assign roles
            if (roles && Array.isArray(roles)) {
                const foundRoles = await Role.findAll({
                    where: { name: { [Op.or]: roles } },
                });
                await user.$set("roles", foundRoles);
            } else {
                await user.$set("roles", [1]); // Default to role ID 1
            }

            handleResponse(res, 201, "User registered successfully");
        } catch (err) {
            console.error("Signup error:", err);
            handleResponse(res, 500, "Internal Server Error");
        }
    };

    //find all users
    async findAll(req: Request, res: Response) {
        const usernameQuery = typeof req.query.username === "string" ? req.query.username : "";

        try {
            // If username query is present, filter users by username LIKE '%usernameQuery%'
            const condition = usernameQuery ? {
                username: {
                    [Op.like]: `%${usernameQuery}%`
                }
            } : {};

            const users = await User.findAll({ where: condition });

            handleResponse(res, 200, "Users fetched successfully", users);
        } catch (err) {
            console.error(err);
            handleResponse(res, 500, "Internal Server Error!");
        }
    }

    async signin(req: Request, res: Response) {
        try {
            const user = await User.findOne({
                where: { username: req.body.username },
                include: [Role], // eager load roles
            });

            if (!user) {
                return handleResponse(res, 404, "User not found");
            }

            const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordIsValid) {
                return handleResponse(res, 401, "Invalid password!");
            }

            const token = Jwt.sign({ id: user.id }, config.secret, {
                algorithm: "HS256",
                allowInsecureKeySizes: true,
                expiresIn: 86400, // 24 hours
            });

            const authorities: string[] = [];
            const roles = user.roles as Role[]; // Type assertion
            if (roles && Array.isArray(roles)) {
                for (const role of roles) {
                    authorities.push("ROLE_" + role.name.toUpperCase());
                }
            }

            // Send full user info (excluding password)
            res.status(200).send({
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                address: user.address,
                phone: user.phone,
                website: user.website,
                company: user.company,
                roles: authorities,
                accessToken: token,
            });
        } catch (err) {
            console.error("Signin error:", err);
            handleResponse(res, 500, "Internal server error!");
        }
    };

    async update(req: Request, res: Response) {
        const userId = parseInt(req.params.id);

        try {
            // Update basic user fields
            const { password, ...otherFields } = req.body;

            if (password) {
                otherFields.password = bcrypt.hashSync(password, 8);
            }
            const [updatedCount] = await User.update(req.body, { where: { id: userId } });

            if (updatedCount !== 1) {
                return handleResponse(res, 404, `Cannot update user with id=${userId}`);
            }

            // Find the updated user instance
            const user = await User.findByPk(userId);
            if (!user) return handleResponse(res, 404, "User not found after update");

            // Handle role update
            const roleNames = req.body.roles; // e.g., ["admin", "moderator"]
            if (roleNames && Array.isArray(roleNames)) {
                const foundRoles = await Role.findAll({
                    where: {
                        name: {
                            [Op.or]: roleNames,
                        },
                    },
                });

                // Associate the new roles
                await user.$set("roles", foundRoles);
            }

            //Fetch updated user with roles
            const fullUser = await User.findByPk(userId, { include: [Role] });
            if (!fullUser) {
                return handleResponse(res, 404, "User not found after update");
            }

            handleResponse(res, 200, `User with id=${userId} updated successfully`, fullUser);
        } catch (err) {
            console.error("Update error:", err);
            handleResponse(res, 500, "Internal server error");
        }
    };

    async deleteUser(req: Request, res: Response) {
        const id = parseInt(req.params.id);

        try {
            const numDeleted = await User.destroy({ where: { id } });

            if (numDeleted === 1) {
                return handleResponse(res, 200, `Deleted user with id ${id}`);
            } else {
                return handleResponse(res, 404, `User with id=${id} not found`);
            }
        } catch (err) {
            console.error("Delete error:", err);
            return handleResponse(res, 500, "Internal Server Error!");
        }
    };

}