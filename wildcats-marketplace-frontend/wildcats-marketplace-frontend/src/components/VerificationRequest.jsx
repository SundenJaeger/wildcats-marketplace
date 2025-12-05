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

    // Filter Logic
    const filteredRequests = requests.filter(req => {
        if (selectedFilter === 'All Requests') return true;
        return req.status === selectedFilter;
    });

    if (loading) return <div className="p-8 text-center text-gray-500">Loading requests...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Student Verification Requests</h1>
                <p className="text-gray-500">Manage and review student account verifications</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <StatCard title="Total Requests" value={stats.total} icon={<FileText />} color="blue" />
                <StatCard title="Pending" value={stats.pending} icon={<Clock />} color="yellow" />
                <StatCard title="Approved" value={stats.approved} icon={<CheckCircle />} color="green" />
                <StatCard title="Rejected" value={stats.rejected} icon={<X />} color="red" />
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50">
                    <div className="flex gap-2 p-1 bg-gray-200 rounded-lg">
                        {filters.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setSelectedFilter(filter)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                    selectedFilter === filter
                                        ? 'bg-white text-gray-800 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table List */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-4">Request ID</th>
                            <th className="px-6 py-4">Student Name</th>
                            <th className="px-6 py-4">Date Submitted</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {filteredRequests.map((req) => (
                            <tr key={req.verificationId} className="hover:bg-gray-50 transition-colors">
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
                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Request Details</h2>
                                <p className="text-sm text-gray-500">ID: #{selectedRequest.verificationId}</p>
                            </div>
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Student Name</label>
                                    <p className="text-gray-800 font-medium">{selectedRequest.student?.user?.firstName} {selectedRequest.student?.user?.lastName}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
                                    <p className="text-gray-800">{selectedRequest.student?.user?.email}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Enrollment Status</label>
                                    <p className="text-gray-800">{selectedRequest.student?.enrollmentStatus || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Current Status</label>
                                    <span className={`inline-block px-2 py-1 mt-1 rounded text-xs font-bold ${getStatusColor(selectedRequest.status)}`}>
                                        {selectedRequest.status}
                                    </span>
                                </div>
                            </div>

                            {/* Action Section - Only show if PENDING or for reviewing notes */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Admin Notes</label>
                                    <textarea
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Internal notes about this request..."
                                        rows="3"
                                        disabled={selectedRequest.status !== 'PENDING'}
                                    />
                                </div>

                                {selectedRequest.status === 'PENDING' && (
                                    <div>
                                        <label className="block text-sm font-semibold text-red-700 mb-1">Rejection Reason (Required if rejecting)</label>
                                        <input
                                            type="text"
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-red-500 outline-none"
                                            placeholder="Reason for rejection..."
                                        />
                                    </div>
                                )}

                                {/* Read-only display for handled requests */}
                                {selectedRequest.status === 'REJECTED' && selectedRequest.rejectionReason && (
                                    <div>
                                        <label className="text-xs font-bold text-red-700 uppercase">Rejection Reason Provided</label>
                                        <p className="text-sm text-red-800 bg-red-50 p-2 rounded mt-1 border border-red-100">
                                            {selectedRequest.rejectionReason}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Close
                            </button>

                            {selectedRequest.status === 'PENDING' && (
                                <>
                                    <button
                                        onClick={() => handleUpdateStatus('REJECTED')}
                                        disabled={isProcessing}
                                        className="px-4 py-2 bg-white text-red-600 border border-red-200 font-medium hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {isProcessing ? 'Processing...' : 'Reject'}
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus('APPROVED')}
                                        disabled={isProcessing}
                                        className="px-6 py-2 bg-green-600 text-white font-medium hover:bg-green-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                                    >
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
                <p className="text-2xl font-bold mt-1">{value}</p>
            </div>
            <div className={`p-2 rounded-lg bg-white/50`}>
                {icon}
            </div>
        </div>
    );
};