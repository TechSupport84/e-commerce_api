import express  from "express"
import {register, login, getUsers, getUserById, updateUser, deleteUser }from "../controllers/userController.js"
const router = express.Router()


router.post("/register", register);
router.post("/login", login);

router.get("/users", getUsers);
router.get("/user/:id", getUserById);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);




export default router