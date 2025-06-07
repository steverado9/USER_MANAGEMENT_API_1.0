import { Request, Response } from "express";

const welcome = (req: Request, res: Response): void => {
    res.json({ message: "Welcome stephen!" });
}

export default welcome;