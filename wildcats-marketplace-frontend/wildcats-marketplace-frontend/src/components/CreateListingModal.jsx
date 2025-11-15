import React from 'react'
import assets from '../assets/assets'
import { Upload, X } from 'lucide-react';                 

const CreateListingModal = ({ onClose }) => {

  const [chosenCategory, setChosenCategory] = React.useState('academics');
  
    const [chosenCondition, setChosenCondition] = React.useState('bnew');
  
    const [price, setPrice] = React.useState('-100');
  
    const [chosenFilters, setChosenFilters] = React.useState([]);

    const [images, setImages] = React.useState([]);
    const maxImages = 5;

    const handleImageUpload = (e) => {
      const files = Array.from(e.target.files);
      const remainingSlots = maxImages - images.length;
      const filesToAdd = files.slice(0, remainingSlots);

      filesToAdd.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages((prev) => {
            if (prev.length < maxImages) {
              return [...prev, { id: Date.now() + Math.random(), url: reader.result }];
            }
            return prev;
          });
        };
        reader.readAsDataURL(file);
      });

      e.target.value = '';
    };

    const removeImage = (id) => {
      setImages((prev) => prev.filter((img) => img.id !== id));
    };

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

          <div className='flex min-w-full h-full justify-between p-2 gap-5 box-border'>
            {/* Left Side */}
            <div className='flex flex-col p-2 bg-white min-w-[50%] rounded-2xl'>
                <div className='flex flex-col'>
                  <div className='px-5 my-1'>
                    <label className='text-black p-1 font-bold'>
                      Title
                    </label>
                    <div className='bg-gray-100 rounded-md'>
                      <textarea className='w-full text-black p-2 resize-none' rows={1} required wrap='hard' type='text' placeholder='Enter here...'>
                      </textarea>
                    </div>
                  </div>

                  <div className='px-5 my-1'>
                    <label className='text-black p-1 font-bold'>
                      Description
                    </label>
                    <div className='bg-gray-100 rounded-md'>
                      <textarea className='w-full text-black p-2 resize-none' rows={3} required wrap='hard' type='text' placeholder='Enter here...'>
                      </textarea>
                    </div>
                  </div>

                  <div className='px-5 my-1'>
                    <label className='text-black p-1 font-bold'>
                      Price
                    </label>
                    <div className='bg-gray-100 rounded-md'>
                      <input 
                      className='w-full p-2'
                      type='text' placeholder='Enter here...'></input>
                    </div>
                  </div>

                  <div className='px-5 my-1'>
                    <label className='text-black p-1 font-bold'>
                      Category
                    </label>
                    <div className='bg-gray-100 rounded-md p-2'>
                      <select value={chosenCondition} onChange={(e) => setChosenCondition(e.target.value)} className='focus:outline-none focus:ring-0 appearance-none justify-between w-full bg-gray-100 px-2 rounded-md text-black font-semibold'>
                        <option value='academics' >Academic Books & Notes</option>
                        <option value='supplies' >School Supplies</option>
                        <option value='general' >General Items</option>
                      </select>
                    </div>
                  </div>

                  <div className='px-5 my-1'>
                    <label className='text-black p-1 font-bold'>
                      Condition
                    </label>
                    <div className='bg-gray-100 rounded-md p-2'>
                      <select value={chosenCondition} onChange={(e) => setChosenCondition(e.target.value)} className='focus:outline-none focus:ring-0 appearance-none justify-between w-full bg-gray-100 px-2 rounded-md text-black font-semibold'>
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

            {/* Right Side */}
            <div className="flex items-start  min-w-[40%]">
              <div className="bg-white rounded-2xl px-8 py-3 w-full h-full max-w-4xl">
                <h2 className="text-xl font-bold text-gray-800 mb-5">Upload Images</h2>

                <div className="flex flex-wrap justify-center gap-4">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="relative w-30 h-30 rounded-lg overflow-hidden shadow-md group"
                    >
                      <img
                        src={image.url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeImage(image.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}

                  {images.length < maxImages && (
                    <label className="w-30 h-30 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200">
                      <Upload size={32} className="text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500 font-medium">Upload Image</span>
                      <span className="text-xs text-gray-400 mt-1">
                        {images.length}/{maxImages}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        multiple
                      />
                    </label>
                  )}
                </div>

                {images.length === maxImages && (
                  <div className="mt-6 p-2 bg-rose-50 border border-rose-200 rounded-lg flex justify-center items-center">
                    <p className="text-rose-950 text-xs font-medium text-center">
                      Maximum images reached..
                    </p>
                  </div>
                )}
              </div>
            </div>
        </div>

      </div>
    </div>
  )
}

export default CreateListingModal