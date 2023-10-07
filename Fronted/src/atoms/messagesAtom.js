import {atom} from "recoil";

export const conversationsAtom = atom({
    key :"conversationsAtom",
    default : [],
})

export const selectedConversationAtom = atom({
    key :"selectedConversationAton",
    default : {
        _id:"",
        userId:"",
        username:"",
        userProfilePic:"",
    },
});