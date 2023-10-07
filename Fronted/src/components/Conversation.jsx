import { Avatar, AvatarBadge, Flex, Image, Stack, Text, WrapItem, useColorMode } from "@chakra-ui/react"
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom"
import {BsCheck2All} from "react-icons/bs"
import { selectedConversationAtom } from "../atoms/messagesAtom";

const Conversation = ({conversation , isOnline}) => {

    const user = conversation.participants[0];
    const currentUser = useRecoilValue(userAtom);
    const lastMessage = conversation.lastMessage;
    const [SelectedConversation , setSelectedConversation] = useRecoilState(selectedConversationAtom);
    const {colorMode} = useColorMode();
    
    //  console.log(user)

    //console.log("selectedConversation", SelectedConversation);
    
    const hoverStyle ={
      cursor:"pointer",
      bg:colorMode === "dark" ? "gray.600"  :"gray.dark"  ,
      color:"white"
    }
    
    return (
      <Flex
      gap={4}
      alignItems={"center"}
      p={"1"}
      _hover={hoverStyle} 
      borderRadius={"md"}
      onClick={() => setSelectedConversation({
        _id : conversation._id,
        userId:user._id,
        userProfilePic:user?.profilePic,
        username:user?.username,
        mock:conversation.mock
      })}

      bg={SelectedConversation?._id === conversation._id ? (colorMode === "light" ? "gray.400" : "gray.dark") : ""}

    >
      <WrapItem>
        <Avatar 
        size={{
            base :"xs",
            sm:"sm",
            md:"md"
        }}
            src={user?.profilePic} 
        >

          {isOnline ?   <AvatarBadge boxSize="1em" bg={"gray.500"}/> : ""}
        </Avatar>
      </WrapItem>

      <Stack direction={"column"} fontSize={"sm"}>
            <Text _focusWithin="700" display={"flex"} alignItems={"center"}>
                {user?.username}<Image src="/verified.png" w={4} h={4} ml={1} />
            </Text>
            <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
                {currentUser._id === lastMessage.sender ? <BsCheck2All size={16}/> : ""}
                {lastMessage.text.length > 18 ? lastMessage.text.substring(0,18) + "..." : lastMessage.text}
            </Text>
      </Stack>
    </Flex>
  )
}

export default Conversation
