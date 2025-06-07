import { Response } from "express";
import User from "../models/user.model";
// Standardized response function
const handleResponse = (res: Response, status: number, message: string, data?: User[] | User) => {
    res.status(status).json({
        status,
        message,
        data
    });
};

export default handleResponse;