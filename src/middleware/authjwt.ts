import { Request, Response, NextFunction } from "express";
import config from "../config/auth.config";
import User from "../models/user.model";
import Role from "../models/role.model";
import handleResponse from "../response/handleResponse";
import Jwt from "jsonwebtoken";

const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.headers["x-access-token"] as string;

        if (!token) {
            handleResponse(res, 403, "No token provided!");
            return;
        }

        Jwt.verify(token, config.secret, (err, decoded: any) => {
            if (err) {
                handleResponse(res, 401, "Unauthorized!");
                return;
            }
            req.userId = decoded.id;
            next();
        });
    } catch (err) {
        handleResponse(res, 500, "Internal Server Error");
    }
};

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findByPk(req.userId, { include: [Role] });
        if (!user) return handleResponse(res, 404, "User not found");

        const roles = user.roles as Role[];
        if (roles.some(role => role.name === "admin")) {
            next();
            return;
        }

        handleResponse(res, 403, "Require admin Role!");
    } catch (err) {
        handleResponse(res, 500, "Error checking Admin role.");
    }
};

const isModerator = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findByPk(req.userId, { include: [Role] });
        if (!user) return handleResponse(res, 404, "User not found");

        const roles = user.roles as Role[];
        if (roles.some(role => role.name === "moderator")) {
            next();
            return;
        }

        handleResponse(res, 403, "Require Moderator Role!");
    } catch (err) {
        handleResponse(res, 500, "Error checking Moderator role.");
    }
};

const isModeratorOrAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findByPk(req.userId, { include: [Role] });
        if (!user) return handleResponse(res, 404, "User not found");

        const roles = user.roles as Role[];
        const hasRole = roles.some(role => role.name === "moderator" || role.name === "admin");

        if (hasRole) {
            next();
            return;
        }

        handleResponse(res, 403, "Require Moderator or Admin Role!");
    } catch (err) {
        handleResponse(res, 500, "Error checking roles.");
    }
};

const authjwt = {
    verifyToken,
    isAdmin,
    isModerator,
    isModeratorOrAdmin,
};

export default authjwt;
