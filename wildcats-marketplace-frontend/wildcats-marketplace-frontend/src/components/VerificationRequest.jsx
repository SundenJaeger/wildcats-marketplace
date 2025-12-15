import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, X, FileText } from 'lucide-react';
import { verificationRequestService } from '../services/verificationRequestService';// Import the service
import assets from '../assets/assets';// Keep if you use it for other UI elements

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
    const fetchRequests = async (status = null) => {
        try {
            setLoading(true);
            const data = await verificationRequestService.getAllRequests(status);
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

    // Fetch requests whenever filter changes
    useEffect(() => {
        const statusParam = selectedFilter === 'All Requests' ? null : selectedFilter.toLowerCase();
        fetchRequests(statusParam);
    }, [selectedFilter]);

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

            await fetchRequests(selectedFilter === 'All Requests' ? null : selectedFilter.toLowerCase());
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

    // Stats
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

    if (loading) return <div className="p-8 text-center text-gray-500">Loading requests...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="p-6">
            {/* Header */}
            <div className='flex items-center gap-2 mb-8'>
                <img src={assets.white_student_icon} className='p-2 bg-red-800 rounded-sm w-13 h-13' alt="icon"/>
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Student Verification Requests</h2>
                    <p className="text-gray-500 text-md">Manage and review student account verifications</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-2 mb-8 md:grid-cols-4">
                <StatCard title="Total Requests" value={stats.total} icon={<FileText className="w-11 h-11"/>} color="red"/>
                <StatCard title="Pending" value={stats.pending} icon={<Clock className="w-9 h-9"/>} color="yellow"/>
                <StatCard title="Approved" value={stats.approved} icon={<CheckCircle className="w-9 h-9"/>} color="blue"/>
                <StatCard title="Rejected" value={stats.rejected} icon={<X className="w-9 h-9"/>} color="green"/>
            </div>

            {/* Filters */}
            <div className="flex gap-2 p-1 mb-4 bg-red-900 border-2 border-red-900 rounded-lg">
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
                        {filter}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-[#fffbee] rounded-md shadow-md border-2 border-[#530c00]/70">
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
                        {requests.map(req => (
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
                                <td className="px-6 py-4 text-gray-600">{new Date(req.requestDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(req.status)}`}>
                                        {req.status.toUpperCase()}
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
                        {requests.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                    No requests found for this filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Detail Modal */}
            {selectedRequest && (
                <RequestDetailModal
                    request={selectedRequest}
                    adminNotes={adminNotes}
                    setAdminNotes={setAdminNotes}
                    rejectionReason={rejectionReason}
                    setRejectionReason={setRejectionReason}
                    handleUpdateStatus={handleUpdateStatus}
                    isProcessing={isProcessing}
                    closeModal={() => setSelectedRequest(null)}
                    getStatusColor={getStatusColor}
                />
            )}
        </div>
    );
}

// Modal Component
const RequestDetailModal = ({ request, adminNotes, setAdminNotes, rejectionReason, setRejectionReason, handleUpdateStatus, isProcessing, closeModal, getStatusColor }) => (
    <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm'>
        <div className="flex flex-col p-3 px-4 bg-[#FFF7D7] h-auto w-[650px] rounded-lg max-h-[90vh]">
            <div className='flex items-center justify-between pl-3 mb-2'>
                <div className='flex flex-col mt-3'>
                    <h2 className='text-xl font-bold text-black'>Request Details</h2>
                    <p className="text-sm text-gray-600">ID: #{request.verificationId}</p>
                </div>
            </div>

            <div className='box-border flex justify-between h-full min-w-full p-2 overflow-y-auto'>
                <div className='flex flex-col w-full gap-4 p-4 bg-white rounded-2xl'>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className='block mb-1 text-xs font-bold text-gray-500 uppercase'>Student Name</label>
                            <p className="font-medium text-gray-900">{request.student?.user?.firstName} {request.student?.user?.lastName}</p>
                        </div>
                        <div>
                            <label className='block mb-1 text-xs font-bold text-gray-500 uppercase'>Email</label>
                            <p className="text-gray-900">{request.student?.user?.email}</p>
                        </div>
                        <div>
                            <label className='block mb-1 text-xs font-bold text-gray-500 uppercase'>Enrollment Status</label>
                            <p className="text-gray-900">{request.student?.enrollmentStatus || 'N/A'}</p>
                        </div>
                        <div>
                            <label className='block mb-1 text-xs font-bold text-gray-500 uppercase'>Current Status</label>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(request.status)}`}>
                                {request.status.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-gray-200"></div>

                    <div>
                        <label className='block mb-1 font-bold text-black'>Admin Notes</label>
                        <div className='bg-gray-100 rounded-md'>
                            <textarea
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                rows={3}
                                className='w-full p-2 text-sm text-black bg-gray-100 rounded-md resize-none focus:outline-none'
                                placeholder='Internal notes...'
                                disabled={request.status !== 'PENDING'}
                            />
                        </div>
                    </div>

                    {request.status === 'PENDING' && (
                        <div>
                            <label className='block mb-1 font-bold text-red-700'>Rejection Reason (Required if rejecting)</label>
                            <input
                                type="text"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="w-full p-2 text-sm text-black bg-gray-100 rounded-md focus:outline-none"
                                placeholder="Reason for rejection..."
                            />
                        </div>
                    )}

                    {request.status === 'REJECTED' && request.rejectionReason && (
                        <div>
                            <label className='block mb-1 text-xs font-bold text-red-700 uppercase'>Rejection Reason Provided</label>
                            <div className='p-3 border border-red-200 rounded-md bg-red-50'>
                                <p className="text-sm text-red-800">{request.rejectionReason}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className='flex items-center justify-end gap-2 p-2'>
                <button onClick={closeModal} className='p-2 px-5 text-xs font-extrabold transition-all bg-gray-400 rounded-lg hover:scale-101 hover:bg-gray-500'>
                    Close
                </button>
                {request.status === 'PENDING' && (
                    <>
                        <button
                            onClick={() => handleUpdateStatus('REJECTED')}
                            disabled={isProcessing}
                            className='p-2 px-5 text-xs font-extrabold text-white transition-all bg-red-600 rounded-lg hover:scale-101 hover:bg-red-700 disabled:opacity-50'
                        >
                            {isProcessing ? 'Processing...' : 'Reject'}
                        </button>
                        <button
                            onClick={() => handleUpdateStatus('APPROVED')}
                            disabled={isProcessing}
                            className='p-2 px-5 text-xs font-extrabold text-white transition-all bg-green-600 rounded-lg hover:scale-101 hover:bg-green-700 disabled:opacity-50'
                        >
                            {isProcessing ? 'Processing...' : 'Approve Request'}
                        </button>
                    </>
                )}
            </div>
        </div>
    </div>
);

// Stat Card
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
            <div className={`p-2 rounded-lg bg-white/50`}>{icon}</div>
        </div>
    );
};