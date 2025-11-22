import React from 'react'
import assets from '../assets/assets'

const ProfileModal = ({onClose}) => {


    const [selectedOption, setSelectedOption] = React.useState('');

    const placeholder_user = {fullname: "John Doe",username: 'johndoe', student_id: "ex. 19-3946-347", student_email: "john.doe@cit.edu"}

    return (
    <div className='fixed inset-0 flex flex-col justify-center items-center bg-black/40 z-51'>
        <div className='flex flex-col justify-between bg-[#fff1bd] rounded-md p-4 w-200 h-auto pb-8 border-2 border-[#726948]'> 

        <div className='flex justify-between items-start '>
            <div className='flex flex-col ml-5 mt-5 mb-2'>
                <h2 className='text-red-950 font-bold !text-3xl'>My Profile</h2>
                <p className='text-red-950 font-semibold text-sm'>Manage your account.</p>
            </div>
                <div onClick={onClose}
                className='flex justify-center items-center w-5 h-5 bg-[#B20000] rounded-full'>
                <input type="image" className="w-2.5  h-2.5" src={assets.white_close_icon}></input>
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
                    <label className='text-red-950 font-bold text-sm text-nowrap'> Student ID</label>
                    <input type='text' placeholder={placeholder_user.student_id} className='text-sm font-bold pl-2 placeholder-gray-600 bg-white rounded-sm border-2 border-gray-300 p-1'></input>
                </div>
                {/* Student Email */}
                <div className='grid grid-cols-[140px_1fr] items-center text-end gap-2'>
                    <label className='text-red-950 font-bold text-sm text-nowrap'>Student Email</label>
                    <input type='text' placeholder={placeholder_user.student_email} className='text-sm font-bold pl-2 placeholder-gray-600 bg-white rounded-sm border-2 border-gray-300 p-1'></input>
                </div>
                {/* Preferred Location */}
                <div className='grid grid-cols-[140px_1fr] items-center text-end gap-2'>
                    <label className='text-red-950 font-bold text-sm text-nowrap'>Preferred Location</label>
                    <div className='relative bg-white rounded-sm border-2 border-gray-300 py-[4px]'>
                        <select className='w-full text-sm font-bold text-gray-600 appearance-none pl-2'>
                            <option className='font-bold'>RTL Building</option>
                            <option className='font-bold'>NGE Building</option>
                            <option className='font-bold'>GLE Building</option>
                            <option className='font-bold'>Acad Building</option>
                            <option className='font-bold'>PE Activity Area</option>
                            <option className='font-bolvvvvvvvvvvvvvvvd'>Gymnasium</option>
                        </select>
                        <img
                            src={assets.drop_down_icon}
                            alt="Dropdown"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
                        />
                    </div>

                </div>
                {/* Change Password */}
                <div className='grid grid-cols-[140px_1fr] items-center text-end gap-2'>
                    <label className='text-red-950 font-bold text-sm text-nowrap'>Change Password</label>
                    <input className='bg-white rounded-sm border-2 border-gray-300 p-1'></input>
                </div>
                {/* Gender */}
                <div className='grid grid-cols-[140px_1fr] items-center text-end gap-2'>
                    <label className='text-red-950 font-bold text-sm text-nowrap'>Gender</label>
                    <div className='grid grid-cols-3 justify-items-center gap-1'>
                        <label className='text-sm flex items-center  gap-1 text-red-950 font-semibold'>
                            <input className='appearance-none w-4 h-4 rounded-full border-2 border-gray-300 bg-white' type='radio' name='gender' value='male' checked={selectedOption === 'male'} onChange={(e) => setSelectedOption(e.target.value)} />
                            Male
                        </label>
                        <label className='text-sm flex items-center  gap-1 text-red-950 font-semibold'>
                            <input className='appearance-none w-4 h-4 rounded-full border-2 border-gray-300 bg-white' type='radio' name='gender' value='female' checked={selectedOption === 'female'} onChange={(e) => setSelectedOption(e.target.value)} />
                            Female
                        </label>
                        <label className='text-sm flex items-center  gap-1 text-red-950 font-semibold'>
                            <input className='appearance-none w-4 h-4 rounded-full border-2 border-gray-300 bg-white' type='radio' name='gender' value='other' checked={selectedOption === 'other'} onChange={(e) => setSelectedOption(e.target.value)} />
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
                <img className='w-32 h-32 bg-white p-5 border-3 border-gray-300 rounded-md' src={assets.blank_profile_icon}></img>
                <button className='bg-[#B20000] p-2 px-3 rounded-md text-xs font-bold hover:scale-101 box-border border-2 border-red-800'>Change Picture</button>
            </div>
        </div>

        {/* Save Button */}
        <div className='flex justify-end px-5'>
            <button className='bg-[#B20000] p-2 rounded-md px-5 text-sm font-bold box-border border-2 border-red-800'>
                Save
            </button>
        </div>
        </div>
    </div>
)
}

export default ProfileModal
