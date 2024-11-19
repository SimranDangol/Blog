import { Router } from "express";
import {
  google,
  login,
  logout,
  refreshAccessToken,
  register,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/google").post(google);
router.route("/logout").post(verifyJWT, logout);
router.route("/refresh-token").post(refreshAccessToken);
router.get('/verify', verifyJWT, (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(200, {
        user: req.user,
      }, "Token verified successfully")
    );
});

export default router;
