import { useEffect, useState } from "react"
import UserHeader from "../components/UserHeader"
import { useParams } from "react-router-dom";
import userShowToast from "../hooks/userShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post"
import useGetUserProfile from "../hooks/useGetUserProfile";


const UserPage = () => {

  const {user , loading} = useGetUserProfile()
  const [posts , setPosts] = useState([])
  const [fetchingPosts , setFetchingPosts] = useState(true)
  const {username} = useParams();
  const showToast = userShowToast();
  useEffect(() =>{

    


    const getPosts = async() =>{
      setFetchingPosts(true)
      try {
        const res = await fetch(`/api/post/user/${username}`);

        const data = await res.json();

        console.log(data);
        setPosts(data)
      } catch (error) {
        showToast("Error" , error.message , "error")
        setPosts([]); 
      }finally{
        setFetchingPosts(false)
      }
    }
    getPosts()
  },[username , showToast])

  if(!user && loading){
    return(
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"}/>
      </Flex>
    )
  }

  if(!user && !loading) return <h1>User not Found</h1>

  return (
    <>
      <UserHeader user= {user}/>

      {
        !fetchingPosts && posts.length === 0 && <h1>User has not posts</h1>

      }
         {
            fetchingPosts && (
              <Flex justifyContent={"center"} my={12}>
                <Spinner size={"xl"} />
              </Flex>
            )
         }

         {
          posts.map((post) =>(
            <Post key={post._id} post={post} postedBy = {post.postedBy}/>
          ))
         }
    </>
  )
}

export default UserPage
