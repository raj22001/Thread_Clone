import { Flex, Image, useColorMode } from "@chakra-ui/react"
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import {Link, Link as RouterLink } from "react-router-dom";
import { AiFillHome} from "react-icons/ai"
import { RxAvatar} from "react-icons/rx"

const Header = () => {
    const {colorMode , toggleColorMode} = useColorMode();
    const user = useRecoilValue(userAtom)
    
    
  return (
    <Flex justifyContent={"space-between"} mt={6} mb={12}>
      {
        user && (
          <Link as={RouterLink} to="/">
            <AiFillHome/>
          </Link>
        )
      }
        <Image
            cursor={"pointer"}
            alt="logo"
            w={6}
            src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
            onClick={toggleColorMode}
        />
      
      {
        user && (
          <Link as={RouterLink} to={`/${user.username}`}>
            <RxAvatar/>
          </Link>
        )
      }

    </Flex>
  )
}

export default Header
