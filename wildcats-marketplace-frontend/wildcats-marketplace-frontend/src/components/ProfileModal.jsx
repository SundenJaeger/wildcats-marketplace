import React, {useEffect, useState} from 'react'

// Placeholder assets - replace with your actual imports
const assets = {
    blank_profile_icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ccc"%3E%3Cpath d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/%3E%3C/svg%3E',
    white_close_icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"%3E%3Cpath d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/%3E%3C/svg%3E'
}

const ProfileModal = ({onClose}) => {
    const [selectedOption, setSelectedOption] = useState('');
    const [profileImage, setProfileImage] = useState(assets.blank_profile_icon);
    const fileInputRef = React.useRef(null);

    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const storedData = localStorage.getItem('userData');
        if (storedData) {
            try {
                setUserData(JSON.parse(storedData));
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    const defaultUser = {
        fullName: "John Doe",
        username: "johndoe",
        email: "john.doe@cit.edu",
        studentId: "19-1234",
        program: "Computer Science",
        yearLevel: "3rd Year"
    };

    const user = userData || defaultUser;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
                localStorage.setItem('profileImage', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveImage = () => {
        setProfileImage(assets.blank_profile_icon);
        localStorage.removeItem('profileImage');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    useEffect(() => {
        const savedImage = localStorage.getItem('profileImage');
        if (savedImage) {
            setProfileImage(savedImage);
        }
    }, []);

    return (
        <div className='fixed inset-0 flex flex-col justify-center items-center bg-black/40 z-51'>
            <div className='flex flex-col justify-between bg-[#fff1bd] rounded-md p-4 w-200 h-auto pb-8 border-2 border-[#726948]'>
                <div className='flex justify-between items-start'>
                    <div className='flex flex-col ml-5 mt-5 mb-2'>
                        <h2 className='text-red-950 font-bold !text-3xl'>My Profile</h2>
                        <p className='text-red-950 font-semibold text-sm'>
                            Welcome, {user.username}!
                        </p>
                    </div>
                    <div onClick={onClose}
                         className='flex justify-center items-center w-5 h-5 bg-[#B20000] rounded-full cursor-pointer hover:bg-[#8B0000] transition-colors'>
                        <img className="w-2.5 h-2.5" src={assets.white_close_icon} alt="Close" />
                    </div>
                </div>

                {/* Line Break */}
                <div className='flex justify-center items-center w-auto h-[1px] bg-red-950 my-2 mx-5'></div>

                {/* Main Body */}
                <div className='flex justify-evenly items-start py-5 gap-2'>
                    {/* Left Side */}
                    <div className='grid grid-cols-1 w-full pr-15 pl-5 gap-2'>
                        {/* Full Name */}
                        <div className='grid grid-cols-[140px_1fr] items-center text-end gap-2'>
                            <label className='text-red-950 font-bold text-sm text-nowrap'>Full Name</label>
                            <input
                                type='text'
                                value={user.fullName}
                                readOnly
                                className='text-sm font-bold pl-2 text-gray-800 bg-gray-100 rounded-sm border-2 border-gray-300 p-1'
                            />
                        </div>

                        {/* Username */}
                        <div className='grid grid-cols-[140px_1fr] items-center text-end gap-2'>
                            <label className='text-red-950 font-bold text-sm text-nowrap'>Username</label>
                            <input
                                type='text'
                                value={user.username}
                                readOnly
                                className='text-sm font-bold pl-2 text-gray-800 bg-gray-100 rounded-sm border-2 border-gray-300 p-1'
                            />
                        </div>

                        {/* Student ID */}
                        <div className='grid grid-cols-[140px_1fr] items-center text-end gap-2'>
                            <label className='text-red-950 font-bold text-sm text-nowrap'>Student ID</label>
                            <input
                                type='text'
                                value={user.studentId}
                                readOnly
                                className='text-sm font-bold pl-2 text-gray-800 bg-gray-100 rounded-sm border-2 border-gray-300 p-1'
                            />
                        </div>

                        {/* Student Email */}
                        <div className='grid grid-cols-[140px_1fr] items-center text-end gap-2'>
                            <label className='text-red-950 font-bold text-sm text-nowrap'>Student Email</label>
                            <input
                                type='text'
                                value={user.email}
                                readOnly
                                className='text-sm font-bold pl-2 text-gray-800 bg-gray-100 rounded-sm border-2 border-gray-300 p-1'
                            />
                        </div>

                        {/* Program */}
                        {user.program && (
                            <div className='grid grid-cols-[140px_1fr] items-center text-end gap-2'>
                                <label className='text-red-950 font-bold text-sm text-nowrap'>Program</label>
                                <input
                                    type='text'
                                    value={`${user.program} ${user.yearLevel ? `(${user.yearLevel})` : ''}`}
                                    readOnly
                                    className='text-sm font-bold pl-2 text-gray-800 bg-gray-100 rounded-sm border-2 border-gray-300 p-1'
                                />
                            </div>
                        )}

                        {/* Display user type */}
                        {user.userType && (
                            <div className='grid grid-cols-[140px_1fr] items-center text-end gap-2'>
                                <label className='text-red-950 font-bold text-sm text-nowrap'>Account Type</label>
                                <div className='text-sm font-bold pl-2 text-gray-800'>
                                    {user.userType === 'S' ? 'Student' : 'Admin'}
                                </div>
                            </div>
                        )}

                        {/* Verification Status */}
                        {user.isVerified !== undefined && (
                            <div className='grid grid-cols-[140px_1fr] items-center text-end gap-2'>
                                <label className='text-red-950 font-bold text-sm text-nowrap'>Verified</label>
                                <div className={`text-sm font-bold pl-2 ${user.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {user.isVerified ? '✓ Verified' : '⏳ Pending'}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Side - Profile Image */}
                    <div className='flex flex-col gap-2 items-center w-[25%] mr-10'>
                        <img
                            className='w-32 h-32 bg-white p-2 border-3 border-gray-300 rounded-md object-cover'
                            src={profileImage}
                            alt="Profile"
                        />
                        <p className='text-xs text-gray-600 text-center'>
                            {user.username}<br/>
                            {user.program || 'Student'}
                        </p>

                        {/* Hidden file input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className='hidden'
                        />

                        <div className='flex gap-1'>
                            <button
                                onClick={handleButtonClick}
                                className='bg-[#B20000] text-white p-2 px-3 rounded-md text-xs font-bold hover:bg-[#8B0000] hover:scale-101 box-border border-2 border-red-800 transition-all cursor-pointer'>
                                Change Photo
                            </button>

                            {profileImage !== assets.blank_profile_icon && (
                                <button
                                    onClick={handleRemoveImage}
                                    className='bg-gray-500 text-white p-2 px-3 rounded-md text-xs font-bold hover:bg-gray-600 hover:scale-101 box-border border-2 border-gray-700 transition-all cursor-pointer'>
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Note about editing */}
                <div className='text-center text-xs text-gray-600 mt-4'>
                    <p>Contact administrator to update profile information.</p>
                </div>
            </div>
        </div>
    )
}

export default ProfileModal;