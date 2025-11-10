import React from 'react'
import assets from '../assets/assets'

const ReportModal = ({product, onClose, onSubmit}) => {
    const [reportReason, setReportReason] = React.useState('')

    const handleSubmit = () => {
        if (!reportReason) {
            alert("Please select a reason!");
            return;
        }
        onSubmit({reason: reportReason})
    }
    return (
    <div className='fixed inset-0 flex flex-col justify-center items-center bg-black/40 z-51'>
        <div className='flex flex-col justify-between bg-[#FFF4CB] border-[#FFE26D] rounded-md p-4 w-150 h-80'> 

        <div className='flex justify-between pl-3 mb-2'>
            <div className='flex justify-between items-center mt-3'>
                <h2 className='text-black font-bold text-xl'>Report {product.name}</h2>
            </div>
            <div onClick={onClose}
                className='flex justify-center items-center w-5 h-5 bg-[#B20000] rounded-full'>
                <input type="image" className="w-2.5  h-2.5" src={assets.white_close_icon}></input>
            </div>
        </div>

        {/* Line Break */}
        <div className='flex justify-center items-center w-auto h-[1px] bg-black my-2 mx-2 '></div>

            <div className='flex flex-col items-start p-2 h-full gap-2 mb-2 mx-3'>
                <h3 className='text-gray-600 font-bold' value="">Why are you reporting this post?</h3>
                <button type='button' onClick={() => setReportReason('scam')}
                    className={`text-left pl-2 p-1 rounded-md w-full h-10 bg-[#fdf9e6] hover:bg-[#e6e1cd] ${reportReason === 'scam' ? 'focus:bg-[#e6e1cd]' : ''} text-gray-500 text-sm font-semibold`}>
                    Scam or Fraud</button>
                <button type='button' onClick={() => setReportReason('fake')}
                    className={`text-left pl-2 p-1 rounded-md  w-full h-10 bg-[#fdf9e6] hover:bg-[#e6e1cd] ${reportReason === 'fake' ? 'focus:bg-[#e6e1cd]' : ''} text-gray-500 text-sm  font-semibold`}>
                    Counterfeit Product</button>
                <button type='button' onClick={() => setReportReason('inappropriate')}
                    className={`text-left pl-2 p-1 rounded-md w-full h-10 bg-[#fdf9e6] hover:bg-[#e6e1cd] ${reportReason === 'inappropriate' ? 'focus:bg-[#e6e1cd]' : ''} text-gray-500 text-sm  font-semibold`}>
                    Inappropriate Listing</button>
            </div>

            <div className='flex gap-1 justify-end items-center'>
                <button className='bg-[#B20000] p-1 rounded-lg px-5 text-sm font-bold' onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    </div>
    )
}

export default ReportModal