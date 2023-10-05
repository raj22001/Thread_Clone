import { Avatar, AvatarBadge, Flex, Image, Stack, Text, WrapItem, useColorMode } from "@chakra-ui/react"


const Conversation = () => {
    
    const {colorMode} = useColorMode();

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
    >
      <WrapItem>
        <Avatar 
        size={{
            base :"xs",
            sm:"sm",
            md:"md"
        }}
            src="https://bit.ly/borken-link" 
        >

        <AvatarBadge boxSize="1em" bg={"gray.500"}/>
        </Avatar>
      </WrapItem>

      <Stack direction={"column"} fontSize={"sm"}>
            <Text _focusWithin="700" display={"flex"} alignItems={"center"}>
                johndoe <Image src="/verified.png" w={4} h={4} ml={1} />
            </Text>
            <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
                Hello Some Message
            </Text>
      </Stack>
    </Flex>
  )
}

export default Conversation
