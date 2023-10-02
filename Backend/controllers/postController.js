import User from "../models/userModel.js"
import Post from "../models/postModel.js"
import {v2 as cloudinary} from "cloudinary"
import mongoose from "mongoose";


const Mongoose = mongoose
const createPost = async(req , res) =>{
    try {
        const {postedBy , text } = req.body;
        let {img} = req.body

        if(!postedBy || !text){
            return res.status(400).json({
                error:"PostedBy and Text fields are required"
            })
        }

        const user = await User.findById(postedBy);

        if(!user){
            return res.status(404).json({
                error:"user is not exist"
            })
        }



        if(user._id.toString() !== req.user._id.toString()){
            return res.status(401).json({
                error:"unauthorized to create post"
            })
        }

        const maxLength = 200;
        if(text.length > maxLength){
            return res.status(401).json({
                error : `Text must be less than ${maxLength} characters` 
            })
        }
        
        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = await uploadedResponse.secure_url
        }

        const newPost = new Post({postedBy , text , img});
        await newPost.save();

        return res.status(201).json({
            message:"Post Created successfully" , 
            newPost
        })

    } catch (error) {
        res.status(500).json({
            message:error.message
        })
        console.log(error.message)
    }
}


const getPost = async(req , res) =>{
    try {

        if (!Mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({
              error: "Invalid Post ID"
            });
        }

        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                error:"Post not Found"
            })
        }

        res.status(200).json(post);

    } catch (error) {
        res.status(500).json({
            error:error.message
        })
        console.log(error.message)
    }
}

const deletePost = async(req , res) =>{
    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                error:"Post was not found"
            })
        }
        
        if(post.postedBy.toString() !== req.user._id.toString()){
            return res.status(401).json({
                error:"Unauthorized to delte post"
            })
        }

        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId)
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message:"Post Deleted",post
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
        console.log("Post Delted error ->" , error.message)
    }
}

const LikeUnLikePost = async(req , res) =>{
    try{
        const {id:postId} = req.params;

        const userId = req.user._id;

        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({
                error:"Post not Found"
            })
        }

        const userLikedPost = post.likes.includes(userId);

        if(userLikedPost){

            await Post.updateOne({_id : postId} , {$pull : {likes : userId}})
            return res.status(200).json({
                message:"Post Unlike Successfully"
            })

        }else{
            post.likes.push(userId);
            await post.save();
            return res.status(200).json({
                message:"Post Like SuccessFully"
            })
        }

    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}

const replyToPost = async(req , res) =>{
    try {

        const {text} = await req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        const userProfilePic = req.user.profilePic;
        const username = req.user.username;

        if(!text){
            return res.status(400).json({
                message : "text field is required"
            });
        }

        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({
                message:"Post not Found"
            })
        }

        const reply = {userId , text , userProfilePic , username};

        post.replies.push(reply);
        await post.save();

        res.status(200).json({
            message :"reply Added Successfully",post
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

const feedPost = async(req , res) =>{
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const following = user.following;

		const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

		res.status(200).json(feedPosts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getUserPosts = async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export {createPost , getPost , deletePost , LikeUnLikePost , replyToPost , feedPost , getUserPosts}