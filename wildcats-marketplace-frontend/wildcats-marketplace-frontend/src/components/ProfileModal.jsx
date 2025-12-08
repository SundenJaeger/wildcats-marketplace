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
        <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40'>
        <div className="flex flex-col p-3 px-4 bg-[#FFF7D7] h-auto w-[800px] rounded-lg">
            <div className='flex items-center justify-between pl-3 mb-2'>
                <div className='flex flex-col mt-3'>
                    <h2 className='text-xl font-bold text-black'>My Profile</h2>
                </div>
            </div>

            {/* Main Body */}
            <div className='box-border flex justify-between h-full min-w-full p-2'>
                <div className='flex items-start justify-between w-full gap-4 p-6 bg-white rounded-2xl'>
                    {/* Left Side */}
                    <div className='flex flex-col w-2/3 gap-3'>
                        {/* Full Name */}
                        <div>
                            <label className='block font-bold text-black'>Full Name:</label>
                            <div className='bg-gray-100 rounded-md'>
                                <input
                                    type='text'
                                    value={user.fullName}
                                    readOnly
                                    className='w-full p-2 text-sm text-black bg-gray-100 rounded-md focus:outline-none'
                                />
                            </div>
                        </div>

                        <div className='flex gap-2'>
                            {/* Student Email */}
                            <div className='w-6/10'>
                                <label className='block font-bold text-black'>Student Email</label>
                                <div className='bg-gray-100 rounded-md'>
                                    <input
                                        type='text'
                                        value={user.email}
                                        readOnly
                                        className='w-full p-2 text-sm text-black bg-gray-100 rounded-md focus:outline-none'
                                    />
                                </div>
                            </div>

                             {/* Username */}
                            <div className='w-5/10'>
                                <label className='block font-bold text-black'>Username</label>
                                <div className='bg-gray-100 rounded-md'>
                                    <input
                                        type='text'
                                        value={user.username}
                                        readOnly
                                        className='w-full p-2 text-sm text-black bg-gray-100 rounded-md focus:outline-none'
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex gap-2'>
                            {/* Program */}
                            {user.program && (
                                <div className='w-6/10'>
                                    <label className='block font-bold text-black'>Program</label>
                                    <div className='bg-gray-100 rounded-md'>
                                        <input
                                            type='text'
                                            value={`${user.program} ${user.yearLevel ? `(${user.yearLevel})` : ''}`}
                                            readOnly
                                            className='w-full p-2 text-sm text-black bg-gray-100 rounded-md focus:outline-none'
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Student ID */}
                            <div className='w-5/10'>
                                <label className='block font-bold text-black'>Student ID</label>
                                <div className='bg-gray-100 rounded-md'>
                                    <input
                                        type='text'
                                        value={user.studentId}
                                        readOnly
                                        className='w-full p-2 text-sm text-black bg-gray-100 rounded-md focus:outline-none'
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex gap-2'>
                            {/* Account Type */}
                            {user.userType && (
                                <div className='w-5/10'>
                                    <label className='block mb-1 font-bold text-black'>Account Type</label>
                                    <div className='p-2 bg-gray-100 rounded-md'>
                                        <div className='text-sm font-semibold text-black'>
                                            {user.userType === 'S' ? 'Student' : 'Admin'}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Verification Status */}
                            {user.isVerified !== undefined && (
                                <div className='w-5/10'>
                                    <label className='block mb-1 font-bold text-black'>Verified</label>
                                    <div className='p-2 bg-gray-100 rounded-md'>
                                        <div className={`text-sm font-semibold ${user.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                                            {user.isVerified ? '✓ Verified' : '⏳ Pending'}
                                        </div>
                                    </div>
                                </div>
                            )}
                            </div>
                    </div>

                    {/* Right Side - Profile Image */}
                    <div className='flex flex-col gap-2 items-center min-w-[200px]'>
                        <img
                            className='object-cover w-40 h-40 p-2 bg-white border-2 border-gray-300 rounded-md'
                            src={profileImage}
                            alt="Profile"
                        />
                        <p className='text-xs text-center text-gray-600'>
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

                        <div className='flex flex-col w-full gap-2'>
                            <button
                                onClick={handleButtonClick}
                                className='bg-[#B20000] text-white p-2 px-3 rounded-lg text-xs font-extrabold hover:bg-[#8B0000] hover:scale-101 transition-all cursor-pointer'>
                                Change Photo
                            </button>

                            {profileImage !== assets.blank_profile_icon && (
                                <button
                                    onClick={handleRemoveImage}
                                    className='p-2 px-3 text-xs font-extrabold text-white transition-all bg-gray-400 rounded-lg cursor-pointer hover:bg-gray-500 hover:scale-101'>
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex items-center justify-between gap-2 p-2'>
                <p className='text-xs text-gray-600'>
                    Contact administrator to update profile information.
                </p>
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

export default ProfileModal;