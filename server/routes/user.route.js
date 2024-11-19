import { Router } from "express";
import { getUser, updateProfile } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/update-profile").patch(verifyJWT, upload.single("profilePicture"), updateProfile);
router.route("/:userId").get(getUser)

export default router;
