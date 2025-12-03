import React from 'react'
import assets from '../assets/assets'
import ReportModal from './ReportModal'

const ProductPost = ({product, onBack, onUpdateProduct}) => {
    // Comments are now embedded in the product object
    const [localProduct, setLocalProduct] = React.useState(product)
    const [isPostSaved, setPostSaved] = React.useState(false)
    const [productImageIndex, setProductImageIndex] = React.useState(0)
    const [showReportModal, setShowReportModal] = React.useState(false)
    const [newComment, setNewComment] = React.useState('')
    const [replyingTo, setReplyingTo] = React.useState(null)
    const [replyText, setReplyText] = React.useState('')

    // Initialize comments if they don't exist in product
    React.useEffect(() => {
        if (!localProduct.comments) {
            setLocalProduct({
                ...localProduct,
                comments: []
            })
        }
    }, [])

    // Format condition for display
    const formatCondition = (condition) => {
        if (!condition) return 'Not specified'

        // Convert LIKE_NEW to "Like New", NEW to "New", etc.
        return condition
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
    }

    // Format date for display
    const formatListingDate = (datePosted) => {
        if (!datePosted) return 'Unknown'

        const date = new Date(datePosted)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    function decIndex() {
        setProductImageIndex(prev => prev <= 0 ? 0 : prev - 1);
    }

    function incIndex() {
        setProductImageIndex(prev => prev >= localProduct.imageList.length - 1 ? localProduct.imageList.length - 1 : prev + 1);
    }

    function handleSave() {
        setPostSaved(!isPostSaved)
    }

    const handleReportSubmit = (ReportData) => {
        alert('Report submitted successfully')
        setShowReportModal(false)
    }

    const handleAddComment = () => {
        if (newComment.trim()) {
            const newCommentObj = {
                id: Date.now(),
                user_id: "current_user_id", // This should come from auth context
                name: "John Doe", // This should come from auth context
                profile: assets.blank_profile_icon,
                comment: newComment,
                timestamp: new Date().toISOString(),
                replies: []
            }

            const updatedProduct = {
                ...localProduct,
                comments: [...(localProduct.comments || []), newCommentObj]
            }

            setLocalProduct(updatedProduct)
            setNewComment('')

            // Call parent callback to update the product in backend
            if (onUpdateProduct) {
                onUpdateProduct(updatedProduct)
            }
        }
    }

    const handleAddReply = (commentId) => {
        if (replyText.trim()) {
            const newReply = {
                id: Date.now(),
                user_id: "current_user_id",
                name: "John Doe",
                profile: assets.blank_profile_icon,
                comment: replyText,
                timestamp: new Date().toISOString()
            }

            const updatedComments = localProduct.comments.map(comment => {
                if (comment.id === commentId) {
                    return {
                        ...comment,
                        replies: [...comment.replies, newReply]
                    }
                }
                return comment
            })

            const updatedProduct = {
                ...localProduct,
                comments: updatedComments
            }

            setLocalProduct(updatedProduct)
            setReplyText('')
            setReplyingTo(null)

            // Update backend
            if (onUpdateProduct) {
                onUpdateProduct(updatedProduct)
            }
        }
    }

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diffMs = now - date
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return "Just now"
        if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`
        if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
        if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`
        return date.toLocaleDateString()
    }

    const totalComments = (localProduct.comments || []).reduce((total, comment) => {
        return total + 1 + (comment.replies?.length || 0)
    }, 0)

    return (
        <>
            {/* Go Back */}
            <div className='flex justify-end items-center'>
                <div className='flex justify-end h-fit my-2'>
                    <button className='p-2 px-3 text-xs font-bold rounded-lg bg-red-800' onClick={onBack}>Go Back
                    </button>
                </div>
            </div>

            <div className="flex flex-col p-3 px-3 bg-[#FFF7D7] h-150">
                <div className='flex justify-between h-[100%] b-2'>
                    {/* Product Images or Left Side */}
                    <div className='flex flex-col justify-center w-1/2 h-[90h] m-2 box-content'>
                        <div className='w-full h-full flex justify-between items-center bg-cover bg-center rounded-lg'
                             style={{backgroundImage: `url(${localProduct.imageList[productImageIndex]})`}}>
                            <div className='flex justify-between w-full'>
                                <div className='flex justify-start items-center m-1'>
                                    <input type="image" onClick={decIndex}
                                           className='w-8 h-8 hover:scale-110 opacity-40 hover:opacity-70'
                                           src={assets.previous_button_icon}></input>
                                </div>
                                <div className='flex justify-start items-center m-1'>
                                    <input type="image" onClick={incIndex}
                                           className='w-8 h-8 hover:scale-110 opacity-40 hover:opacity-70'
                                           src={assets.next_button_icon}></input>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*Product Details or Right Side*/}
                    <div className='flex flex-col py-3 h-auto w-1/2 p-3'>
                        <div className='flex items-start justify-between'>
                            {/* Name, Price, Date Listed */}
                            <div className='flex flex-col justify-start mb-2 gap-2'>
                                <h2 className="text-4xl text-black font-extrabold">{localProduct.name}</h2>
                                <h3 className="text-2xl text-black leading-2 font-semibold">{localProduct.price}</h3>
                                <h3 className='text-xs leading-7 text-[#5B5B5B] font-semibold'>
                                    Listed by {localProduct.seller || 'Unknown'}
                                    {localProduct.sellerId && ` - ${localProduct.sellerId}`}
                                    {localProduct.datePosted && ` on ${formatListingDate(localProduct.datePosted)}`}
                                </h3>
                            </div>
                            {/*  Buttons  */}
                            <div className='flex justify-between items-center gap-1'>
                                <div onClick={handleSave} className='flex justify-center items-center p-1 rounded-lg'>
                                    <input type="image" className="w-5 h-5"
                                           src={isPostSaved ? assets.save_icon : assets.save_icon_saved}></input>
                                </div>
                                <div onClick={() => setShowReportModal(true)}
                                     className='flex justify-center items-center p-1 rounded-lg'>
                                    <input type="image" className="w-5 h-5" src={assets.report_icon}></input>
                                </div>
                            </div>
                        </div>

                        {/* Line Break */}
                        <div className='flex justify-center items-center w-auto h-[2px] bg-gray-400 my-2'></div>

                        <div className='mb-2 py-3'>
                            {/* Product Details */}
                            <div className='grid grid-cols-[100px_1fr] mb-2 gap-2'>
                                <p className='text-[#5B5B5B] text-md font-bold'>Category</p>
                                <p className='text-[#999999] text-sm font-bold'>
                                    {localProduct.category || 'Uncategorized'}
                                </p>
                                <p className='text-[#5B5B5B] text-md font-bold'>Condition</p>
                                <p className='text-[#999999] text-sm font-bold'>
                                    {formatCondition(localProduct.condition)}
                                </p>
                            </div>
                            <p className='text-[#6c6c6c] text-sm font-semibold leading-6 text-justify'>
                                {localProduct.description || 'No description available.'}
                            </p>
                        </div>

                        {/* Thread */}
                        <div className='flex flex-col justify-start items-start'>
                            <div className='flex gap-1 mb-1 mt-3'>
                                <img className="w-4.5 h-4.5" src={assets.comment_icon}></img>
                                <p className='text-[#999999] text-xs font-semibold leading-tight'>{totalComments}</p>
                            </div>
                        </div>

                        {/* Line Break */}
                        <div className='flex justify-center items-center w-auto h-[1px] bg-gray-400 mt-1 mb-2'></div>

                        {/* Comments Section */}
                        <div className='py-3 flex flex-col gap-3 overflow-y-auto max-h-64'>
                            {(localProduct.comments || []).map((comment) => (
                                <div key={comment.id} className='flex flex-col gap-2'>
                                    {/* Main Comment */}
                                    <div className='flex items-start gap-1.5'>
                                        <img className='w-10 h-10 rounded-full p-2 bg-gray-100 border-1 border-gray-200'
                                             src={comment.profile}></img>
                                        <div className='flex flex-col w-full'>
                                            <div className='bg-[#fffcf2] rounded-xl p-2.5'>
                                                <p className='text-gray-700 font-bold text-sm'>{comment.name}</p>
                                                <p className='text-gray-500 font-semibold text-sm'>{comment.comment}</p>
                                            </div>
                                            <div className='flex gap-3 px-2 mt-1'>
                                                <button
                                                    onClick={() => setReplyingTo(comment.id)}
                                                    className='text-xs text-gray-500 font-semibold hover:text-gray-700'>
                                                    Reply
                                                </button>
                                                <p className='text-xs text-gray-400 font-semibold'>{formatTimestamp(comment.timestamp)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Replies */}
                                    {comment.replies && comment.replies.length > 0 && (
                                        <div className='ml-12 flex flex-col gap-2'>
                                            {comment.replies.map((reply) => (
                                                <div key={reply.id} className='flex items-start gap-1.5'>
                                                    <img
                                                        className='w-8 h-8 rounded-full p-1.5 bg-gray-100 border-1 border-gray-200'
                                                        src={reply.profile}></img>
                                                    <div className='flex flex-col w-full'>
                                                        <div className='bg-[#f5f5f5] rounded-xl p-2'>
                                                            <p className='text-gray-700 font-bold text-xs'>{reply.name}</p>
                                                            <p className='text-gray-500 font-semibold text-xs'>{reply.comment}</p>
                                                        </div>
                                                        <p className='text-xs text-gray-400 font-semibold px-2 mt-1'>{formatTimestamp(reply.timestamp)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Reply Input */}
                                    {replyingTo === comment.id && (
                                        <div className='ml-12 flex items-center gap-2'>
                                            <img
                                                className='w-8 h-8 rounded-full p-1.5 bg-gray-100 border-1 border-gray-200'
                                                src={assets.blank_profile_icon}></img>
                                            <div
                                                className='flex items-center justify-between bg-[#f5f5f5] w-full h-10 rounded-xl border-2 border-gray-200 px-2'>
                                                <input
                                                    type='text'
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && handleAddReply(comment.id)}
                                                    className='w-full focus:outline-none bg-transparent text-black placeholder-gray-400 text-xs font-semibold'
                                                    placeholder={`Reply to ${comment.name}...`}>
                                                </input>
                                                <button onClick={() => handleAddReply(comment.id)} className='p-1'>
                                                    <img className='w-3 h-3 opacity-50 hover:opacity-100'
                                                         src={assets.enter_icon}></img>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* New Comment Input */}
                        <div className='flex justify-center items-center mt-4'>
                            <div className='p-1 rounded-md border-gray-400'>
                                <img className='w-11 h-10 rounded-full p-2 bg-gray-100 border-1 border-gray-200'
                                     src={assets.blank_profile_icon}></img>
                            </div>
                            <div
                                className='flex px-2 items-center justify-between bg-[#fffcf2] w-full h-12 rounded-xl border-2 border-gray-200'>
                                <input
                                    type='text'
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                                    className='w-full focus:outline-none bg-transparent text-black placeholder-gray-400 text-xs font-semibold'
                                    placeholder='Comment as John Doe'>
                                </input>
                                <button onClick={handleAddComment} className='p-1 rounded-md border-gray-400'>
                                    <img className='w-3 h-3 opacity-50 hover:opacity-100' src={assets.enter_icon}></img>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {showReportModal && (
                    <ReportModal
                        product={product}
                        onClose={() => setShowReportModal(false)}
                        onSubmit={handleReportSubmit}
                    />
                )}
            </div>
        </>
    )
}

export default ProductPost