import express from "express";

import {
  deleteUser,
  getAllUsers,
  getUserById,
  loginUser,
  registerUser,
  updateUser,
  validateRefreshToken,
} from "../controller/users";
import { checkAuthentication } from "../middleware";

const userRouter = express.Router();

/**
 * @swagger
 * /api/users:
 *    get:
 *      summary: Get all users
 *      produces:
 *        - application/json
 *      tags:
 *        - Users
 *      responses:
 *        "200":
 *          description: Returns a list of all users
 *          schema:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/User'
 *        "404":
 *          description: No users found
 */
userRouter.get("/", getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *    get:
 *      summary: Get a specific user
 *      produces:
 *        - application/json
 *      tags:
 *        - Users
 *      parameters:
 *        - name: id
 *          description: User id
 *          in: path
 *          type: integer
 *          required: true
 *          example: 1
 *      responses:
 *        "200":
 *          description: Returns a user along with his/her cart and orders
 *          schema:
 *            $ref: '#/components/schemas/User'
 *        "404":
 *          description: User not found
 */
userRouter.get("/:id", getUserById);

/**
 * @swagger
 * /api/users:
 *    post:
 *      summary: Creates a new user
 *      produces:
 *        - application/json
 *      tags:
 *        - Users
 *      requestBody:
 *        description: Data for new user
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  example: emilia@email.com
 *                password:
 *                  type: string
 *                  example: P4$sword
 *      responses:
 *        "201":
 *          description: Returns created user
 *          schema:
 *            $ref: '#/components/schemas/User'
 *        "400":
 *          description: No valid email / password provided or email is already in use
 */
userRouter.post("/", registerUser);

/**
 * @swagger
 * /api/users/login:
 *    post:
 *      summary: Login to get user's access token and refresh token
 *      produces:
 *        - application/json
 *      tags:
 *        - Users
 *      requestBody:
 *        description: User data to login
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  example: alice@email.com
 *                password:
 *                  type: string
 *                  example: P4$sword
 *      responses:
 *        "201":
 *          description: Logs in user and returns access and refresh tokens
 *          schema:
 *            type: object
 *            properties:
 *              accessToken:
 *                type: string
 *                description: Auth token required for performing authenticated actions
 *              refreshToken:
 *                type: string
 *                description: Auth token required for performing authenticated actions
 *        "400":
 *          description: No email/password provided
 *        "401":
 *          description: Invalid login credentials
 */
userRouter.post("/login", loginUser);

/**
 * @swagger
 * /api/users/{id}:
 *    put:
 *      summary: Updates the email or password of a user
 *      produces:
 *        - application/json
 *      tags:
 *        - Users
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: id
 *          description: User id
 *          in: path
 *          type: integer
 *          required: true
 *          example: 2
 *      requestBody:
 *        description: Updated user data
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  example: clark@test.com
 *                password:
 *                  type: string
 *                  example: P4$sword
 *      responses:
 *        "200":
 *          description: Returns updated user
 *          schema:
 *            $ref: '#/components/schemas/User'
 *        "400":
 *          description: No valid email / password provided or email is already in use
 *        "401":
 *          description: User not authenticated
 *        "403":
 *          description: User not authorized to edit this user
 *        "404":
 *          description: User not found
 */
userRouter.put("/:id", checkAuthentication, updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *    delete:
 *      summary: Deletes a user
 *      produces:
 *        - application/json
 *      tags:
 *        - Users
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: id
 *          description: User id
 *          in: path
 *          type: integer
 *          required: true
 *          example: 3
 *      responses:
 *        "204":
 *          description: User deleted
 *        "401":
 *          description: User not authenticated
 *        "403":
 *          description: User not authorized to delete this user
 *        "404":
 *          description: User not found
 */
userRouter.delete("/:id", checkAuthentication, deleteUser);

/**
 * @swagger
 * /api/users/refreshToken:
 *    post:
 *      summary: Generate and obtain a new refresh token
 *      produces:
 *        - application/json
 *      tags:
 *        - Users
 *      requestBody:
 *        description: Valid access- and refresh tokens
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                accessToken:
 *                  type: string
 *                  example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY2OTY0NzM1MywiZXhwIjoxNjY5NjQ3NjUzfQ.BYf_7uWhkr-wPUMzNegZDE1oTvInItMeLp_kR9AxNXU
 *                refreshToken:
 *                  type: string
 *                  example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImp0aSI6IjlkNzE5YjRlLTlhNWEtNDQ4OS05ZGFmLTllMTc0NTUyMTBjMSIsImlhdCI6MTY2OTY0NzM1MywiZXhwIjoxNjY5Njc2MTUzfQ.ZcIPlAgkZnKc-Nu33Tr-Xayqq9QiOC8S_nU-jWpBnlE
 *      responses:
 *        "201":
 *          description: Returns access token with newly generated refresh token
 *          schema:
 *            type: object
 *            properties:
 *              accessToken:
 *                type: string
 *                description: Auth token required for performing authenticated actions
 *              refreshToken:
 *                type: string
 *                description: Auth token required for performing authenticated actions
 *        "400":
 *          description: No access / refresh token provided
 *        "401":
 *          description: Not authorized to obtain refresh token
 */
userRouter.post("/refreshToken", checkAuthentication, validateRefreshToken);
// userRouter.post("/:id", checkAuthentication, revokeRefreshTokens); ADMIN ROUTE

module.exports = userRouter;
