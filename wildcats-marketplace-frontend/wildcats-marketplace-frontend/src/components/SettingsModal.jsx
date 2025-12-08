import React from 'react'
import assets from '../assets/assets'

const SettingsModal = ({onClose, onLogout}) => {

  const [settingsOption, setSettingsOption] = React.useState('notifs')

  const handleLogout = () => {
    if(onLogout){
      onLogout();
    }
  }

  const renderContent = () => {
    switch(settingsOption){
      case 'notifs':
        return (
          <>
            <div className='flex flex-col items-center justify-center h-full'>
              <img className='w-20 h-20 m-2 rounded-xl' src={assets.empty_space_icon}>
              </img>
              <p className='p-1 font-semibold text-black'>Poof! It's empty...</p>
            </div>
          </>
        )
      case 'transacts':
        return (
          <>
            <div className='flex flex-col items-center justify-center h-full'>
              <img className='w-20 h-20 m-2 rounded-xl' src={assets.empty_space_icon}>
              </img>
              <p className='p-1 font-semibold text-black'>Poof! It's empty...</p>
            </div>
          </>
        )
      case 'logout':
        return (
          <>
            <div className='flex flex-col items-center justify-center h-full gap-2'>
              <img className='w-20 h-20' src={assets.sad_icon}></img>
              <h3 className='font-bold text-black'>Are you sure you want to log out?</h3>
              <div className='my-10'>
                <button
                onClick={handleLogout}
                className='p-3 px-5 font-bold bg-red-700 rounded-lg hover:scale-102'>Log out?</button>
              </div>
            </div>
          </>       
        )
      default:

    }
  }

  return (
    <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40'>
      <div className='flex flex-col p-3 px-4 bg-[#FFF7D7] h-auto w-[800px] rounded-lg'>

        <div className='flex items-center justify-between pl-3 mb-2'>
          <div className='flex flex-col mt-3'>
            <h2 className='text-xl font-bold text-black'>Settings</h2>
          </div>
        </div>

        {/* Main Body */}
        <div className='box-border flex justify-between h-full min-w-full p-2'>
          <div className='flex items-start justify-between w-full gap-4 p-4 bg-white rounded-2xl'>

            {/* Left Side - Navigation */}
            <div className='flex flex-col items-start justify-start w-[35%] gap-2'>
                <button type='button' onClick={() => setSettingsOption('notifs')}
                className={`w-full text-black text-left font-bold text-sm p-3 px-4 rounded-lg transition-colors ${settingsOption === 'notifs' ? 'bg-gray-200' : 'bg-gray-50 hover:bg-gray-100' }`}>
                Notification Settings
                </button>
                <button type='button' onClick={() => setSettingsOption('transacts')}
                className={`w-full text-black font-bold text-sm text-left p-3 px-4 rounded-lg transition-colors ${settingsOption === 'transacts' ? 'bg-gray-200' : 'bg-gray-50 hover:bg-gray-100' }`}>
                My transactions
                </button>
                <button type='button' onClick={() => setSettingsOption('logout')}
                className={`w-full text-black font-bold text-sm text-left p-3 px-4 rounded-lg transition-colors ${settingsOption === 'logout' ? 'bg-gray-200' : 'bg-gray-50 hover:bg-gray-100' }`}>
                Logout
                </button>
            </div>

            {/* Right Side - Content */}
            <div className='bg-gray-50 w-full h-full rounded-lg p-4 min-h-[400px]'>
              {renderContent()}
            </div>

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

export default SettingsModal
