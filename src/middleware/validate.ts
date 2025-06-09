import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

// This function returns middleware that validates req.body
export const validate = (schema: ZodSchema) => {
    console.log("validate");
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);
        console.log("Validating: = >", req.body);
        if (!result.success) {
            const errors = result.error.format();
            console.log("errors");
            res.status(400).json({ message: "Validation error", errors });
            return;
        }

        // Attach parsed data to req.body (clean and validated)
        req.body = result.data;
        next();
    
    };
};
