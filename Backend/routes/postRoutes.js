import express from "express"
import { createPost, getPost , deletePost, LikeUnLikePost , replyToPost , feedPost , getUserPosts} from "../controllers/postController.js";
import  protectRoute  from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/feed" , protectRoute, feedPost);
router.get("/:id" , getPost)
router.get("/user/:username", getUserPosts)
router.post("/create", protectRoute, createPost)
router.delete("/:id", protectRoute, deletePost)
router.put("/like/:id" , protectRoute , LikeUnLikePost)
router.put("/reply/:id" , protectRoute , replyToPost)


export default router