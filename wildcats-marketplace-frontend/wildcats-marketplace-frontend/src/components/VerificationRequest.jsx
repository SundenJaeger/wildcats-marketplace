import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Clock, X } from 'lucide-react';
import assets from '../assets/assets';

export default function VerificationRequestScreen() {
  const [requests, setRequests] = useState([
    {
      verification_id: 'VR001',
      student_id: 'STU12345',
      status: 'pending',
      request_date: '2024-11-15',
      response_date: null,
      admin_notes: 'Waiting for document review',
      rejection_reason: null
    },
    {
      verification_id: 'VR002',
      student_id: 'STU12346',
      status: 'approved',
      request_date: '2024-11-10',
      response_date: '2024-11-12',
      admin_notes: 'All documents verified',
      rejection_reason: null
    },
    {
      verification_id: 'VR003',
      student_id: 'STU12347',
      status: 'rejected',
      request_date: '2024-11-08',
      response_date: '2024-11-14',
      admin_notes: 'Documents incomplete',
      rejection_reason: 'Missing official transcript'
    }
  ]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('All Requests');
  const filters = ['All Requests', 'Pending', 'Approved', 'Rejected'];
  const baseClasses = 'p-2 text-xs font-semibold border-2 rounded-md transition duration-200';
  const inactiveClasses = 'border-[#ffce1f] bg-[#fff3c7] text-amber-950 hover:bg-[#ffe380]';
  const activeClasses = 'border-[#A31800] bg-[#A31800] text-white shadow-md';
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 border-green-200';
      case 'rejected':
        return 'bg-red-50 border-red-200';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <X className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getFilteredRequests = () => {
    if (selectedFilter === 'All Requests') return requests;
    const statusMap = {
      'Pending': 'pending',
      'Approved': 'approved',
      'Rejected': 'rejected'
    };
    return requests.filter(req => req.status === statusMap[selectedFilter]);
  };
  
  const filteredRequests = getFilteredRequests();
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  };
  
  return (
    <>
      {/* Stats Cards */}
      <div className="flex justify-between gap-2">
        <div className="flex justify-between items-center font-semibold p-3 py-6 w-60 rounded-md shadow-md border-2 border-[#A31800] bg-gradient-to-r from-red-700 to-amber-800 text-white">
          <div className="flex flex-col">
            <h6>Total Requests</h6>
            <h4 className="text-3xl font-bold">{stats.total}</h4>
          </div>
          <AlertCircle className="w-9 h-9" />
        </div>
        <div className="flex justify-between items-center font-semibold p-3 py-6 w-60 rounded-md shadow-md border-2 border-[#A31800] bg-gradient-to-r from-orange-600 to-amber-700 text-white">
          <div className="flex flex-col">
            <h6>Pending</h6>
            <h4 className="text-3xl font-bold">{stats.pending}</h4>
          </div>
          <Clock className="w-9 h-9" />
        </div>
        <div className="flex justify-between items-center font-semibold p-3 py-6 w-60 rounded-md shadow-md border-2 border-[#A31800] bg-gradient-to-r from-green-600 to-green-800 text-white">
          <div className="flex flex-col">
            <h6>Approved</h6>
            <h4 className="text-3xl font-bold">{stats.approved}</h4>
          </div>
          <CheckCircle className="w-9 h-9" />
        </div>
        <div className="flex justify-between items-center font-semibold p-3 py-6 w-60 rounded-md shadow-md border-2 border-[#A31800] bg-gradient-to-r from-red-600 to-red-800 text-white">
          <div className="flex flex-col">
            <h6>Rejected</h6>
            <h4 className="text-3xl font-bold">{stats.rejected}</h4>
          </div>
          <X className="w-9 h-9" />
        </div>
      </div>
      
      {/* Filter Section */}
      <div className="p-3 px-6 flex flex-col bg-[#FFF7DA] rounded-md shadow-md border-2 border-[#A31800]">
        <div className="flex items-center py-3 gap-2">
          <img className='w-4 h-4' src={assets.filter_1_icon} alt="Filter" />
          <h4 className="text-red-900 font-bold">Filter Verification Requests</h4>
        </div>
        <div className="flex gap-1 mb-3 flex-wrap">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`${baseClasses} ${
                selectedFilter === filter ? activeClasses : inactiveClasses
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      
      {/* Requests List Section */}
      <div>
        <div className="flex justify-between items-center py-2">
          <h2 className="text-red-900 text-xl font-bold">{selectedFilter}</h2>
          <h6 className='text-red-900 text-xs font-bold'>{filteredRequests.length} requests</h6>
        </div>
        {filteredRequests.length > 0 ? (
          <div className="w-full h-70 bg-[#FFF7DA] rounded-md shadow-md border-2 border-[#A31800] overflow-hidden">
            <div className="space-y-2 p-3 h-100">
            </div>
          </div>
        ) : (
          <div className="w-full h-70 bg-[#FFF7DA] flex rounded-md shadow-md border-2 border-[#A31800]">
            <div className="w-full h-full flex flex-col justify-center items-center pb-15 box-border">
              <img className='w-15 h-15' src={assets.warning_icon} alt="No Requests" />
              <h3 className="text-red-900 font-bold">No requests found</h3>
              <p className="text-red-900">There are no verification requests matching your filter.</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Details Panel */}
      {selectedRequest && (
        <div className="p-4 bg-white rounded-md shadow-md border-2 border-[#A31800]">
          <div className="flex items-center gap-2 mb-4">
            {getStatusIcon(selectedRequest.status)}
            <h2 className="text-xl font-bold text-gray-800">
              {selectedRequest.verification_id}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="pb-4 border-b border-gray-200">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Status</p>
              <p className={`text-lg font-bold mt-1 ${
                selectedRequest.status === 'approved' ? 'text-green-600' :
                selectedRequest.status === 'rejected' ? 'text-red-600' :
                'text-yellow-600'
              }`}>
                {selectedRequest.status.toUpperCase()}
              </p>
            </div>
            <div className="pb-4 border-b border-gray-200">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Student ID</p>
              <p className="text-gray-800 mt-1">{selectedRequest.student_id}</p>
            </div>
            <div className="pb-4 border-b border-gray-200">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Request Date</p>
              <p className="text-gray-800 mt-1">{selectedRequest.request_date}</p>
            </div>
            {selectedRequest.response_date && (
              <div className="pb-4 border-b border-gray-200">
                <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Response Date</p>
                <p className="text-gray-800 mt-1">{selectedRequest.response_date}</p>
              </div>
            )}
            <div className="pb-4 border-b border-gray-200 md:col-span-2">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Admin Notes</p>
              <p className="text-gray-800 mt-1 text-sm">{selectedRequest.admin_notes}</p>
            </div>
            {selectedRequest.rejection_reason && (
              <div className="pb-4 border-b border-gray-200 md:col-span-2 bg-red-50 p-3 rounded">
                <p className="text-xs uppercase tracking-wide text-red-700 font-semibold">Rejection Reason</p>
                <p className="text-red-900 mt-1 text-sm">{selectedRequest.rejection_reason}</p>
              </div>
            )}
          </div>
          <div className="flex gap-2 pt-2">
            <button className="flex-1 bg-[#A31800] text-white py-2 rounded-lg font-medium hover:bg-red-900 transition-colors">
              View Files
            </button>
            <button 
              onClick={() => setSelectedRequest(null)}
              className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}