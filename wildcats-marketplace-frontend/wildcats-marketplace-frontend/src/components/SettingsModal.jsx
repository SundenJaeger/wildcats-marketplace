import React from 'react'
import assets from '../assets/assets'

const SettingsModal = ({onClose}) => {

  const [settingsOption, setSettingsOption] = React.useState('notifs')

  return (
    <div className='fixed inset-0 flex flex-col justify-center items-center bg-black/40 z-51'>
      <div className='flex flex-col justify-between bg-[#FFF4CB] border-[#FFE26D] rounded-md p-4 w-190 h-auto'> 
        
        <div className='flex justify-between items-start'>
            <div className='flex flex-col ml-5 mt-5 mb-2'>
                <h2 className='text-black font-bold text-xl'>Settings</h2>
            </div>
                <div onClick={onClose}
                className='flex justify-center items-center w-5 h-5 bg-[#B20000] rounded-full'>
                <input type="image" className="w-2.5  h-2.5" src={assets.white_close_icon}></input>
            </div>
        </div>

        {/* Line Break */}
        <div className='flex justify-center items-center w-auto h-[1px] bg-black my-2 mx-1'></div>

        {/* Main Body */}
        <div className='flex justify-around items-start py-5 h-100 gap-3'>
            
          {/* Left Side */}
          <div className='flex flex-col items-start justify-center w-1/3 pl-3'>
              <button type='button' onClick={() => setSettingsOption('notifs')}
              className={`w-full text-black font-bold text-lg text-left p-3 px-5 m-1 rounded-md ${settingsOption === 'notifs' ? 'bg-[#FFFAE4]' : 'bg-[#FFF4CB]' }`}>
              Notification Settings
              </button> 
              <button type='button' onClick={() => setSettingsOption('transacts')}
              className={`w-full text-black font-bold text-lg text-left p-3 px-5 m-1 rounded-md  ${settingsOption === 'transacts' ? 'bg-[#FFFAE4]' : 'bg-[#FFF4CB]' }`}>
              My transactions
              </button>
              <button type='button' onClick={() => setSettingsOption('logout')}
              className={`w-full text-black font-bold text-lg text-left p-3 px-5 m-1 rounded-md ${settingsOption === 'logout' ? 'bg-[#FFFAE4]' : 'bg-[#FFF4CB]' }`}>
              Logout
              </button>
          </div>

          {/* Idk what we should put here so its just a placeholder fn */}
          <div className='bg-[#FFFAE4] flex flex-col items-center justify-center w-2/3 h-full'>
            <img className='w-20 h-20 rounded-xl m-2' src={assets.empty_space_icon}>
            </img>
            <p className='text-black font-semibold p-1'>Poof! It's empty...</p>
          </div>
        
        </div>
      </div>
    </div>
  )
}

export default SettingsModal
