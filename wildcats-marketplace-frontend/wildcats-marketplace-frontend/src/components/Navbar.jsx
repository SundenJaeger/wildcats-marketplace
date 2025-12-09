import React, {useState, useEffect} from 'react';
import assets from '../assets/assets';
import {useLocation} from 'react-router-dom';
import { notificationService } from '../services/notificationService';

const Navbar = ({isAdmin, onAdminClick, onSettingsClick, onNotificationsClick, onProfileClick, onSearch, searchQuery: externalSearchQuery, onSearchQueryChange}) => {
    const location = useLocation();
    const [username, setUsername] = useState('username');
    const [searchQuery, setSearchQuery] = useState('');
    const [unreadCount, setUnreadCount] = useState(0);

    const isHomepage = location.pathname === '/home';

    // Sync with external search query if provided
    React.useEffect(() => {
        if (externalSearchQuery !== undefined) {
            setSearchQuery(externalSearchQuery);
        }
    }, [externalSearchQuery]);

    useEffect(() => {
        if (isHomepage) {
            const userData = localStorage.getItem('userData');
            if (userData) {
                try {
                    const parsedData = JSON.parse(userData);
                    setUsername(parsedData.username || 'Guest');

                    // Fetch unread notification count
                    fetchUnreadCount(parsedData.studentId);
                } catch (error) {
                    console.error('Error parsing user data:', error);
                }
            }
        }
    }, [isHomepage]);

    // Fetch unread notification count
    const fetchUnreadCount = async (studentId) => {
        try {
            const count = await notificationService.getUnreadCount(studentId);
            setUnreadCount(count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    // Poll for new notifications every 30 seconds
    useEffect(() => {
        if (isHomepage) {
            const userData = localStorage.getItem('userData');
            if (userData) {
                const parsedData = JSON.parse(userData);
                const interval = setInterval(() => {
                    fetchUnreadCount(parsedData.studentId);
                }, 30000); // 30 seconds

                return () => clearInterval(interval);
            }
        }
    }, [isHomepage]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        // Call both handlers if provided
        if (onSearchQueryChange) {
            onSearchQueryChange(value);
        }
        if (onSearch) {
            onSearch(value);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (onSearch && searchQuery.trim()) {
            onSearch(searchQuery);
        }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        if (onSearchQueryChange) {
            onSearchQueryChange('');
        }
        if (onSearch) {
            onSearch('');
        }
    };

    return (
        <div className='flex items-center justify-center absolute top-0 left-0 w-full h-17 z-0 bg-[#A31800]'>
            {/* Navbar for LoginSignup Page */}
            {!isHomepage && (
                <div className='flex items-center gap-2 p-2 justify-center flex-1 max-w-5xl min-w-[300px] mx-2'>
                    <img src={assets.wildcats_logo} alt="Logo" className="w-10 h-10"/>
                    <h2 className='text-2xl font-extrabold text-white'>Wildcat's Marketplace</h2>
                </div>
            )}

            {/* Navbar for Homepage */}
            {isHomepage && (
                <div
                    className='flex items-center gap-2 p-2 max-px-40 justify-between flex-1 max-w-5xl min-w-[300px] mx-2'>

                    {/* Left Side of Navbar */}
                    <div className='flex items-center gap-1'>
                        <img src={assets.wildcats_logo} alt="Logo" className="w-10 h-10"/>
                        <h2 className='font-sans text-2xl font-extrabold text-white '>Wildcat's Marketplace</h2>
                    </div>

                    {/* Right Side of Navbar */}
                    {!isAdmin && (
                        <div className='flex flex-col gap-1'>
                            <div className='flex items-center justify-end mb-1'>
                                <button onClick={onAdminClick} className='p-0 bg-transparent'>
                                    <img className='w-4.5 h-4.5 mx-1' src={assets.white_admin_icon} alt="Settings"/>
                                </button>

                                <button onClick={onSettingsClick} className='p-0 bg-transparent'>
                                    <img className='w-4.5 h-4.5 mx-1' src={assets.white_settings_icon} alt="Settings"/>
                                </button>

                                <button onClick={onNotificationsClick} className='relative p-0 bg-transparent border-0'>
                                    <img className='w-4.5 h-4.5 mx-1' src={assets.white_notification_icon}
                                         alt="Notifications"/>
                                    {unreadCount > 0 && (
                                        <span className='absolute -top-1 -right-0.5 bg-yellow-400 text-red-800 text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center'>
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>

                                <button onClick={onProfileClick}
                                        className='flex items-center p-0 bg-transparent border-0'>
                                    <img className='w-4.5 h-4.5 mx-1' src={assets.white_profile_icon} alt="Profile"/>
                                    <p className='text-xs font-semibold text-white pb-0.5'>{username}</p>
                                </button>
                            </div>

                            {/* Search bar */}
                            <form onSubmit={handleSearchSubmit}>
                                <div
                                    className="relative flex items-center justify-end duration-150 focus-within:scale-[1.025] bg-white p-2 rounded-md h-6 w-50.6 text-black">
                                    <input
                                        className="w-full px-2 text-xs bg-transparent peer outline-0"
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        placeholder=""
                                    />
                                    <span
                                        className="absolute text-xs text-gray-400 transition-opacity duration-150 opacity-0 pointer-events-none left-2 peer-placeholder-shown:opacity-100 peer-focus:opacity-0">
                                        Search here...
                                    </span>
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={handleClearSearch}
                                            className="w-0 p-0 mr-4 text-gray-400 bg-transparent border-0 hover:text-gray-600">
                                            ×
                                        </button>
                                    )}
                                    <button type="submit" className="items-center p-0 bg-transparent border-0">
                                        <img
                                            className="duration-150 w-3.5 h-3.5 right-1.5 peer-focus:opacity-0 peer-focus:invisible"
                                            src={assets.red_search_icon}
                                            alt="Search Icon"
                                        />
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Navbar