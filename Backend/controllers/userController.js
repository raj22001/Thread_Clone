import User from "../models/userModel.js";
import bcrypt from "bcryptjs"
import generateTokenAndCookie from "../utils/helpers/generateTokenAndCookie.js";
import {v2 as cloudinary} from "cloudinary"
import mongoose from "mongoose";


const getUserProfile = async(req , res ) => {
    
    const { query } = req.params;

	try {
		let user;

		// query is userId
		if (mongoose.Types.ObjectId.isValid(query)) {
			user = await User.findOne({ _id: query }).select("-password").select("-updatedAt");
		} else {
			// query is username
			user = await User.findOne({ username: query }).select("-password").select("-updatedAt");
		}

		if (!user) return res.status(404).json({ error: "User not found" });

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in getUserProfile: ", err.message);
	}
}

 const signupUser = async(req , res) =>{
    try{
        const {name , email , username , password } = req.body;

        const user = await User.findOne({$or:[{email},{username}]});

        if(user){
            return res.status(400).json({error:"User Already Exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            name,
            email,
            username,
            password:hashedPassword
        })

        await newUser.save();

        if(newUser){
            generateTokenAndCookie(newUser._id , res);
            res.status(201).json({
                id: newUser._id,
                name: newUser.name,
                email:newUser.email,
                username: newUser.username,
                bio :newUser.bio,
                profilePic : newUser.profilePic,
            })
        }else{
            res.status(400).json({
                error:"Invalid usea data"
            })
        }

    }catch(err){
        res.status(500).json({
            error:err.message,
        })
        console.log("Message -> signup" , err.error)
    }
};


const loginUser = async(req , res) =>{
    try{
        const {username , password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password , user?.password || "");

        if(!user || !isPasswordCorrect){
            return res.status(400).json({
                error: "Invalid user and Password"
            })
        }

        generateTokenAndCookie(user._id , res);

        res.status(200).json({
            _id : user._id,
            name : user.name,
            email: user.email,
            username : user.username,
            bio : user.bio,
            profilePic : user.profilePic
        });

    }catch(err){
        res.status(500).json({
            error: err.message
        });
        console.log("Error in Login User -> " , err.error);
    }
}

const logoutUser = async(req , res) =>{
    try {
        res.cookie("jwt" , "" , {maxAge:1});
        res.status(200).json({
            message :"User logged out successfully"
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
        console.log("Error in Logout User -> " , err.error);
    }
}

const followUnfollowUser = async(req , res) =>{
    try {
        
        const {id} = req.params;
        const userToModify = await User.findById(id);
        const curruser = await User.findById(req.user._id)

        if(id === req.user._id.toString())
            return res.status(400).json({error:"You cannot follow/unfollow yourself"})

        if(!userToModify || !curruser){
            return res.status(400).json({
                error: "User not found" 
            })
        }

        const isfollowing = curruser.following.includes(id);

        if(isfollowing){
            await User.findByIdAndUpdate(id , {$pull :{followers : req.user._id}});
            await User.findByIdAndUpdate(req.user._id , {$pull : {following:id}});

            return res.status(200).json({ message: "User unfollowed successfully" });
        }else{
            await User.findByIdAndUpdate(id , {$push : {followers : req.user._id}});
            await User.findByIdAndUpdate(req.user._id , {$push : {following : id}});
        
            return res.status(200).json({ message: "User followed successfully" });
        }

    } catch (err) {
        return res.status(500).json({ error: err.message });
		console.log("Error in followUnFollowUser: ", err.message);
    }
}

const updateUser = async(req , res) =>{
    const {name , email , username, password ,  bio } = req.body;
    let {profilePic} = req.body
    const userId = req.user._id
    try {

        let user = await User.findById(userId);
        if(!user){
            return res.status(400).json({
                error:"Your not Found"
            })
        }


        if(req.params.id !== userId.toString()){
            return res.status(400).json({
                error:"You cannot update other profile"
            })
        }

        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password , salt);
            user.password = hashedPassword;
        }

        if(profilePic){
            if(user.profilePic){
                await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(profilePic)
            profilePic = uploadedResponse.secure_url
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username; 
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio


        user = await user.save();

        user.password = null;

        return res.status(200).json(user);

    } catch (err) {
        return res.status(500).json({
            error:err.message
        })
        console.log("updated Error -> " , err.error);
    }
};


export {signupUser , loginUser , logoutUser , followUnfollowUser , updateUser , getUserProfile }
