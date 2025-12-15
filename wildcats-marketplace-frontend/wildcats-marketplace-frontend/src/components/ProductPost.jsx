import React from 'react'
import assets from '../assets/assets'
import ReportModal from './ReportModal'
import { bookmarkService } from '../services/bookmarkService'
import { reportService } from '../services/reportService'
import { commentService } from '../services/commentService';

const ProductPost = ({ product, onBack, onUpdateProduct }) => {
    const [localProduct, setLocalProduct] = React.useState(product)
    const [isPostSaved, setPostSaved] = React.useState(false)
    const [productImageIndex, setProductImageIndex] = React.useState(0)
    const [showReportModal, setShowReportModal] = React.useState(false)
    const [newComment, setNewComment] = React.useState('')
    const [replyingTo, setReplyingTo] = React.useState(null)
    const [replyText, setReplyText] = React.useState('')
    const [isSaving, setIsSaving] = React.useState(false)

    // Check if product is already bookmarked on mount
    React.useEffect(() => {
        const checkBookmarkStatus = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('userData'));
                if (userData && userData.userId  && product.id) {
                    const isBookmarked = await bookmarkService.isBookmarkFed(userData.userId , product.id);
                    setPostSaved(isBookmarked);
                }
            } catch (error) {
                console.error('Error checking bookmark status:', error);
            }
        };

        checkBookmarkStatus();
    }, [product.id]);

    React.useEffect(() => {
        const loadComments = async () => {
            try {
                if (product.id) {
                    const comments = await commentService.getCommentsByResource(product.id);
                    setLocalProduct(prev => ({
                        ...prev,
                        comments: comments
                    }));
                }
            } catch (error) {
                console.error('Error loading comments:', error);
            }
        };

        loadComments();
    }, [product.id]);

    // Initialize comments if they don't exist in product
    React.useEffect(() => {
        console.log('Product received:', product);
        console.log('ImageList:', product.imageList);
        console.log('ImageList length:', product.imageList?.length);

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

    function decIndex(){
        if (!localProduct.imageList || localProduct.imageList.length === 0) return;
        setProductImageIndex(prev => {
            const newIndex = prev <= 0 ? 0 : prev - 1;
            return newIndex;
        });
    }

    function incIndex(){
        if (!localProduct.imageList || localProduct.imageList.length === 0) return;
        setProductImageIndex(prev => {
            const newIndex = prev >= localProduct.imageList.length - 1 ? localProduct.imageList.length - 1 : prev + 1;
            return newIndex;
        });
    }

    // Get current image or placeholder
    const getCurrentImage = () => {
        if (!localProduct.imageList || localProduct.imageList.length === 0) {
            return 'https://via.placeholder.com/600x400?text=No+Image';
        }
        return localProduct.imageList[productImageIndex] || 'https://via.placeholder.com/600x400?text=Image+Not+Found';
    };

    // Handle save/unsave bookmark
    async function handleSave(){
        
        if (isSaving) return;

        try {
            setIsSaving(true);
            const userData = JSON.parse(localStorage.getItem('userData'));

            if (!userData || !userData.userId) {
                alert('Please log in to save products');
                return;
            }

            if (!product.id) {
                alert('Invalid product');
                return;
            }

            if (isPostSaved) {
                // Remove bookmark
                await bookmarkService.removeBookmark(userData.userId , product.id);
                setPostSaved(false);
            } else {
                // Add bookmark
                await bookmarkService.addBookmark(userData.userId , product.id);
                setPostSaved(true);
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error);
            alert(`Failed to ${isPostSaved ? 'remove' : 'save'} bookmark: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    }

    const handleReportSubmit = async (reportPayload) => {
        try {
            // 1. Retrieve the logged-in user's student ID
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (!userData || !userData.studentId) {
                alert('Please log in to report a product');
                return;
            }

            // 2. Prepare the full report object for the backend,
            //    using the nested structure required by CreateReportRequest.java
            const fullReportData = {
                reason: reportPayload.reason,
                description: reportPayload.description,
                // The backend expects nested objects for student and resource
                student: {
                    studentId: userData.userId  // ID of the student making the report
                },
                resource: {
                    resourceId: product.id        // ID of the product/resource being reported
                }
            };

            // 3. Call the report service to create the report
            const response = await reportService.createReport(fullReportData);

            alert(`Report submitted successfully! Report ID: ${response.reportId}`);
            setShowReportModal(false);

        } catch (error) {
            console.error('Report submission failed:', error);
            // Handle error response from the backend
            const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred.';
            alert(`Failed to submit report: ${errorMessage}`);
        }
    }

    const handleAddComment = async () => {
        if (newComment.trim()) {
            try {
                const userData = JSON.parse(localStorage.getItem('userData'));
                if (!userData || !userData.studentId) {
                    alert('Please log in to comment');
                    return;
                }

                await commentService.addComment(
                    userData.userId,
                    product.id,
                    newComment,
                    null
                );

                // Refresh comments
                const updatedComments = await commentService.getCommentsByResource(product.id);
                setLocalProduct({
                    ...localProduct,
                    comments: updatedComments
                });
                setNewComment('');
            } catch (error) {
                console.error('Error adding comment:', error);
                alert('Failed to add comment');
            }
        }
    };

    const handleAddReply = async (commentId) => {
        if (replyText.trim()) {
            try {
                const userData = JSON.parse(localStorage.getItem('userData'));
                if (!userData || !userData.studentId) {
                    alert('Please log in to reply');
                    return;
                }

                await commentService.addComment(
                    userData.userId,
                    product.id,
                    replyText,
                    commentId
                );

                // Refresh comments
                const updatedComments = await commentService.getCommentsByResource(product.id);
                setLocalProduct({
                    ...localProduct,
                    comments: updatedComments
                });
                setReplyText('');
                setReplyingTo(null);
            } catch (error) {
                console.error('Error adding reply:', error);
                alert('Failed to add reply');
            }
        }
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return "Unknown time";

        // Handle both ISO string and array format from backend
        let date;
        if (Array.isArray(timestamp)) {
            // Backend sends [year, month, day, hour, minute, second, nano]
            date = new Date(timestamp[0], timestamp[1] - 1, timestamp[2],
                timestamp[3] || 0, timestamp[4] || 0, timestamp[5] || 0);
        } else {
            date = new Date(timestamp);
        }

        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
        if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
        if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
        return date.toLocaleDateString();
    }

    const totalComments = (localProduct.comments || []).reduce((total, comment) => {
        return total + 1 + (comment.replies?.length || 0)
    }, 0)

    return (
        <>
            <div className='flex items-center justify-end'>
                <div className='flex justify-end my-2 h-fit'>
                    <button className='p-2 px-3 text-xs font-bold bg-red-800 rounded-lg' onClick={onBack}>Go Back</button>
                </div>
            </div>

            <div className="flex flex-col p-3 px-3 bg-[#FFF7D7] min-h-150 rounded-lg">
                <div className='flex justify-between h-full b-2'>
                    {/* Product Images or Left Side */}
                    <div className='box-content flex flex-col justify-center w-3/5 m-2 h-140'>
                        <div className='flex items-center justify-between w-full h-full bg-center bg-cover rounded-lg'
                             style={{backgroundImage: `url(${getCurrentImage()})`}}>
                            {localProduct.imageList && localProduct.imageList.length > 1 && (
                                <div className='flex justify-between w-full'>
                                    <div className='flex items-center justify-start m-1'>
                                        <input
                                            type="image"
                                            onClick={decIndex}
                                            className='w-8 h-8 cursor-pointer hover:scale-110 opacity-40 hover:opacity-70'
                                            src={assets.previous_button_icon}
                                            alt="Previous"
                                        />
                                    </div>
                                    <div className='flex items-center justify-start m-1'>
                                        <input
                                            type="image"
                                            onClick={incIndex}
                                            className='w-8 h-8 cursor-pointer hover:scale-110 opacity-40 hover:opacity-70'
                                            src={assets.next_button_icon}
                                            alt="Next"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Image counter */}
                        {localProduct.imageList && localProduct.imageList.length > 1 && (
                            <div className='flex justify-center mt-2'>
                                <span className='px-3 py-1 text-xs text-white rounded-full bg-black/50'>
                                    {productImageIndex + 1} / {localProduct.imageList.length}
                                </span>
                            </div>
                        )}
                    </div>

                    {/*Product Details or Right Side*/}
                    <div className='flex flex-col w-2/5 h-auto p-3 py-3'>
                        <div className='flex items-start justify-between'>
                            <div className='flex flex-col justify-start gap-3 mb-2'>
                                <h2 className="text-3xl font-semibold text-black">{localProduct.name}</h2>
                                <h3 className="text-2xl text-black leading-2">{localProduct.price}</h3>
                                <h3 className='text-xs leading-7 text-[#5B5B5B] font-semibold'>
                                    Listed by {localProduct.seller || 'Unknown'}
                                    {localProduct.sellerId && ` - ${localProduct.sellerId}`}
                                    {localProduct.datePosted && ` on ${formatListingDate(localProduct.datePosted)}`}
                                </h3>
                            </div>
                            <div className='flex items-center justify-between gap-1'>
                                <div
                                    onClick={handleSave}
                                    className={`flex justify-center items-center p-1 rounded-lg ${isSaving ? 'cursor-wait opacity-50' : 'cursor-pointer hover:scale-110'}`}
                                    title={isPostSaved ? 'Remove bookmark' : 'Save product'}
                                >
                                    <input
                                        type="image"
                                        className="w-5 h-5"
                                        src={isPostSaved ? assets.save_icon_saved : assets.save_icon}
                                        alt="Save"
                                    />
                                </div>
                                <div onClick={() => setShowReportModal(true)} className='flex items-center justify-center p-1 rounded-lg cursor-pointer'>
                                    <input type="image" className="w-5 h-5" src={assets.report_icon} alt="Report"/>
                                </div>
                            </div>
                        </div>

                        <div className='flex justify-center items-center w-auto h-0.5 bg-amber-950/50 my-2'></div>

                        <div className='py-3 mb-2'>
                            <p className='text-[#303030] text-md font-bold mb-2'>Details</p>
                            <div className='grid grid-cols-[100px_1fr] mb-6 gap-2 ml-2'>
                                <p className='text-[#5B5B5B] text-md font-bold'>Category</p>
                                <p className='text-sm font-bold text-amber-950/60'>
                                    {localProduct.category || 'Uncategorized'}
                                </p>
                                <p className='text-[#5B5B5B] text-md font-bold'>Condition</p>
                                <p className='text-sm font-bold text-amber-950/60'>
                                    {formatCondition(localProduct.condition)}
                                </p>
                            </div>
                            <p className='text-[#303030] text-md font-bold mb-1'>Description</p>
                            <p className='ml-3 text-sm font-semibold leading-6 text-justify text-amber-950/60'>
                                {localProduct.description || 'No description available.'}
                            </p>
                        </div>

                    </div>

                    
                </div>
                <div className='flex flex-col items-start justify-start'>
                            <div className='flex gap-1 mt-3 mb-1'>
                                <img className="w-4.5 h-4.5" src={assets.comment_icon} alt="Comments"/>
                                <p className='text-[#999999] text-xs font-semibold leading-tight'>{totalComments}</p>
                            </div>
                        </div>

                        <div className='flex items-center justify-center w-auto h-0.5 mt-1 mb-2 bg-amber-950/50'></div>

                        {/* Comments Section */}
                        <div className='flex flex-col gap-3 px-10 py-3'>
                            {(localProduct.comments || []).map((comment) => (
                                <div key={comment.commentId} className='flex flex-col gap-2'>
                                    <div className='flex items-start gap-1.5'>
                                        <img className='w-10 h-10 p-2 bg-gray-100 border border-gray-200 rounded-full'
                                             src={assets.blank_profile_icon}
                                             alt={comment.studentUsername}/>
                                        <div className='flex flex-col w-full'>
                                            <div className='bg-[#fffcf2] rounded-xl p-2.5'>
                                                <p className='text-sm font-bold text-gray-700'>{comment.studentUsername}</p>
                                                <p className='text-sm font-semibold text-gray-500'>{comment.commentText}</p>
                                            </div>
                                            <div className='flex gap-3 px-2 mt-1'>
                                                <button
                                                    onClick={() => setReplyingTo(comment.commentId)}
                                                    className='text-xs font-semibold text-gray-500 hover:text-gray-700'>
                                                    Reply
                                                </button>
                                                <p className='text-xs font-semibold text-gray-400'>{formatTimestamp(comment.timestamp)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {comment.replies && comment.replies.length > 0 && (
                                        <div className='flex flex-col gap-2 ml-12'>
                                            {comment.replies.map((reply) => (
                                                <div key={reply.commentId} className='flex items-start gap-1.5'>
                                                    <img className='w-8 h-8 rounded-full p-1.5 bg-gray-100 border border-gray-200'
                                                         src={assets.blank_profile_icon}
                                                         alt={reply.studentUsername}/>
                                                    <div className='flex flex-col w-full p-2'>
                                                        <div className='bg-[#FFFCF2] rounded-xl p-2'>
                                                            <p className='text-xs font-bold text-gray-700'>{reply.studentUsername}</p>
                                                            <p className='text-xs font-semibold text-gray-500'>{reply.commentText}</p>
                                                        </div>
                                                        <p className='px-2 mt-1 text-xs font-semibold text-gray-400'>{formatTimestamp(reply.timestamp)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {replyingTo === comment.commentId && (
                                        <div className='flex items-center gap-2 ml-12'>
                                            <img className='w-8 h-8 rounded-full p-1.5 bg-gray-100 border border-gray-200'
                                                 src={assets.blank_profile_icon}
                                                 alt="Your profile"/>
                                            <div className='flex items-center justify-between bg-[#f5f5f5] w-full h-10 rounded-xl border-2 border-gray-200 px-2'>
                                                <input
                                                    type='text'
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && handleAddReply(comment.commentId)}
                                                    className='w-full text-xs font-semibold text-black placeholder-gray-400 bg-transparent focus:outline-none'
                                                    placeholder={`Reply to ${comment.studentUsername}...`}
                                                />
                                                <button onClick={() => handleAddReply(comment.commentId)} className='p-1'>
                                                    <img className='w-3 h-3 opacity-50 hover:opacity-100' src={assets.enter_icon} alt="Send"/>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* New Comment Input */}
                        <div className='flex items-center justify-center px-10 mt-4'>
                            <div className='p-1 border-gray-400 rounded-md'>
                                <img className='h-10 p-2 bg-gray-100 border border-gray-200 rounded-full w-11'
                                     src={assets.blank_profile_icon}
                                     alt="Your profile"/>
                            </div>
                            <div className='flex px-2 items-center justify-between bg-[#fffcf2] w-full h-12 rounded-xl border-2 border-gray-200'>
                                <input
                                    type='text'
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                                    className='w-full text-xs font-semibold text-black placeholder-gray-400 bg-transparent focus:outline-none'
                                    placeholder={`Comment as ${JSON.parse(localStorage.getItem('userData') || '{}').username || 'User'}`}
                                />
                                <button onClick={handleAddComment} className='p-1 border-gray-400 rounded-md'>
                                    <img className='w-3 h-3 opacity-50 hover:opacity-100' src={assets.enter_icon} alt="Send"/>
                                </button>
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