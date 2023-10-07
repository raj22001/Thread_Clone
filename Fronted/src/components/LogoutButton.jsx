import { Button,  } from "@chakra-ui/react"
import { useSetRecoilState } from "recoil"
import userAtom from "../atoms/userAtom"
import userShowToast from "../hooks/userShowToast"
import {FiLogOut} from "react-icons/fi"

const LogoutButton = () => {

    const setUser = useSetRecoilState(userAtom)
    const showToast = userShowToast()
    const handlerLogout = async() =>{
        try {

            const res =await fetch("/api/users/logout" , {
                method:"POST",
                headers :{
                    "Content-Type" : "application/json",
                },
            })
            const data = await res.json();

            if(data.error){
                showToast("Error" , data.error , "error");
                return;
            }

            localStorage.removeItem("user-threads");
            setUser(null);
            
        } catch (error) {
            showToast("Error" , error , "error");
        }

    }

  return (
    <Button position={"fixed"} top={"30px"} right={"30px"} size={"sm"} 
        onClick={handlerLogout}
    >
        <FiLogOut
            size={20}
        />
    </Button>
  )
}

export default LogoutButton
