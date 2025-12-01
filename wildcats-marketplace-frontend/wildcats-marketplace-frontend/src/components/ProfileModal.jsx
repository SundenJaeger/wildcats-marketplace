import React from 'react'

// Placeholder assets - replace with your actual imports
const assets = {
    blank_profile_icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ccc"%3E%3Cpath d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/%3E%3C/svg%3E',
    white_close_icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"%3E%3Cpath d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/%3E%3C/svg%3E'
}

const ProfileModal = ({onClose}) => {
    const [selectedOption, setSelectedOption] = React.useState('');
    const [profileImage, setProfileImage] = React.useState(assets.blank_profile_icon);
    const fileInputRef = React.useRef(null);
    
    const placeholder_user = {
        fullname: "John Doe",
        username: 'johndoe', 
        student_id: "ex. 19-3946-347", 
        student_email: "john.doe@cit.edu"
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                alert('Please select a valid image file (JPEG, PNG, or GIF)');
                return;
            }

            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (file.size > maxSize) {
                alert('Image size should be less than 5MB');
                return;
            }

            // Create a preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveImage = () => {
        setProfileImage(assets.blank_profile_icon);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className='fixed inset-0 flex flex-col justify-center items-center bg-black/40 z-51'>
            <div className='flex flex-col justify-between bg-[#fff1bd] rounded-md p-4 w-200 h-auto pb-8 border-2 border-[#726948]'> 
                <div className='flex justify-between items-start'>
                    <div className='flex flex-col ml-5 mt-5 mb-2'>
                        <h2 className='text-red-950 font-bold !text-3xl'>My Profile</h2>
                        <p className='text-red-950 font-semibold text-sm'>Manage your account.</p>
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
                            <input type='text' placeholder={placeholder_user.fullname} className='text-sm font-bold pl-2 placeholder-gray-600 bg-white rounded-sm border-2 border-gray-300 p-1'></input>
                        </div>

                        {/* Username */}
                        <div className='grid grid-cols-[140px_1fr] items-center text-end gap-2'>
                            <label className='text-red-950 font-bold text-sm text-nowrap'>Username</label>
                            <input type='text' placeholder={placeholder_user.username} className='text-sm font-bold pl-2 placeholder-gray-600 bg-white rounded-sm border-2 border-gray-300 p-1'></input>
                        </div>

                        {/* Student ID */}
                        <div className='grid grid-cols-[140px_1fr] items-center text-end gap-2'>
                            <label className='text-red-950 font-bold text-sm text-nowrap'>Student ID</label>
                            <input type='text' placeholder={placeholder_user.student_id} className='text-sm font-bold pl-2 placeholder-gray-600 bg-white rounded-sm border-2 border-gray-300 p-1'></input>
                        </div>

                        {/* Student Email */}
                        <div className='grid grid-cols-[140px_1fr] items-center text-end gap-2'>
                            <label className='text-red-950 font-bold text-sm text-nowrap'>Student Email</label>
                            <input type='text' placeholder={placeholder_user.student_email} className='text-sm font-bold pl-2 placeholder-gray-600 bg-white rounded-sm border-2 border-gray-300 p-1'></input>
                        </div>

                        {/* Change Password */}
                        <div className='grid grid-cols-[140px_1fr] items-center text-end gap-2'>
                            <label className='text-red-950 font-bold text-sm text-nowrap'>Change Password</label>
                            <input type='password' className='bg-white rounded-sm border-2 border-gray-300 p-1'></input>
                        </div>

                        {/* Gender */}
                        <div className='grid grid-cols-[140px_1fr] items-center text-end gap-2'>
                            <label className='text-red-950 font-bold text-sm text-nowrap'>Gender</label>
                            <div className='grid grid-cols-3 justify-items-center gap-1'>
                                <label className='text-sm flex items-center gap-1 text-red-950 font-semibold cursor-pointer'>
                                    <input className='appearance-none w-4 h-4 rounded-full border-2 border-gray-300 bg-white checked:bg-[#B20000] checked:border-[#B20000] cursor-pointer' 
                                        type='radio' name='gender' value='male' 
                                        checked={selectedOption === 'male'} 
                                        onChange={(e) => setSelectedOption(e.target.value)} />
                                    Male
                                </label>
                                <label className='text-sm flex items-center gap-1 text-red-950 font-semibold cursor-pointer'>
                                    <input className='appearance-none w-4 h-4 rounded-full border-2 border-gray-300 bg-white checked:bg-[#B20000] checked:border-[#B20000] cursor-pointer' 
                                        type='radio' name='gender' value='female' 
                                        checked={selectedOption === 'female'} 
                                        onChange={(e) => setSelectedOption(e.target.value)} />
                                    Female
                                </label>
                                <label className='text-sm flex items-center gap-1 text-red-950 font-semibold cursor-pointer'>
                                    <input className='appearance-none w-4 h-4 rounded-full border-2 border-gray-300 bg-white checked:bg-[#B20000] checked:border-[#B20000] cursor-pointer' 
                                        type='radio' name='gender' value='other' 
                                        checked={selectedOption === 'other'} 
                                        onChange={(e) => setSelectedOption(e.target.value)} />
                                    Other
                                </label>
                            </div>
                        </div>

                        {/* Date of Birth */}
                        <div className='grid grid-cols-[140px_1fr] items-center text-end gap-2'>
                            <label className='text-red-950 font-bold text-sm text-nowrap'>Date of Birth</label>
                            <input type='date' className='text-sm font-bold bg-white rounded-sm border-2 border-gray-300 p-1 w-full text-gray-600'></input>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className='flex flex-col gap-2 items-center w-[25%] mr-10'>
                        <img 
                            className='w-32 h-32 bg-white p-2 border-3 border-gray-300 rounded-md object-cover' 
                            src={profileImage} 
                            alt="Profile"
                        />

                        {/* Hidden file input */}
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/jpeg,image/jpg,image/png,image/gif"
                            className='hidden'
                        />

                        <div className='flex gap-1'>
                            <button 
                                onClick={handleButtonClick}
                                className='bg-[#B20000] text-white p-2 px-3 rounded-md text-xs font-bold hover:bg-[#8B0000] hover:scale-101 box-border border-2 border-red-800 transition-all cursor-pointer'>
                                Change
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

                {/* Save Button */}
                <div className='flex justify-end px-5'>
                    <button className='bg-[#B20000] text-white p-2 rounded-md px-5 text-sm font-bold box-border border-2 border-red-800 hover:bg-[#8B0000] transition-colors cursor-pointer'>
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProfileModal;