import { Avatar, Flex,Button ,Image, Text , Box, Divider, Spinner } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import Action from "../components/Action"
import useGetUserProfile from "../hooks/useGetUserProfile"
import useShowToast from "../hooks/userShowToast"
import { useNavigate, useParams } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import { DeleteIcon } from "@chakra-ui/icons"


const PostPage = () => {
   
    const {user , loading} = useGetUserProfile();
    const [post , setPost] = useState(null)
    const showToast = useShowToast();
    const { pid } = useParams();
    console.log("Pid console log ->",pid)
    const currentUser = useRecoilValue(userAtom)
    const navigate = useNavigate();

    
    useEffect(() =>{
        const getPost = async () =>{
            setPost([])
            try {
                const res = await fetch(`/api/post/${pid}`);
                const data = await res.json();

                if(data.error){
                    showToast("Error" , data.error , "error")
                }
                console.log("D -> ",data);
                setPost([data])

            } catch (error) {
                showToast("Error" , error.message , "error")
            }
        }
        getPost();
    },[showToast , pid , setPost])
    
    const handleDeletePost =async () =>{
        try {
			if (!window.confirm("Are you sure you want to delete this post?")) return;

			const res = await fetch(`/api/posts/${currentPost._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.error) {
                showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Post deleted", "success");
			navigate(`/${user.username}`);
		} catch (error) {
            showToast("Error", error.message, "error");
		}
    }
    
    if(!user && loading){
        return(
            <Flex justifyContent={"center"}>
                <Spinner size={"xl"}/>
            </Flex>
        )
    }
    
    const currentPost = post[0];
    if(!currentPost) return null;
    console.log("current Post -> " , currentPost)
  return (
    <>
        <Flex>
            <Flex w={"full"} alignItems={"center"} gap={3}>
                <Avatar src={user.profilePic} size={"md"} name="Mark Zuckerberg"/>
                <Flex>
                    <Text fontSize={"sm"} fontWeight={"bold"}>
                        {user.username}
                    </Text>
                    <Image src="/verified.png" w='4' h={4} ml={4}/>
                </Flex>
            </Flex>
            <Flex gap={4} alignItems={"center"}>
                        <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>{post?.createdAt ? `${formatDistanceToNow(new Date(post?.createdAt))} ago ` : "Invalid"}</Text>

                        {
                            currentUser?._id === user?._id && <DeleteIcon size={24} cursor={"pointer"}
                            onClick={handleDeletePost}
                            />
                        }

                    </Flex>
        </Flex>

        <Text my={3}>{post?.text}</Text>
        
        {
            post.img && (
                <Box 
                    borderRadius={6}
                    overflow={"hidden"}
                    border={"1px solid"}
                    borderColor={"gray.light"}
                    >
                    <Image src={"/post1.png"} w={"full"}/>
                </Box>
            )
        }

        <Flex gap={3} my={3}>
            <Action post={post}/>
        </Flex>
        <Divider my={4}/>

        <Flex justifyContent={"space-between"}>
            <Flex gap={2} alignItems={"center"}>
                <Text fontSize={"2xl"}>👋</Text>
                <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
            </Flex>
            <Button>Get</Button>
        </Flex>
        <Divider my={4}/>

        {post.replies}
    {/*
        <Comment Comment="looks relly good"
        createdAt="12h"
        likes={52}
        usename="kal ana"
        userAvatar ="https://bit.ly/prosper-baba"
        />
    */}
    </>
  )
}

export default PostPage
