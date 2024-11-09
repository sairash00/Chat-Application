//routes import

import { register, login, getUsers, getUser, isLoggedIn, logout, addProfile, deleteProfile, updateUsername, searchUsers } from "../controller/user.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import upload from "../middlewares/multer.middleware.js";

import express from "express";
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/get/:id").get(authenticate,getUser);
router.route("/getAllUsers").get(authenticate,getUsers)
router.route("/logout").post(authenticate,logout)
router.route("/addProfile").post(upload.single("image"),authenticate,addProfile);
router.route("/removeProfile").post(authenticate,deleteProfile);
router.route("/updateUsername").post(authenticate,updateUsername);
router.route("/search").get(authenticate,searchUsers);
router.route("/isloggedin").get(authenticate, isLoggedIn)

// router.route("/isLoggedIn").get(isLoggedIn)

export default router;
 