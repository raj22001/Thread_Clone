import SignupCard from "../components/SignupCard"
import Login from "../components/Login"
import { useRecoilValue } from "recoil"
import authScreenAtom from "../atoms/authAtom"

const AuthPage = () => {
    const authScrrenState = useRecoilValue(authScreenAtom);
    console.log(authScrrenState);
  return (
    <>
      {
        authScrrenState === "login" ? <Login/> : <SignupCard/>
      }
    </>
  )
}

export default AuthPage
