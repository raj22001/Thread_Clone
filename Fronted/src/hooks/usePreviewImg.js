import { useState } from 'react'
import userShowToast from './userShowToast';

const usePreviewImg = () => {
    const [imgUrl , setImgUrl] = useState(null);
    const showToast = userShowToast();
    const handleImageChange= (e) =>{
        const file = e.target.files[0];
        console.log('Selected File:', file);
        if(file && file.type.startsWith("image/")){
            const render = new FileReader();

            render.onloadend = () =>{
                setImgUrl(render.result);
            };
            render.readAsDataURL(file);
        }
        else{
            showToast("Invalid file Type" , "Please Select an image file" , "error")
            setImgUrl(null);
        }
    };

    console.log("image file url",imgUrl)
    return { handleImageChange , imgUrl , setImgUrl};
        
}

export default usePreviewImg