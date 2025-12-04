import React, {useState, useEffect} from 'react';
import assets from '../assets/assets';
import {useLocation} from 'react-router-dom';

const Navbar = ({isAdmin, onAdminClick, onSettingsClick, onNotificationsClick, onProfileClick, onSearch, searchQuery: externalSearchQuery, onSearchQueryChange}) => {
    const location = useLocation();
    const [username, setUsername] = useState('username');
    const [searchQuery, setSearchQuery] = useState('');

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
                } catch (error) {
                    console.error('Error parsing user data:', error);
                }
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
        <div className='flex items-center justify-center absolute top-0 left-0 w-full h-15 z-50 bg-[#A31800]'>
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
                        <h2 className='text-2xl font-extrabold font-sans text-white '>Wildcat's Marketplace</h2>
                    </div>

                    {/* Right Side of Navbar */}
                    {!isAdmin && (
                        <div className='flex flex-col'>
                            <div className='flex items-center justify-end mb-1'>
                                <button onClick={onAdminClick} className='p-0 bg-transparent'>
                                    <img className='w-4 h-4 mx-1' src={assets.white_admin_icon} alt="Settings"/>
                                </button>

                                <button onClick={onSettingsClick} className='p-0 bg-transparent'>
                                    <img className='w-4 h-4 mx-1' src={assets.white_settings_icon} alt="Settings"/>
                                </button>

                                <button onClick={onNotificationsClick} className='p-0 bg-transparent border-0'>
                                    <img className='w-4 h-4 mx-1' src={assets.white_notification_icon}
                                         alt="Notifications"/>
                                </button>

                                <button onClick={onProfileClick}
                                        className='flex items-center p-0 bg-transparent border-0'>
                                    <img className='w-4 h-4 mx-1' src={assets.white_profile_icon} alt="Profile"/>
                                    <p className='text-xs text-white pb-0.5'>{username}</p>
                                </button>
                            </div>

                            {/* Search bar */}
                            <form onSubmit={handleSearchSubmit}>
                                <div
                                    className="relative flex items-center justify-end duration-150 focus-within:scale-[1.025] bg-white p-1 rounded-md h-5 w-50.6">
                                    <input
                                        className="peer outline-0 w-full bg-transparent text-xs px-2"
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        placeholder=""
                                    />
                                    <span
                                        className="absolute left-2 text-gray-400 text-xs opacity-0 peer-placeholder-shown:opacity-100 peer-focus:opacity-0 transition-opacity duration-150 pointer-events-none">
                                        Search here...
                                    </span>
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={handleClearSearch}
                                            className="bg-transparent border-0 p-0 mr-4 text-gray-400 hover:text-gray-600">
                                            ×
                                        </button>
                                    )}
                                    <button type="submit" className="bg-transparent border-0 p-0">
                                        <img
                                            className="duration-150 w-3.5 h-3.5 absolute right-1.5"
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