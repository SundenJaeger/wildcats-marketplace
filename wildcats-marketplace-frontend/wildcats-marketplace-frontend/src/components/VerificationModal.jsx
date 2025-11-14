import assets from "../assets/assets"
import React, {useEffect} from "react"



const VerificationModel = ({username, onClose}) => {

    //  ·useEffect(() => {
    //     const duration = 3000;

    //     const timerId = setTimeout(() => {
    //         onClose();
    //     }, duration);

    //     return () => {
    //         clearTimeout(timerId);
    //     };
    // }, [onClose])

    return (
        <div className='fixed inset-0 flex flex-col justify-center items-center bg-black/40 z-51'>
            <div className='flex flex-col justify-start bg-[#FFF4CB] border-[#FFE26D] rounded-md p-4 w-150 h-32'> 
                <div className='flex w-full justify-end pl-3 p-2 bg-[#FFFCEE] rounded-sm'>
                    <div onClick={onClose}
                        className='flex justify-center items-center w-5 h-5 bg-[#B20000] rounded-full'>
                        <input type="image" className="w-2.5  h-2.5" src={assets.white_close_icon}></input>
                    </div>
                </div>
                <div className="flex justify-start p-5 pt-2 bg-[#FFFCEE] rounded-sm">
                    <h2 className="text-xl font-bold text-red-950">
                    Welcome to Wildcat's Marketplace, ${username}!
                </h2>
                </div>
            </div>
        </div>
        )
}

export default VerificationModel