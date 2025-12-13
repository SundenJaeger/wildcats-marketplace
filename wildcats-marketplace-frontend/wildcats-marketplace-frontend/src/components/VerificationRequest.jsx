import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Clock, X, FileText, Search, Filter } from 'lucide-react';
import { verificationRequestService } from '../services/verificationRequestService'; // Import the service
import assets from '../assets/assets'; // Keep if you use it for other UI elements

export default function VerificationRequestScreen() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter & Selection States
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('All Requests');

    // Action States (for Notes/Reason)
    const [adminNotes, setAdminNotes] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const filters = ['All Requests', 'PENDING', 'APPROVED', 'REJECTED'];

    // 1. Fetch Data on Mount
    const fetchRequests = async () => {
        try {
            setLoading(true);
            const data = await verificationRequestService.getAllRequests();
            // Sort by date descending (newest first)
            const sortedData = data.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));
            setRequests(sortedData);
            setError(null);
        } catch (err) {
            setError('Failed to load verification requests.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    // 2. Handle Status Update
    const handleUpdateStatus = async (status) => {
        if (!selectedRequest) return;

        // Basic validation
        if (status === 'REJECTED' && !rejectionReason.trim()) {
            alert("Please provide a rejection reason.");
            return;
        }

        try {
            setIsProcessing(true);
            await verificationRequestService.updateStatus(
                selectedRequest.verificationId,
                status,
                adminNotes,
                status === 'REJECTED' ? rejectionReason : null
            );

            // Refresh list and close modal
            await fetchRequests();
            setSelectedRequest(null);
            setAdminNotes('');
            setRejectionReason('');
            alert(`Request ${status.toLowerCase()} successfully.`);
        } catch (err) {
            alert("Failed to update status. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    // Helper: Stats Calculation
    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'PENDING').length,
        approved: requests.filter(r => r.status === 'APPROVED').length,
        rejected: requests.filter(r => r.status === 'REJECTED').length
    };

    // Helper: UI Classes
    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
            case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    // Filter Logic - FIXED
    const filteredRequests = requests.filter(req => {
        if (selectedFilter === 'All Requests') return true;
        return req.status === selectedFilter;
    });

    if (loading) return <div className="p-8 text-center text-gray-500">Loading requests...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="p-6 ">
            <div className='flex items-center gap-2 mb-8'>
                <img src={assets.white_student_icon} className='p-2 bg-red-800 rounded-sm w-13 h-13·'></img>
                <div className="">
                    <h2 className="text-3xl font-bold text-gray-800">Student Verification Requests</h2>
                    <p className="text-gray-500 text-md">Manage and review student account verifications</p>
                </div>
            </div>


             {/* Stats Cards - FIXED VALUES */}
            <div className="grid grid-cols-1 gap-2 mb-8 md:grid-cols-4">
                <div className='flex justify-between items-center font-semibold p-4 py-6 flex-1 rounded-md shadow-md border-2 border-[#A31800] bg-gradient-to-r from-red-700 to-amber-800 text-white'>
                    <div className='flex flex-col'>
                        <h6>Total Requests</h6>
                        <h4 className='text-3xl font-bold'>{stats.total || 0}</h4>
                    </div>
                    <FileText className="w-11 h-11" />
                </div>

                <div className='flex justify-between items-center font-semibold p-4 py-6 flex-1 rounded-md shadow-md border-2 border-[#A31800] bg-gradient-to-r from-orange-600 to-amber-700 text-white'>
                    <div className='flex flex-col'>
                        <h6>Pending</h6>
                        <h4 className='text-3xl font-bold'>{stats.pending || 0}</h4>
                    </div>
                    <Clock className="w-9 h-9" />
                </div>

                <div className='flex justify-between items-center font-semibold p-4 py-6 flex-1 rounded-md shadow-md border-2 border-[#A31800] bg-gradient-to-r from-blue-700 to-indigo-800 text-white'>
                    <div className='flex flex-col'>
                        <h6>Approved</h6>
                        <h4 className='text-3xl font-bold'>{stats.approved || 0}</h4>
                    </div>
                    <CheckCircle className="w-9 h-9" />
                </div>

                <div className='flex justify-between items-center font-semibold p-4 py-6 flex-1 rounded-md shadow-md border-2 border-[#A31800] bg-gradient-to-r from-green-600 to-green-800 text-white'>
                    <div className='flex flex-col'>
                        <h6>Rejected</h6>
                        <h4 className='text-3xl font-bold'>{stats.rejected || 0}</h4>
                    </div>
                    <X className="w-9 h-9" />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-[#fffbee] rounded-md shadow-md border-2 border-[#530c00]/70  overflow-hidden">
                {/* Toolbar */}
                <div className="flex flex-col items-center justify-between gap-4 p-4 border-b-2 border-[#A31800] bg-[#A31800] sm:flex-row">
                    <div className="flex gap-2 p-1 bg-red-900 border-2 border-red-900 rounded-lg">
                        {filters.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setSelectedFilter(filter)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                    selectedFilter === filter
                                        ? 'bg-[#b90600] text-white shadow-sm font-bold'
                                        : 'text-gray-200 hover:text-white'
                                }`}
                            >
                                {filter === 'All Requests' ? filter : filter.charAt(0) + filter.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table List */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-xs font-semibold uppercase bg-red-900 text-white-500">
                        <tr>
                            <th className="px-6 py-4">Request ID</th>
                            <th className="px-6 py-4">Student Name</th>
                            <th className="px-6 py-4">Date Submitted</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-white">
                        {filteredRequests.map((req) => (
                            <tr key={req.verificationId} className="transition-colors hover:bg-amber-50">
                                <td className="px-6 py-4 font-medium text-gray-900">#{req.verificationId}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                            <span className="font-medium text-gray-800">
                                                {req.student?.user?.firstName} {req.student?.user?.lastName}
                                            </span>
                                        <span className="text-xs text-gray-500">{req.student?.user?.email}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {new Date(req.requestDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(req.status)}`}>
                                            {req.status}
                                        </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => {
                                            setSelectedRequest(req);
                                            setAdminNotes(req.adminNotes || '');
                                            setRejectionReason(req.rejectionReason || '');
                                        }}
                                        className="text-sm font-medium text-red-800 hover:text-red-900"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredRequests.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                    No requests found for this filter.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedRequest && (
                <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm'>
                    <div className="flex flex-col p-3 px-4 bg-[#FFF7D7] h-auto w-[650px] rounded-lg max-h-[90vh]">
                        {/* Modal Header */}
                        <div className='flex items-center justify-between pl-3 mb-2'>
                            <div className='flex flex-col mt-3'>
                                <h2 className='text-xl font-bold text-black'>Request Details</h2>
                                <p className="text-sm text-gray-600">ID: #{selectedRequest.verificationId}</p>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className='box-border flex justify-between h-full min-w-full p-2 overflow-y-auto'>
                            <div className='flex flex-col w-full gap-4 p-4 bg-white rounded-2xl'>
                                {/* Student Info Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className='block mb-1 text-xs font-bold text-gray-500 uppercase'>Student Name</label>
                                        <p className="font-medium text-gray-900">
                                            {selectedRequest.student?.user?.firstName} {selectedRequest.student?.user?.lastName}
                                        </p>
                                    </div>
                                    <div>
                                        <label className='block mb-1 text-xs font-bold text-gray-500 uppercase'>Email</label>
                                        <p className="text-gray-900">{selectedRequest.student?.user?.email}</p>
                                    </div>
                                    <div>
                                        <label className='block mb-1 text-xs font-bold text-gray-500 uppercase'>Enrollment Status</label>
                                        <p className="text-gray-900">{selectedRequest.student?.enrollmentStatus || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className='block mb-1 text-xs font-bold text-gray-500 uppercase'>Current Status</label>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedRequest.status)}`}>
                                            {selectedRequest.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-200"></div>

                                {/* Admin Notes */}
                                <div>
                                    <label className='block mb-1 font-bold text-black'>
                                        Admin Notes
                                    </label>
                                    <div className='bg-gray-100 rounded-md'>
                                        <textarea
                                            value={adminNotes}
                                            onChange={(e) => setAdminNotes(e.target.value)}
                                            rows={3}
                                            className='w-full p-2 text-sm text-black bg-gray-100 rounded-md resize-none focus:outline-none'
                                            placeholder='Internal notes about this request...'
                                            disabled={selectedRequest.status !== 'PENDING'}
                                        />
                                    </div>
                                </div>

                                {/* Rejection Reason Input (only for pending) */}
                                {selectedRequest.status === 'PENDING' && (
                                    <div>
                                        <label className='block mb-1 font-bold text-red-700'>
                                            Rejection Reason (Required if rejecting)
                                        </label>
                                        <div className='bg-gray-100 rounded-md'>
                                            <input
                                                type="text"
                                                value={rejectionReason}
                                                onChange={(e) => setRejectionReason(e.target.value)}
                                                className="w-full p-2 text-sm text-black bg-gray-100 rounded-md focus:outline-none"
                                                placeholder="Reason for rejection..."
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Rejection Reason Display (for rejected requests) */}
                                {selectedRequest.status === 'REJECTED' && selectedRequest.rejectionReason && (
                                    <div>
                                        <label className='block mb-1 text-xs font-bold text-red-700 uppercase'>
                                            Rejection Reason Provided
                                        </label>
                                        <div className='p-3 border border-red-200 rounded-md bg-red-50'>
                                            <p className="text-sm text-red-800">{selectedRequest.rejectionReason}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className='flex items-center justify-end gap-2 p-2'>
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className='p-2 px-5 text-xs font-extrabold transition-all bg-gray-400 rounded-lg hover:scale-101 hover:bg-gray-500'>
                                Close
                            </button>

                            {selectedRequest.status === 'PENDING' && (
                                <>
                                    <button
                                        onClick={() => handleUpdateStatus('REJECTED')}
                                        disabled={isProcessing}
                                        className='p-2 px-5 text-xs font-extrabold text-white transition-all bg-red-600 rounded-lg hover:scale-101 hover:bg-red-700 disabled:opacity-50'>
                                        {isProcessing ? 'Processing...' : 'Reject'}
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus('APPROVED')}
                                        disabled={isProcessing}
                                        className='p-2 px-5 text-xs font-extrabold text-white transition-all bg-green-600 rounded-lg hover:scale-101 hover:bg-green-700 disabled:opacity-50'>
                                        {isProcessing ? 'Processing...' : 'Approve Request'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Simple Stat Card Component
const StatCard = ({ title, value, icon, color }) => {
    const colors = {
        blue: 'bg-blue-50 text-blue-600 border-blue-200',
        yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
        green: 'bg-green-50 text-green-600 border-green-200',
        red: 'bg-red-50 text-red-600 border-red-200'
    };

    return (
        <div className={`p-4 rounded-xl border ${colors[color]} flex items-center justify-between`}>
            <div>
                <p className="text-sm font-medium opacity-80">{title}</p>
                <p className="mt-1 text-2xl font-bold">{value}</p>
            </div>
            <div className={`p-2 rounded-lg bg-white/50`}>
                {icon}
            </div>
        </div>
    );
};