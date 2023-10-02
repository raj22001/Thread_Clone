import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    text:{
        type:String,
        maxLength:500,
    },
    img:{
        type:String
    },
    likes:{
        //so we dont who like or not so we create array and store the id in array
        type : [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default :[]
    },
    replies:[
        {
            userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User',
                required:true
            },
            text:{
                type:String,
                required:true
            },
            userProfilePic:{
                type:String,
            },
            username:{
                type:String
            }
        }
    ]
},{
    timesstamps : true
}
);

const Post = mongoose.model("Post" , postSchema);
export default Post;