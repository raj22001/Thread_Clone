import {  Input, InputGroup, InputRightElement } from "@chakra-ui/react"
import {IoSendSharp} from "react-icons/io5"

const MessageInput = () => {
  return (
    <form>
      <InputGroup>
      <Input
        w={"full"}
        placeholder="Type a Message"
      />
      <InputRightElement>
            <IoSendSharp />
      </InputRightElement>
      </InputGroup>
    </form>
  )
}

export default MessageInput
