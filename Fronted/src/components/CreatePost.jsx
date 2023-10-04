import { Button, useColorModeValue , useDisclosure , Modal , ModalOverlay , ModalContent , ModalHeader , ModalCloseButton , ModalBody , ModalFooter, FormControl, Textarea, Text, Input, Flex, Image, CloseButton} from "@chakra-ui/react"
import {AddIcon} from "@chakra-ui/icons"
import { useRef, useState } from "react"
import usePreviewImg from "../hooks/usePreviewImg"
import { BsFillImageFill } from "react-icons/bs"
import { useRecoilState, useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import useShowToast from "../hooks/userShowToast"
import postsAtom from "../atoms/postAtom"
import { useParams } from "react-router-dom"

const MAX_CHAR = 300;

const CreatePost = () => {
    const [postText , setPostText]= useState('')
    const [loading , setLoading] = useState(false)
    const [remainingChar , setRemainingChar ] = useState(MAX_CHAR)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const {handlerImageChange, imgUrl , setImgUrl } = usePreviewImg()
    const user = useRecoilValue(userAtom);
    const [posts , setPosts] = useRecoilState(postsAtom)
    console.log("USER is here ->", user);
    const imageRef = useRef(null)
    const showToast = useShowToast();
    const username = useParams()

    const handleTextChange = (e) =>{
        const inputText = e.target.value;

        if(inputText.length > MAX_CHAR){
            const truncatedText = inputText.slice(0 , MAX_CHAR);
            setPostText(truncatedText);
            setRemainingChar(0);
        }else{
            setPostText(inputText);
            setRemainingChar(MAX_CHAR - inputText.length)
        }
    }

    const handleCreatePost = async() =>{
        setLoading(true)
        try {
            const res = await fetch("/api/post/create",{

                method :"POST",
                headers :{
                    "Content-Type": "application/json",
                },
            
                body :JSON.stringify({postedBy:user._id  , text: postText , img:imgUrl})
            })
            console.log("res => " , res );
            const data = await res.json()
            console.log("data data ->",data);
            if(data.error){
                showToast("Error" , data.error , "error")
                return
            }
            showToast("Success" , "Post Created Successfully" , "success")
            
            if(username == user.username){
                setPosts([data , ...posts])
            }
            
            onClose()
            setPostText("");
            setImgUrl("")
        } catch (error) {
            showToast("Error" , error , "error")
            return 
        }
    }

  return (
    <>
    <Button
        position={"fixed"}
        bottom={10}
        right={10}
        bg={useColorModeValue("gray.300","gray.dark")}
        onClick={onOpen}
        size={{base:"sm" , sm:"md"}}
    >
        <AddIcon/>
    </Button>

    <Modal  isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
           
            <FormControl>
                <Textarea
                    placeholder="Post content goes here... "
                    onChange={handleTextChange}
                    value={postText}
                />
                <Text fontSize={"xs"}
                    fontWeight={"bold"}
                    textAlign={"right"}
                    m={"1"}
                    color={"gray.800"}
                >
                   {remainingChar}/{MAX_CHAR}
                </Text>

                <Input
                    type="file"
                    hidden
                    ref={imageRef}
                    onChange={handlerImageChange}
                />

                <BsFillImageFill
                    style={{marginLeft:"5px" , cursor:"pointer"}}
                    size={16}
                    onClick={() => imageRef.current.click()}
                />

            </FormControl>

            {
                imgUrl && (
                    <Flex mt={5} w={"full"} position={"relative"}>
                        <Image src={imgUrl} alt="Selected img"/>
                        <CloseButton
                            onClick={() =>{
                                setImgUrl("");
                            }}
                            bg={"gray.800"}
                            position={"absolute"}
                            top={2}
                            right={2}
                        />
                    </Flex>
                )
            }


          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleCreatePost} isLoading={loading}>
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreatePost
