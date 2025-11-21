import React from 'react'
import assets from '../assets/assets'

const SettingsModal = ({onClose}) => {

  const [settingsOption, setSettingsOption] = React.useState('notifs')

  return (
    <div className='fixed inset-0 flex flex-col justify-center items-center bg-black/40 z-51'>
      <div className='flex flex-col justify-start bg-[#FFEB99] border-2 border-red-800 rounded-lg p-4 w-230 min-h-200'>

        <div className='flex justify-end items-start'>
                <div onClick={onClose}
                className='flex justify-center items-center w-5 h-5 bg-[#B20000] rounded-full'>
                <input type="image" className="w-2.5  h-2.5" src={assets.white_close_icon}></input>
            </div>
        </div>

        <div className='flex flex-col px-5 h-full'>

          {/* Settings title */}
          <div className='flex flex-col mb-2'>
            <h2 className='text-black font-bold text-3xl'>Settings</h2>
          </div>

          {/* Line Break */}
          <div className='flex justify-center items-center w-auto h-[1px] bg-black my-2 mx-1'></div>

          {/* Main Body */}
          <div className='flex justify-between items-start py-5 h-full gap-3'>

            {/* Left Side */}
            <div className='flex flex-col items-start justify-center w-[22%] gap-1'>
                <button type='button' onClick={() => setSettingsOption('notifs')}
                className={`w-full text-black text-center font-bold text-xs p-3 px-3 rounded-md ${settingsOption === 'notifs' ? 'bg-[#FFF7DA]' : 'bg-[#FFEB99]' }`}>
                Notification Settings
                </button>
                <button type='button' onClick={() => setSettingsOption('transacts')}
                className={`w-full text-black font-bold text-xs text-center p-3 px-5 rounded-md  ${settingsOption === 'transacts' ? 'bg-[#FFF7DA]' : 'bg-[#FFEB99]' }`}>
                My transactions
                </button>
                <button type='button' onClick={() => setSettingsOption('logout')}
                className={`w-full text-black font-bold text-xs text-center p-3 px-5 rounded-md ${settingsOption === 'logout' ? 'bg-[#FFF7DA]' : 'bg-[#FFEB99]' }`}>
                Logout
                </button>
            </div>

            {/* Idk what we should put here so its just a placeholder fn */}
            <div className='bg-[#FFFAE4] flex flex-col items-center justify-center w-full h-full'>
              <img className='w-20 h-20 rounded-xl m-2' src={assets.empty_space_icon}>
              </img>
              <p className='text-black font-semibold p-1'>Poof! It's empty...</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal
