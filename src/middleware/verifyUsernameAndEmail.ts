import { Request, Response, NextFunction } from "express";
import handleResponse from "../response/handleResponse";
import User from "../models/user.model";
import Role from "../models/role.model";

const checkDuplicateUsernameOrEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { username, email } = req.body;
        // check if username exist
        const existingUsername = await User.findOne({ where: { username } });
        if (existingUsername) {
            handleResponse(res, 400, "Failed! Username is already in use!");
            return;
        }
        // Check if email exists
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            handleResponse(res, 400, "Failed! Email is already in use!");
            return;
        }

        next(); // If no duplicates, proceed to the next middleware/controller
    } catch (err) {
        handleResponse(res, 500, "Internal server error.");
        return;
    }

}

const checkValidRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const VALID_ROLES = Role.VALID_ROLES;
        const roles = req.body.roles;
        if (roles) {
            for (const role of roles) {
                //If the current role is not in the list of valid roles.
                if (!VALID_ROLES.includes(role)) {
                    handleResponse(res, 400, `Failed! Role does not exist = ${role}`);
                    return;
                }
            }
        }
        next();
    } catch (err) {
        handleResponse(res, 500, "Internal server error.");
    }
};


const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkValidRole
};

export default verifySignUp;