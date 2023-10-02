import { Link, useNavigate } from "react-router-dom"
import { Box, Flex, Text } from "@chakra-ui/layout"
import { Avatar, Image } from "@chakra-ui/react"
import { formatDistanceToNow } from "date-fns";
import Action from "./Action"
import { useEffect, useState } from "react"
import useShowToast from "../hooks/userShowToast"
import {DeleteIcon} from "@chakra-ui/icons"
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { oc } from "date-fns/locale";

const Post = ({post , postedBy , setPosts}) => {
    const [user , setuser] = useState(null)
    const showToast = useShowToast()
    const navigate = useNavigate()
    const currentUser = useRecoilValue(userAtom)

    console.log("Post is here -> ",post );

    useEffect(() =>{
        const getUser = async () =>{
            try {
                const res = await fetch("/api/users/profile/" + postedBy )
                
                const data = await res.json();
                setuser(data)
                console.log("user data ->",user)
                console.log("Post data ->",post)
                if(data.error){
                    showToast("Error" , data.error , "error")
                    return;
                }
            } catch (error) {
                showToast("Error" , error.message , "error")
            }
        }
        getUser();
    },[postedBy , showToast])

    const handleDeletePost = async (e) =>{
        try {
            e.preventDefault();

            if(!window.confirm("Are you sure you want to delete this Post?")) return;

            const res = await fetch(`/api/post/${post._id}` ,{
                method :"DELETE",
            });

            const data = await res.json();
            if(data.error){
                showToast("Error" , data.error , "error");
            }
            showToast("Success" , "Post Deleted" , "success");
            setPosts((prev) => prev.filter((p) => p._id !== post._id))
        } catch (error) {
            showToast("Error" , error.message , "error");
            return;
        }
    }


  return (
    <Link to={`/${user?.username}/post/${post?.id}`}>
        <Flex gap={3} mb={4} py={5}>
            <Flex flexDirection={"column"} alignItems={"center"}>
                <Avatar size="md" name={user?.name} src={user?.profilePic}
                    onClick={(e) =>{
                        e.preventDefault();
                        navigate(`/${user?.username}`)
                    }}
                />
                <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>
                <Box position={"relative"} w={"full"}>
                {post?.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
                    {post?.replies[0] && (
                        <Avatar
                        size={"xs"}
                        name="John doe"
                        src={post?.replies[0]?.userProfilePic}
                        position={"absolute"}
                        top={"0px"}
                        left='15px'
                        padding={"2px"}
                    />
                    )}
                    
                    {post?.replies[1] && (
                        <Avatar
                        size={"xs"}
                        name="John doe"
                        src={post?.replies[1]?.userProfilePic}
                        position={"absolute"}
                        top={"0px"}
                        left='15px'
                        padding={"2px"}
                    />
                    )}
                    {post?.replies[2] && (
                        <Avatar
                        size={"xs"}
                        name="John doe"
                        src={post?.replies[2]?.userProfilePic}
                        position={"absolute"}
                        top={"0px"}
                        left='15px'
                        padding={"2px"}
                    />
                    )}
                </Box>
            </Flex>
            <Flex flex={1} flexDirection={"column"} gap={2}>
                <Flex justifyContent={"space-between"} w={"full"}>
                    <Flex w={"full"} alignItems={"center"}>
                        <Text fontSize={"sm"} fontWeight={"bold"}
                             onClick={(e) =>{
                                e.preventDefault();
                                navigate(`/${user?.username}`)
                            }}
                        >
                            {user?.username}
                        </Text>
                        <Image src="/verified.png" w={4} h={4} ml={1}/>
                    </Flex>
                    <Flex gap={4} alignItems={"center"}>
                        <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>{post?.createdAt ? `${formatDistanceToNow(new Date(post?.createdAt))} ago ` : "Invalid"}</Text>

                        {
                            currentUser?._id === user?._id && <DeleteIcon size={24} 
                            onClick={handleDeletePost}
                            />
                        }

                    </Flex>
                </Flex>
                <Text fontSize={"sm"}>{post?.text}</Text>
                {post?.img && (

                    <Box 
                    borderRadius={6}
                    overflow={"hidden"}
                    border={"1px solid"}
                    borderColor={"gray.light"}
                    >
                    <Image src={post?.img} w={"full"}/>
                </Box>
                )}
                <Flex gap={3} my={1}>
                    <Action post={post}/>
                </Flex>

               
            </Flex>
        </Flex>
    </Link>
  )
}

export default Post
