import React from 'react'
import assets from '../assets/assets'
import ReportModal from './ReportModal'

const CreateListingModal = ({ onClose }) => {

  const [chosenCategory, setChosenCategory] = React.useState('academics');
  
    const [chosenCondition, setChosenCondition] = React.useState('bnew');
  
    const [price, setPrice] = React.useState('-100');
  
    const [chosenFilters, setChosenFilters] = React.useState([]);

    const toggleFilter = (filter) => {
    setChosenFilters((prevFilters) =>
      prevFilters.includes(filter) ? prevFilters.filter((f) => f !== filter) : [...prevFilters, filter]
    );
  };

  return (
    <div className='fixed inset-0 flex flex-col justify-center items-center bg-black/40 z-51'>
        <div className="flex flex-col p-2 px-3 bg-[#FFF7D7] h-[700px] w-200 rounded-lg">

          <div className='flex justify-between pl-3 mb-2 items-center'>
              <div className='flex justify-between items-center mt-3'>
                  <h2 className='text-black font-bold text-xl'>Create Listing</h2>
              </div>
              <div onClick={onClose}
                  className='flex justify-center items-center w-5 h-5 bg-[#B20000] rounded-full cursor-pointer'>
                  <input type="image" className="w-2.5  h-2.5" src={assets.white_close_icon}></input>
              </div>
          </div>

        <div className='flex flex-col'>
          <div className='p-5'>
            <label className='text-black p-1 font-bold'>
              Title
            </label>
            <div className='bg-white rounded-md'>
              <textarea className='w-full text-black p-2 resize-none' rows={1} required wrap='hard' type='text' placeholder='Enter here...'>
              </textarea>
            </div>
          </div>

          <div className='p-5'>
            <label className='text-black p-1 font-bold'>
              Description
            </label>
            <div className='bg-white rounded-md'>
              <textarea className='w-full text-black p-2 resize-none' rows={3} required wrap='hard' type='text' placeholder='Enter here...'>
              </textarea>
            </div>
          </div>

          <div className='p-5'>
            <label className='text-black p-1 font-bold'>
              Price
            </label>
            <div className='bg-white rounded-md'>
              <input 
              className='w-full p-2'
              type='text' placeholder='Enter here...'></input>
            </div>
          </div>

          <div className='p-5'>
            <label className='text-black p-1 font-bold'>
              Category
            </label>
            <div className='bg-white rounded-md p-2'>
              <select value={chosenCondition} onChange={(e) => setChosenCondition(e.target.value)} className='focus:outline-none focus:ring-0 appearance-none justify-between w-full bg-white px-2 rounded-md text-black font-semibold'>
                <option value='academics' >Academic Books & Notes</option>
                <option value='supplies' >School Supplies</option>
                <option value='general' >General Items</option>
              </select>
            </div>
          </div>

          

          <div className='p-5'>
            <label className='text-black p-1 font-bold'>
              Condition
            </label>
            <div className='bg-white rounded-md p-2'>
              <select value={chosenCondition} onChange={(e) => setChosenCondition(e.target.value)} className='focus:outline-none focus:ring-0 appearance-none justify-between w-full bg-white px-2 rounded-md text-black font-semibold'>
                <option value='bnew' >Brand New</option>
                <option value='excellent' >Excellent</option>
                <option value='good' >Good</option>
                <option value='used' >Used</option>
                <option value='poor' >Poor</option>
              </select>
            </div>
          </div>

          


      </div>
    </div>
    </div>
  )
}

export default CreateListingModal