import React from 'react';
import assets from '../assets/assets';

const ReportsDashboard = () => {
    const [selectedFilter, setSelectedFilter] = React.useState('All Reports');
    const filters = ['All Reports', 'Pending', 'Under Review', 'Resolved', 'Rejected'];

    const baseClasses = 'p-2 text-xs font-semibold border-2 rounded-md transition duration-200';
    const inactiveClasses = 'border-[#ffce1f] bg-[#fff3c7] text-amber-950 hover:bg-[#ffe380]';
    const activeClasses = 'border-[#A31800] bg-[#A31800] text-white shadow-md';

    const handleButtonClick = (filter) => {
        setSelectedFilter(filter);
    };

    return (
        <>
            <div className='flex justify-between gap-2'>
                <div className='flex justify-between items-center font-semibold p-3 py-6 w-60 rounded-md shadow-md border-2 border-[#A31800] bg-gradient-to-r from-red-700 to-amber-800'>
                    <div className='flex flex-col'>
                        <h6>Total Reports</h6>
                        <h4 className='text-3xl font-bold'>0</h4>
                    </div>
                    <img className='w-10 h-10' src={assets.total_reports_icon} alt="Total Reports" />
                </div>

                <div className='flex justify-between items-center font-semibold p-3 py-6 w-60 rounded-md shadow-md border-2 border-[#A31800] bg-gradient-to-r from-orange-600 to-amber-700'>
                    <div className='flex flex-col'>
                        <h6>Pending</h6>
                        <h4 className='text-3xl font-bold'>0</h4>
                    </div>
                    <img className='w-8 h-8' src={assets.clock_icon} alt="Pending" />
                </div>

                <div className='flex justify-between items-center font-semibold p-3 py-6 w-60 rounded-md shadow-md border-2 border-[#A31800] bg-gradient-to-r from-blue-700 to-indigo-800'> 
                    <div className='flex flex-col'>
                        <h6>Under Review</h6>
                        <h4 className='text-3xl font-bold'>0</h4>
                    </div>
                    <img className='w-8 h-8' src={assets.clock_icon} alt="Under Review" />
                </div>

                <div className='flex justify-between items-center font-semibold p-3 py-6 w-60 rounded-md shadow-md border-2 border-[#A31800] bg-gradient-to-r from-green-600 to-green-800'>
                    <div className='flex flex-col'>
                        <h6>Resolved</h6>
                        <h4 className='text-3xl font-bold'>0</h4>
                    </div>
                    <img className='w-8 h-8' src={assets.check_icon} alt="Resolved" />
                </div>
            </div>

            <div className='p-3 px-6 flex flex-col bg-[#FFF7DA] rounded-md shadow-md border-2 border-[#A31800]'>
                <div className='flex items-center py-3 gap-2'>
                    <img className='w-4 h-4' src={assets.filter_1_icon} alt="Filter" />
                    <h4 className='text-red-900 font-bold'>Filter Reports</h4>
                </div>
                <div className='flex gap-1 mb-3'>
                    {filters.map((filter) => (
                        <button
                            key={filter} 
                            onClick={() => handleButtonClick(filter)}
                            className={`${baseClasses} ${
                                selectedFilter === filter ? activeClasses : inactiveClasses
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <div className='flex justify-between items-center py-2'>
                    <h2 className='text-red-900 text-xl font-bold'>All Reports</h2>
                    <h6 className='text-red-900 text-xs font-bold'>0 reports</h6>
                </div>
                <div className='w-full h-70 bg-[#FFF7DA] flex rounded-md shadow-md border-2 border-[#A31800]'>
                    <div className='w-full h-full flex flex-col justify-center items-center pb-15 box-border'>
                        <img className='w-15 h-15' src={assets.warning_icon} alt="No Reports" />
                        <h3 className='text-red-900 font-bold'>No reports found</h3>
                        <p className='text-red-900'>There are no reports in the systems yet.</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReportsDashboard;