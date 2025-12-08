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
        <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40'>
            <div className="flex flex-col p-3 px-4 bg-[#FFF7D7] h-auto w-[800px] min-h-[40vh] rounded-lg">
                <div className='flex items-center justify-between pl-3 mb-2'>
                    <div className='flex flex-col mt-3'>
                        <h2 className='text-xl font-bold text-black'>My Notifications</h2>
                        {notifications.length > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className='mt-1 text-xs font-semibold text-left text-blue-600 hover:text-blue-800'>
                                Mark all as read
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Body */}
                <div className='box-border flex justify-between h-full min-w-full p-2'>
                    <div className='flex flex-col w-full gap-2 p-4 overflow-y-auto bg-white rounded-2xl max-h-96'>
                        {loading ? (
                            <div className='flex flex-col items-center justify-center w-full h-40'>
                                <p className='p-1 font-semibold text-black'>Loading notifications...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className='flex flex-col items-center justify-center w-full h-40'>
                                <img className='w-20 h-20 m-2 rounded-xl' src={assets.empty_space_icon} alt="Empty"/>
                                <p className='p-1 font-semibold text-black'>Poof! It's empty...</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.notificationId}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`flex items-start gap-3 p-3 rounded-lg w-full cursor-pointer transition-colors ${
                                        notification.isRead
                                            ? 'bg-gray-50 hover:bg-gray-100'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                    }`}>
                                    <img
                                        className='w-10 h-10 p-2 bg-white border border-gray-300 rounded-full'
                                        src={assets.blank_profile_icon}
                                        alt={notification.sender?.user?.username || 'User'}
                                    />
                                    <div className='flex-1'>
                                        <p className={`text-sm ${notification.isRead ? 'font-semibold' : 'font-bold'} text-gray-800`}>
                                            {notification.message}
                                        </p>
                                        <p className='mt-1 text-xs text-gray-500'>
                                            {formatTimestamp(notification.createdAt)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => handleDelete(notification.notificationId, e)}
                                        className='px-2 text-sm font-bold text-gray-400 hover:text-red-600'>
                                        ×
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className='flex items-center justify-end gap-2 p-2'>
                    <button
                        onClick={onClose}
                        className='p-2 px-5 text-xs font-extrabold bg-[#B20000] rounded-lg hover:scale-101 hover:bg-[#8B0000]'>
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NotificationsModal