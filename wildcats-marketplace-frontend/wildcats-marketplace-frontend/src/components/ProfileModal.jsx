import React from 'react'
import assets from '../assets/assets'

const ProfileModal = ({onClose}) => {

    const [selectedOption, setSelectedOption] = React.useState('');

    const placeholder_user = {fullname: "John Doe",username: 'johndoe', student_id: "ex. 19-3946-347", student_email: "john.doe@cit.edu"}

    return (
    <div className='fixed inset-0 flex flex-col justify-center items-center bg-black/40 z-51'>
        <div className='flex flex-col justify-between bg-[#FFF4CB] border-[#FFE26D] rounded-md p-4 w-170 h-auto'> 

        <div className='flex justify-between items-start '>
            <div className='flex flex-col ml-5 mt-5 mb-2'>
                <h2 className='text-black font-bold text-xl'>My Profile</h2>
                <p className='text-black font-semibold'>Manage your account.</p>
            </div>
                <div onClick={onClose}
                className='flex justify-center items-center w-5 h-5 bg-[#B20000] rounded-full'>
                <input type="image" className="w-2.5  h-2.5" src={assets.white_close_icon}></input>
            </div>
        </div>

        {/* Line Break */}
        <div className='flex justify-center items-center w-auto h-[1px] bg-black my-2 mx-1'></div>

        {/* Main Body */}
        <div className='flex justify-around items-start py-5'>
            {/* Left Side */}
            <div className='grid grid-cols-1 w-2/3'>
                {/* Full Name */}
                <div className='grid grid-cols-[140px_1fr] items-center text-end gap-2 my-2'>
                    <label className='text-black font-bold'>Full Name</label>
                    <input type='text' placeholder={placeholder_user.fullname} className='placeholder-gray-600 bg-white rounded-sm border-2 border-gray-300 p-1'></input>
                </div>
                {/* Username */}
                <div className='grid grid-cols-[140px_1fr] items-center text-end gap-2 my-2'>
                    <label className='text-black font-bold'>Username</label>
                    <input type='text' placeholder={placeholder_user.username} className='placeholder-gray-600 bg-white rounded-sm border-2 border-gray-300 p-1'></input>
                </div>
                {/* Student ID */}
                <div className='grid grid-cols-[140px_1fr] items-center text-end gap-2 my-2'>
                    <label className='text-black font-bold'> Student ID</label>
                    <input type='text' placeholder={placeholder_user.student_id} className='placeholder-gray-600 bg-white rounded-sm border-2 border-gray-300 p-1'></input>
                </div>
                {/* Student Email */}
                <div className='grid grid-cols-[140px_1fr] items-center text-end gap-2 my-2'>
                    <label className='text-black font-bold'>Student Email</label>
                    <input type='text' placeholder={placeholder_user.student_email} className='placeholder-gray-600 bg-white rounded-sm border-2 border-gray-300 p-1'></input>
                </div>
                {/* Preferred Location */}
                <div className='grid grid-cols-[140px_1fr] items-center text-end gap-2 my-2'>
                    <label className='text-black font-bold'>Preferred Location</label>
                    <div className='relative bg-white rounded-sm border-2 border-gray-300 p-1'>
                        <select className='w-full'>
                            <option>RTL Building</option>
                            <option>NGE Building</option>
                            <option>GLE Building</option>
                            <option>Acad Building</option>
                            <option>PE Activity Area</option>
                            <option>Gymnasium</option>
                        </select>
                        <img
                            src={assets.drop_down_icon}
                            alt="Dropdown"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
                        />
                    </div>

                </div>
                {/* Change Password */}
                <div className='grid grid-cols-[140px_1fr] items-center text-end gap-2 my-2'>
                    <label className='text-black font-bold'>Change Password</label>
                    <input className='bg-white rounded-sm border-2 border-gray-300 p-1'></input>
                </div>
                {/* Gender */}
                <div className='grid grid-cols-[140px_1fr] items-center text-end gap-2 my-2'>
                    <label className='text-black font-bold'>Gender</label>
                    <div className='grid grid-cols-3 justify-items-center gap-1'>
                        <label className='flex items-center  gap-1 text-black font-semibold'>
                            <input className='appearance-none w-4 h-4 rounded-full border-2 border-gray-300 bg-white' type='radio' name='gender' value='male' checked={selectedOption === 'male'} onChange={(e) => setSelectedOption(e.target.value)} />
                            Male
                        </label>
                        <label className='flex items-center  gap-1 text-black font-semibold'>
                            <input className='appearance-none w-4 h-4 rounded-full border-2 border-gray-300 bg-white' type='radio' name='gender' value='female' checked={selectedOption === 'female'} onChange={(e) => setSelectedOption(e.target.value)} />
                            Female
                        </label>
                        <label className='flex items-center  gap-1 text-black font-semibold'>
                            <input className='appearance-none w-4 h-4 rounded-full border-2 border-gray-300 bg-white' type='radio' name='gender' value='other' checked={selectedOption === 'other'} onChange={(e) => setSelectedOption(e.target.value)} />
                            Other
                    </label>
                </div>

                </div>
                    {/* Date of Birth */}
                    <div className='grid grid-cols-[140px_1fr] items-center text-end gap-2 my-2'>
                        <label className='text-black font-bold'>Date of Birth</label>
                        <input type='date' className='bg-white rounded-sm border-2 border-gray-300 p-1 w-full text-black'></input>
                    </div>
                </div>

            {/* Right Side */}
            <div className='flex flex-col gap-2 items-center'>
                <img className='w-20 h-20 bg-white rounded-full' src={assets.blank_profile_icon}></img>
                <button className='bg-[#B20000] p-1 rounded-md px-2 text-xs font-semibold'>Change Picture</button>
            </div>
        </div>

        {/* Save Button */}
        <div className='flex justify-end'>
            <button className='bg-[#B20000] p-1 rounded-md px-5 text-sm font-bold'>
                Save
            </button>
        </div>
        </div>
    </div>
)
}

export default ProfileModal
