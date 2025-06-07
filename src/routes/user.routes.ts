import { Router } from "express";
import UserController from "../controllers/user.controller";
import verifySignUp from "../middleware/verifyUsernameAndEmail";
import { validate } from "../middleware/validate";
import { signupSchema, signinSchema, updateUserSchema } from "../validation/user.validation";

class UserRoutes {
    router = Router();
    usercontroller = new UserController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        //register a new user
        /**
        * @swagger
        * /users:
        *   post:
        *     summary: Register a new user
        *     tags: [Users]
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             type: object
        *             required:
        *               - username
        *               - email
        *               - password
        *             properties:
        *               name:
        *                 type: string
        *               username:
        *                 type: string
        *               email:
        *                 type: string
        *               password:
        *                 type: string
        *               address:
        *                 type: string
        *               phone:
        *                 type: string
        *               website:
        *                 type: string
        *               company:
        *                 type: string
        *               roles:
        *                 type: array
        *                 items:
        *                   type: string
        *                   enum: [user, admin, moderator]
        *     responses:
        *       201:
        *         description: User registered successfully
        *       400:
        *         description: Validation error
        *       500:
        *         description: Internal server error
        */
        this.router.post("/", [
            validate(signupSchema),
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkValidRole
        ], this.usercontroller.signup);

        // //Retrieve all users
        /**
        * @swagger
        * /users:
        *   get:
        *     summary: Retrieve all users
        *     tags: [Users]
        *     parameters:
        *       - in: query
        *         name: username
        *         schema:
        *           type: string
        *         required: false
        *         description: Filter users by username
        *     responses:
        *       200:
        *         description: Users fetched successfully
        *       500:
        *         description: Internal server error
        */
        this.router.get("/", this.usercontroller.findAll);

        //signin a single user
        /**
        * @swagger
        * /users/signin:
        *   post:
        *     summary: Sign in a user
        *     tags: [Users]
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             type: object
        *             required:
        *               - username
        *               - password
        *             properties:
        *               username:
        *                 type: string
        *               password:
        *                 type: string
        *     responses:
        *       200:
        *         description: User signed in successfully
        *       401:
        *         description: Invalid password
        *       404:
        *         description: User not found
        *       500:
        *         description: Internal server error
        */
        this.router.post("/signin", validate(signinSchema), this.usercontroller.signin);

        // //update a user with id
        /**
        * @swagger
        * /users/{id}:
        *   put:
        *     summary: Update a user
        *     tags: [Users]
        *     parameters:
        *       - in: path
        *         name: id
        *         required: true
        *         schema:
        *           type: integer
        *         description: The user ID
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             type: object
        *             properties:
        *               name:
        *                 type: string
        *               email:
        *                 type: string
        *               address:
        *                 type: string
        *               phone:
        *                 type: string
        *               website:
        *                 type: string
        *               company:
        *                 type: string
        *               roles:
        *                 type: array
        *                 items:
        *                   type: string
        *                   enum: [user, admin, moderator]
        *     responses:
        *       200:
        *         description: User updated successfully
        *       404:
        *         description: User not found
        *       500:
        *         description: Internal server error
        */
        this.router.put("/:id", validate(updateUserSchema), this.usercontroller.update);

        // //Delete a user with id
        /**
        * @swagger
        * /users/{id}:
        *   delete:
        *     summary: Delete a user
        *     tags: [Users]
        *     parameters:
        *       - in: path
        *         name: id
        *         required: true
        *         schema:
        *           type: integer
        *         description: The user ID
        *     responses:
        *       200:
        *         description: User deleted successfully
        *       404:
        *         description: User not found
        *       500:
        *         description: Internal server error
        */
        this.router.delete("/:id", this.usercontroller.deleteUser);
    }
}

export default new UserRoutes().router;
