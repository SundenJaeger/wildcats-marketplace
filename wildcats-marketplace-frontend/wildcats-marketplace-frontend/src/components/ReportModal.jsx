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
      <div className='flex flex-col justify-between bg-[#FFF4CB] border-[#FFE26D] rounded-md p-4 w-100 h-auto'> 
        
        <div className='flex justify-between items-center'>
            <h2 className='text-black font-bold text-xl'>Report: {product.name}</h2>
            <div onClick={onClose}
                className='flex justify-center items-center w-5 h-5 bg-[#B20000] rounded-full'>
                <input type="image" className="w-2.5  h-2.5" src={assets.white_close_icon}></input>
            </div>
        </div>

        {/* Line Break */}
        <div className='flex justify-center items-center w-auto h-[1px] bg-black my-2 mx-1'></div>

        <div className='flex flex-col items-start p-2 h-full gap-1 mb-2'>
            <label className='text-[#5B5B5B] font-bold' value="">Select a reason...</label>
            <button
                type='button'
                onClick={() => setReportReason('scam')}
                className={`text-left pl-2 p-1 rounded-md border-gray-400 border-2 w-full bg-[#fdf9e6] hover:bg-[#e6e1cd] ${reportReason === 'scam' ? 'focus:bg-[#e6e1cd]' : ''} text-[#5B5B5B] font-bold`}
            >Scam or Fraud</button>
            <button
                type='button'
                onClick={() => setReportReason('fake')}
                className={`text-left pl-2 p-1 rounded-md border-gray-400 border-2 w-full bg-[#fdf9e6] hover:bg-[#e6e1cd] ${reportReason === 'fake' ? 'focus:bg-[#e6e1cd]' : ''} text-[#5B5B5B] font-bold`}
            >Counterfeit Product</button>
            <button
                type='button'
                onClick={() => setReportReason('inappropriate')}
                className={`text-left pl-2 p-1 rounded-md border-gray-400 border-2 w-full bg-[#fdf9e6] hover:bg-[#e6e1cd] ${reportReason === 'inappropriate' ? 'focus:bg-[#e6e1cd]' : ''} text-[#5B5B5B] font-bold`}
            >Inappropriate Listing</button>
        </div>

        <div className='flex gap-1 justify-end items-center'>
            <button className='bg-[#B20000] p-1 rounded-lg px-5 text-sm font-bold' onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  )
}

export default ReportModal