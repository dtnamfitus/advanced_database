import { Router } from "express";
import { UserController } from "../controller/user.controller";

const router = Router();
const userController = new UserController();

router.post("/", (req, res) => userController.createUser(req, res));
router.post("/login", (req, res) => userController.login(req, res));

export default router;
