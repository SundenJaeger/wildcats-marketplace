import React from 'react'
import assets from '../assets/assets'

const ProductFilterModal = ({onClose}) => {

  const [chosenCategory, setChosenCategory] = React.useState('academics');

  const [chosenCondition, setChosenCondition] = React.useState('bnew');

  const [chosenPriceRange, setChosenPriceRange] = React.useState('-100');

  const [chosenFilters, setChosenFilters] = React.useState([]);

  const toggleFilter = (filter) => {
    setChosenFilters((prevFilters) => 
      prevFilters.includes(filter) ? prevFilters.filter((f) => f !== filter) : [...prevFilters, filter]
    );
  };

  return (
    <div className='fixed inset-0 flex flex-col justify-center items-center bg-black/40 z-51'>
      <div className='flex flex-col justify-start rounded-md p-4 border bg-[#FFF4CB] w-130 max-h-[90vh] overflow-y-au'> 
        
        <div className='flex justify-between items-start'>
            <div className='flex flex-col ml-5 mt-5 mb-2'>
                <h2 className='text-black font-bold text-xl'>Filter</h2>
            </div>
                <div onClick={onClose}
                className='flex justify-center items-center w-5 h-5 bg-[#B20000] rounded-full'>
                <input type="image" className="w-2.5  h-2.5" src={assets.white_close_icon}></input>
            </div>
        </div>

        {/* Line Break */}
        <div className='flex justify-center items-center w-auto h-[1px] bg-black mt-2 mx-1'></div>

        {/* Main Body */}
        <div className='flex flex-col justify-between items-between py-5 h-auto gap-1'>
            
          {/* Main Categories */}
          <div className='flex items-center text-start gap-1 my-1 bg-white rounded-lg w-full h-16 px-3'>
            <h3 className='text-black font-bold mx-1 w-31'>Category:</h3>
            <div className='relative w-full flex'>
              <select value={chosenCategory} onChange={(e) => setChosenCategory(e.target.value)} className='focus:outline-none focus:ring-0 appearance-none justify-between w-full bg-white px-2 rounded-md text-black font-semibold'>
                <option value='academics' >Academic Books & Notes</option>
                <option value='supplies' >School Supplies</option>
                <option value='general' >General Items</option>
              </select>
              <img className='absolute w-4 h-4 right-3 transform -translate-y-1/2 top-1/2' src={assets.drop_down_icon}></img>
            </div>
          </div>

          {/* Condition of Products */}
          <div className='flex items-center text-start gap-1 my-1 bg-white rounded-lg w-full h-16 px-3'>
            <h3 className='text-black font-bold m-1 w-31'>Condition:</h3>
            <div className='relative w-full flex'>
              <select value={chosenCondition} onChange={(e) => setChosenCondition(e.target.value)} className='focus:outline-none focus:ring-0 appearance-none justify-between w-full bg-white px-2 rounded-md text-black font-semibold'>
                <option value='bnew' >Brand New</option>
                <option value='excellent' >Excellent</option>
                <option value='good' >Good</option>
                <option value='used' >Used</option>
                <option value='poor' >Poor</option>
              </select>
              <img className='absolute w-4 h-4 right-3 transform -translate-y-1/2 top-1/2' src={assets.drop_down_icon}></img>
            </div>
          </div>

          {/* Price Range of Products */}
          <div className='flex items-center text-start gap-1 my-1 bg-white rounded-lg w-full h-16 px-3'>
            <h3 className='text-black font-bold m-1 w-31'>Price Range:</h3>
            <div className='relative w-full flex'>
              <select value={chosenPriceRange} onChange={(e) => setChosenPriceRange(e.target.value)} className='focus:outline-none focus:ring-0 appearance-none justify-between w-full bg-white px-2 rounded-md text-black font-semibold'>
                <option value='-100' > {"< $100"}</option>
                <option value='100-499' >{"$100 - $499"}</option>
                <option value='500-999' >{"< $500 - 999"}</option>
                <option value='999+' >{"> $999"}</option>
              </select>
              <img className='absolute w-4 h-4 right-3 transform -translate-y-1/2 top-1/2' src={assets.drop_down_icon}></img>
            </div>
          </div>

          
          <div className='relative w-full h-auto'>
            {/* Academic Books & Notes Category Filters */}
          {(chosenCategory === "academics") && (
            <div className=" items-center text-start gap-2 my-2 bg-white rounded-lg w-full h-full p-2 pl-3">
              
              <div>
                <h3 className="text-black font-bold mb-2">Type:</h3>
                <div className="flex flex-col gap-1 ml-3">
                  {[
                    { label: "Book", value: "books" },
                    { label: "Notes", value: "notes" },
                  ].map(({ label, value }) => (
                    <button
                      key={value}
                      onClick={() => toggleFilter(value)}
                      className="flex items-center gap-2 text-black font-semibold"
                    >
                      <span
                        className={`border-2 border-gray-400 w-3 h-3 rounded-full 
                        ${chosenFilters.includes(value) ? "bg-gray-500" : "bg-[#FFF4CB]"}`}
                      ></span>
                      <label>{label}</label>
                    </button>
                  ))}
                </div>
              </div>

              <div className="my-2 w-full h-[1px] bg-gray-300"></div>

              <div>
                <h3 className="text-black font-bold mb-2">College:</h3>
                <div className="flex flex-col gap-1 ml-3">
                  {[
                    { label: "College of Engineering and Architecture", value: "college_CA" },
                    { label: "College of Management, Business, & Accountancy", value: "college_MBA" },
                    { label: "College of Arts, Sciences, & Education", value: "college_CASE" },
                    { label: "College of Nursing & Allied Health Sciences", value: "college_NAHS" },
                    { label: "College of Computer Studies", value: "college_CCS" },
                    { label: "College of Criminal Justice", value: "college_CJ" },
                  ].map(({ label, value }) => (
                    <button
                      key={value}
                      onClick={() => toggleFilter(value)}
                      className="flex items-center gap-2 text-black font-semibold"
                    >
                      <span
                        className={`border-2 border-gray-400 w-3 h-3 rounded-full 
                        ${chosenFilters.includes(value) ? "bg-gray-500" : "bg-[#FFF4CB]"}`}
                      ></span>
                      <label>{label}</label>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}


          {/* School Supplies Category Filters */}
          {chosenCategory === 'supplies' && (
            <div className="items-center text-start gap-2 my-2 bg-white rounded-lg w-full h-full p-2 pl-3">
              <div>
                <h3 className="text-black font-bold mb-2">Type:</h3>
                <div className="flex flex-col gap-1 ml-3">
                  {[
                    { label: "Math & Science Tools", value: "math_and_science" },
                    { label: "Writing & Paper", value: "writing_and_paper" },
                    { label: "Art Supplies", value: "art_supplies" },
                    { label: "Physical Education / Sports", value: "pe_and_sports" },
                  ].map(({ label, value }) => (
                    <button
                      key={value}
                      onClick={() => toggleFilter(value)}
                      className="flex items-center gap-2 text-black font-semibold"
                    >
                      <span
                        className={`border-2 border-gray-400 w-3 h-3 rounded-full 
                        ${chosenFilters.includes(value) ? "bg-gray-500" : "bg-[#FFF4CB]"}`}
                      ></span>
                      <label>{label}</label>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}


          {/* General Items */}
          {chosenCategory === 'general' && (
            <div className="items-center text-start gap-2 my-2 bg-white rounded-lg w-full h-full p-2 pl-3">
              
              <div>
                <h3 className="text-black font-bold mb-2">Type:</h3>
                <div className="flex flex-col gap-1 ml-3">
                  {[
                    { label: "Electronics", value: "electronics" },
                    { label: "Accessories", value: "accessories" },
                    { label: "Home Essentials", value: "home_essentials" },
                    { label: "Clothing & Apparel", value: "clothing" },
                    { label: "Others", value: "others" },
                  ].map(({ label, value }) => (
                    <button
                      key={value}
                      onClick={() => toggleFilter(value)}
                      className="flex items-center gap-2 text-black font-semibold"
                    >
                      <span
                        className={`border-2 border-gray-400 w-3 h-3 rounded-full 
                        ${chosenFilters.includes(value) ? "bg-gray-500" : "bg-[#FFF4CB]"}`}
                      ></span>
                      <label>{label}</label>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          </div>
        
        </div>
      </div>
    </div>
  )
}

export default ProductFilterModal
