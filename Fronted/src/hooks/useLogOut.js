import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "./userShowToast";


const useLogOut = () => {

   const setUser = useRecoilState(userAtom)
   const showToast = useShowToast()

    const Logout = async() =>{
        try {

            const res =await fetch("/api/users/logout" , {
                method:"POST",
                headers :{
                    "Content-Type" : "application/json",
                },
            })
            const data = await res.json();
            console.log(data)

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
    Logout
  )
}

export default useLogOut
