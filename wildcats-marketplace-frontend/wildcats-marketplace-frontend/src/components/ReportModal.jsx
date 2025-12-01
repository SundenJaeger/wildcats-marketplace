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
    <div className='fixed inset-0 flex flex-col justify-center items-center bg-black/40 z-50'>
        <div className='flex flex-col justify-between bg-[#FFF4CB] border-[#FFE26D] rounded-md p-4 w-full max-w-md max-h-[90vh] overflow-y-auto'> 

        <div className='flex justify-between pl-3 mb-2'>
            <div className='flex justify-between items-center mt-3'>
                <h2 className='text-black font-bold text-xl'>Report {product.name}</h2>
            </div>
            <div onClick={onClose}
                className='flex justify-center items-center w-6 h-6 bg-[#B20000] rounded-full cursor-pointer hover:bg-[#8B0000]'>
                <X className="w-4 h-4 text-white" />
            </div>
        </div>

        {/* Line Break */}
        <div className='flex justify-center items-center w-auto h-[1px] bg-black my-2 mx-2'></div>

            <div className='flex flex-col items-start p-2 gap-2 mb-2 mx-3'>
                <h3 className='text-gray-600 font-bold'>Why are you reporting this post?</h3>
                
                <button type='button' onClick={() => setReportReason('scam')}
                    className={`text-left pl-2 p-1 rounded-md w-full h-10 bg-[#fdf9e6] hover:bg-[#e6e1cd] ${reportReason === 'scam' ? 'bg-[#e6e1cd]' : ''} text-gray-500 text-sm font-semibold`}>
                    Scam or Fraud
                </button>

                <button type='button' onClick={() => setReportReason('fake')}
                    className={`text-left pl-2 p-1 rounded-md w-full h-10 bg-[#fdf9e6] hover:bg-[#e6e1cd] ${reportReason === 'fake' ? 'bg-[#e6e1cd]' : ''} text-gray-500 text-sm font-semibold`}>
                    Counterfeit Product
                </button>

                <button 
                    type='button' 
                    onClick={() => {
                        setReportReason('inappropriate');
                        setCustomReason('');
                    }}
                    className={`text-left pl-2 p-1 rounded-md w-full h-10 bg-[#fdf9e6] hover:bg-[#e6e1cd] ${reportReason === 'inappropriate' ? 'bg-[#e6e1cd]' : ''} text-gray-500 text-sm font-semibold`}>
                    Inappropriate Listing
                </button>

                <button type='button' onClick={() => setReportReason('others')}
                    className={`text-left pl-2 p-1 rounded-md w-full h-10 bg-[#fdf9e6] hover:bg-[#e6e1cd] ${reportReason === 'others' ? 'bg-[#e6e1cd]' : ''} text-gray-500 text-sm font-semibold`}>
                    Others
                </button>

                {reportReason === 'others' && (
                    <input 
                        type='text'
                        placeholder='Why did you report this post?'
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        className='w-full p-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:border-[#FFE26D]'
                    />
                )}

                <textarea
                    placeholder='Description (optional)'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className='w-full p-2 rounded-md border border-gray-300 text-sm h-20 resize-none focus:outline-none focus:border-[#FFE26D]'
                />
            </div>

            <div className='flex gap-1 justify-end items-center'>
                <button className='bg-[#B20000] p-1 rounded-lg px-5 text-sm font-bold text-white cursor-pointer hover:bg-[#8B0000]' onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    </div>
    )
}

export default ReportModal