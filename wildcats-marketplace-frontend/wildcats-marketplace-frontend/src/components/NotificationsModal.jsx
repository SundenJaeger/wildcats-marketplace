import React, { useState, useEffect } from 'react'
import assets from '../assets/assets'
import { notificationService } from '../services/notificationService'

const NotificationsModal = ({onClose, onProductClick}) => {
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadNotifications()
    }, [])

    const loadNotifications = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem('userData'))
            if (userData && userData.studentId) {
                const data = await notificationService.getNotifications(userData.studentId)
                setNotifications(data)
            }
        } catch (error) {
            console.error('Error loading notifications:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleNotificationClick = async (notification) => {
        try {
            // Mark as read
            if (!notification.isRead) {
                await notificationService.markAsRead(notification.notificationId)
            }

            // Close modal
            onClose()

            // Navigate to the product if callback provided
            if (onProductClick && notification.resource) {
                onProductClick(notification.resource)
            }
        } catch (error) {
            console.error('Error handling notification click:', error)
        }
    }

    const handleMarkAllRead = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem('userData'))
            if (userData && userData.studentId) {
                await notificationService.markAllAsRead(userData.studentId)
                await loadNotifications()
            }
        } catch (error) {
            console.error('Error marking all as read:', error)
        }
    }

    const handleDelete = async (notificationId, e) => {
        e.stopPropagation()
        try {
            await notificationService.deleteNotification(notificationId)
            await loadNotifications()
        } catch (error) {
            console.error('Error deleting notification:', error)
        }
    }

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return "Unknown time"

        let date
        if (Array.isArray(timestamp)) {
            date = new Date(timestamp[0], timestamp[1] - 1, timestamp[2],
                timestamp[3] || 0, timestamp[4] || 0, timestamp[5] || 0)
        } else {
            date = new Date(timestamp)
        }

        const now = new Date()
        const diffMs = now - date
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return "Just now"
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        if (diffDays < 7) return `${diffDays}d ago`
        return date.toLocaleDateString()
    }

    return (
        <div className='fixed inset-0 flex flex-col justify-center items-center bg-black/40 z-51'>
            <div className='flex flex-col justify-between bg-[#fff1bd] rounded-md p-4 w-190 h-auto max-h-[80vh] border-2 border-[#726948] gap-2'>

                <div className='flex justify-between items-start px-2'>
                    <div className='flex flex-col mt-3 mb-2'>
                        <h2 className='text-black font-bold text-2xl'>My Notifications</h2>
                        {notifications.length > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className='text-xs text-blue-600 hover:text-blue-800 font-semibold mt-1 text-left'>
                                Mark all as read
                            </button>
                        )}
                    </div>
                    <div onClick={onClose}
                         className='flex justify-center items-center w-5 h-5 bg-[#B20000] rounded-full cursor-pointer hover:bg-[#900000]'>
                        <input type="image" className="w-2.5 h-2.5" src={assets.white_close_icon} alt="Close"/>
                    </div>
                </div>

                {/* Main Body */}
                <div className='flex flex-col items-start pb-3 overflow-y-auto max-h-96 gap-2 px-2'>
                    {loading ? (
                        <div className='bg-[#FFFAE4] flex flex-col items-center justify-center w-full h-40'>
                            <p className='text-black font-semibold p-1'>Loading notifications...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className='bg-[#FFFAE4] flex flex-col items-center justify-center w-full h-40'>
                            <img className='w-20 h-20 rounded-xl m-2' src={assets.empty_space_icon} alt="Empty"/>
                            <p className='text-black font-semibold p-1'>Poof! It's empty...</p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.notificationId}
                                onClick={() => handleNotificationClick(notification)}
                                className={`flex items-start gap-3 p-3 rounded-lg w-full cursor-pointer transition-colors ${
                                    notification.isRead
                                        ? 'bg-[#FFFAE4] hover:bg-[#FFF9D9]'
                                        : 'bg-[#FFF5CC] hover:bg-[#FFEFB8]'
                                }`}>
                                <img
                                    className='w-10 h-10 rounded-full p-2 bg-white border-1 border-gray-300'
                                    src={assets.blank_profile_icon}
                                    alt={notification.sender?.user?.username || 'User'}
                                />
                                <div className='flex-1'>
                                    <p className={`text-sm ${notification.isRead ? 'font-semibold' : 'font-bold'} text-gray-800`}>
                                        {notification.message}
                                    </p>
                                    <p className='text-xs text-gray-500 mt-1'>
                                        {formatTimestamp(notification.createdAt)}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => handleDelete(notification.notificationId, e)}
                                    className='text-gray-400 hover:text-red-600 text-sm font-bold px-2'>
                                    ×
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default NotificationsModal