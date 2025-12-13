import React from 'react'
import { X } from 'lucide-react'

const ReportModal = ({product, onClose, onSubmit}) => {
    const [reportReason, setReportReason] = React.useState('')
    const [customReason, setCustomReason] = React.useState('')
    const [description, setDescription] = React.useState('')

    const handleSubmit = () => {
        if (!reportReason) {
            alert("Please select a reason!");
            return;
        }
        if (reportReason === 'others' && !customReason.trim()) {
            alert("Please specify your reason!");
            return;
        }
        onSubmit({
            reason: reportReason === 'others' ? customReason : reportReason,
            description: description
        })
    }

    return (
    <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40'>
        <div className='flex flex-col justify-between bg-[#FFF7D7] rounded-lg p-4 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg'> 

        <div className='flex items-center justify-between pl-3 mb-2'>
            <h2 className='text-xl font-bold text-black'>Report {product.name}</h2>
            <div onClick={onClose}
                className='flex justify-center items-center w-7 h-7 bg-[#B20000] rounded-full cursor-pointer hover:bg-[#8B0000] transition-colors'>
                <X className="w-4 h-4 text-white" />
            </div>
        </div>

        {/* Line Break */}
        <div className='w-full h-px mb-4 bg-gray-300'></div>

            <div className='flex flex-col items-start gap-2 px-3 mb-4'>
                <h3 className='mb-1 font-bold text-gray-700'>Why are you reporting this product?</h3>
                
                <button type='button' onClick={() => setReportReason('scam')}
                    className={`text-left pl-3 p-2 rounded-md w-full h-10 transition-all font-semibold text-sm
                    ${reportReason === 'scam' 
                        ? 'bg-[#fff0b3] text-red-950 border-2 border-[#B20000]' 
                        : 'bg-white text-gray-600 border-2 border-transparent hover:bg-gray-50'}`}>
                    Scam or Fraud
                </button>

                <button type='button' onClick={() => setReportReason('fake')}
                    className={`text-left pl-3 p-2 rounded-md w-full h-10 transition-all font-semibold text-sm
                    ${reportReason === 'fake' 
                        ? 'bg-[#fff0b3] text-red-950 border-2 border-[#B20000]' 
                        : 'bg-white text-gray-600 border-2 border-transparent hover:bg-gray-50'}`}>
                    Counterfeit Product
                </button>

                <button 
                    type='button' 
                    onClick={() => {
                        setReportReason('inappropriate');
                        setCustomReason('');
                    }}
                    className={`text-left pl-3 p-2 rounded-md w-full h-10 transition-all font-semibold text-sm
                    ${reportReason === 'inappropriate' 
                        ? 'bg-[#fff0b3] text-red-950 border-2 border-[#B20000]' 
                        : 'bg-white text-gray-600 border-2 border-transparent hover:bg-gray-50'}`}>
                    Inappropriate Listing
                </button>

                <button type='button' onClick={() => setReportReason('others')}
                    className={`text-left pl-3 p-2 rounded-md w-full h-10 transition-all font-semibold text-sm
                    ${reportReason === 'others' 
                        ? 'bg-[#fff0b3] text-red-950 border-2 border-[#B20000]' 
                        : 'bg-white text-gray-600 border-2 border-transparent hover:bg-gray-50'}`}>
                    Others
                </button>

                {reportReason === 'others' && (
                    <input 
                        type='text'
                        placeholder='Specify your reason...'
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        className='w-full p-2 rounded-md border-2 bg-white border-gray-300 text-sm text-red-950 font-semibold focus:outline-none focus:border-[#B20000] placeholder:text-gray-400'
                    />
                )}

                <textarea
                    placeholder='Additional details (optional)'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className='w-full p-2 rounded-md border-2 bg-white border-gray-300 text-sm text-red-950 font-semibold h-20 resize-none focus:outline-none focus:border-[#B20000] placeholder:text-gray-400'
                />
            </div>

            <div className='flex items-center justify-end gap-2 px-3'>
                <button 
                    onClick={onClose}
                    className='p-2 px-5 text-sm font-bold text-white transition-colors bg-gray-400 rounded-lg cursor-pointer hover:bg-gray-500'>
                    Cancel
                </button>
                <button 
                    onClick={handleSubmit}
                    className='bg-[#B20000] p-2 px-5 rounded-lg text-sm font-bold text-white cursor-pointer hover:bg-[#8B0000] transition-colors'>
                    Submit
                </button>
            </div>
        </div>
    </div>
    )
}

export default ReportModal