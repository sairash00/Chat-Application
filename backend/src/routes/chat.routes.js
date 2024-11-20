//routes import
import { createChat, deleteChat, deleteMessage, getChat, getUserChat, sendMessage } from "../controller/chat.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";

import express from "express";
const router = express.Router();

router.route("/create").post(authenticate,createChat);
router.route("/get/:id").get(authenticate,getChat);
router.route("/getAll").get(authenticate,getUserChat);
router.route("/delete").post(authenticate,deleteChat);
router.route("/sendMessage").post(authenticate, sendMessage)
router.route("/delMessage").post(authenticate, deleteMessage)

export default router;
 