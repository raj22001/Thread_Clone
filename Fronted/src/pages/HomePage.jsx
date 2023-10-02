import { Flex ,  Spinner} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import useShowToast from "../hooks/userShowToast"
import Post from "../components/Post"

const HomePage = () => {
  const showToast = useShowToast();
  const [posts , setPost] = useState([])
  const [loading , setLoading] = useState(true)
  useEffect (() =>{
    const getFeedPosts = async() =>{
      setLoading(true)
      setPost([]);
      try {
        const res = await fetch(`/api/post/feed`);
        const data = await res.json();
        if(data.error){
          showToast("Error" , data.error , "error")
          return;
        }

        console.log("data is here Homepage -> ",data)
        setPost(data)

      } catch (error) {
        showToast("Error" , error.message , "error")
      }finally{
        setLoading(false)
      }
    }
    getFeedPosts();
  },[showToast , setPost])

  return (
    <>

{!loading && posts.length === 0 && <h1>Follow some users to see the feed</h1>}

      {
        loading && (
          <Flex justify={"center"}>
            <Spinner size={"xl"}/>
          </Flex>
        )
      }
          
      {
        posts.map((post) => (
    
          <Post key={post._id} post={post} postedBy={post.postedBy}/>
      
        ))
      }
    </>
  )
}

export default HomePage
