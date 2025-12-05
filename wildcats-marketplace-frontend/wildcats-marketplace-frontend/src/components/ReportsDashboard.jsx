import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Clock, X, Trash2, Eye, UserCheck } from 'lucide-react';

const API_URL = 'http://localhost:8080/api/reports';

const ReportsDashboard = () => {
    const [selectedFilter, setSelectedFilter] = useState('All Reports');
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const filters = ['All Reports', 'PENDING', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED'];
    const filterLabels = {
        'All Reports': 'All Reports',
        'PENDING': 'Pending',
        'UNDER_REVIEW': 'Under Review',
        'RESOLVED': 'Resolved',
        'DISMISSED': 'Dismissed'
    };

    const baseClasses = 'p-2 text-xs font-semibold border-2 rounded-md transition duration-200';
    const inactiveClasses = 'border-[#ffce1f] bg-[#fff3c7] text-amber-950 hover:bg-[#ffe380]';
    const activeClasses = 'border-[#A31800] bg-[#A31800] text-white shadow-md';

    // Fetch all reports
    const fetchReports = async () => {
        setLoading(true);
        try {
            const endpoint = selectedFilter === 'All Reports'
                ? API_URL
                : `${API_URL}/status/${selectedFilter}`;
            const response = await fetch(endpoint);
            const data = await response.json();
            setReports(data);
        } catch (error) {
            console.error('Error fetching reports:', error);
            setReports([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [selectedFilter]);

    // Update report status
    const updateReportStatus = async (reportId, newStatus) => {
        try {
            const response = await fetch(`${API_URL}/${reportId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                fetchReports();
                setShowModal(false);
            } else {
                const errorText = await response.text();
                alert(`Failed to update report status: ${errorText}`);
            }
        } catch (error) {
            console.error('Error updating report status:', error);
            alert('Failed to update report status');
        }
    };

    // Delete report
    const deleteReport = async (reportId) => {
        if (window.confirm('Are you sure you want to delete this report?')) {
            try {
                const response = await fetch(`${API_URL}/${reportId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    fetchReports();
                    setShowModal(false);
                    alert('Report deleted successfully');
                } else {
                    const errorText = await response.text();
                    alert(`Failed to delete report: ${errorText}`);
                }
            } catch (error) {
                console.error('Error deleting report:', error);
                alert('Failed to delete report');
            }
        }
    };

    // Delete associated resource with better error handling
    const deleteResource = async (resourceId) => {
        if (!resourceId) {
            alert('No resource ID available to delete');
            return;
        }

        const confirmMessage = `Are you sure you want to delete the reported resource (ID: ${resourceId})?\n\nThis will:\n- Delete the resource permanently\n- Remove all associated images\n- Delete all comments\n- Remove all bookmarks\n- This action CANNOT be undone!`;

        if (window.confirm(confirmMessage)) {
            setDeleteLoading(true);
            try {
                console.log(`Attempting to delete resource ID: ${resourceId}`);

                const response = await fetch(`http://localhost:8080/api/resources/${resourceId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Delete response status:', response.status);

                if (response.ok || response.status === 204) {
                    alert('Resource deleted successfully');

                    // Mark the report as resolved after successful deletion
                    if (selectedReport) {
                        try {
                            await updateReportStatus(selectedReport.reportId, 'RESOLVED');
                        } catch (statusError) {
                            console.error('Failed to update report status:', statusError);
                            // Continue anyway since the resource was deleted
                        }
                    }

                    // Refresh the reports list
                    await fetchReports();
                    setShowModal(false);
                } else {
                    // Try to get error details
                    let errorMessage = 'Unknown error';
                    try {
                        const errorText = await response.text();
                        console.error('Delete error response:', errorText);
                        errorMessage = errorText || `HTTP ${response.status}`;
                    } catch (e) {
                        errorMessage = `HTTP ${response.status}`;
                    }

                    alert(`Failed to delete resource: ${errorMessage}\n\nThis might be due to:\n- Resource not found\n- Database constraints\n- Server error\n\nCheck the console for details.`);
                }
            } catch (error) {
                console.error('Error deleting resource:', error);
                alert(`Network error while deleting resource: ${error.message}\n\nPlease check:\n- Your internet connection\n- Backend server is running\n- CORS is properly configured`);
            } finally {
                setDeleteLoading(false);
            }
        }
    };

    // Calculate statistics
    const stats = {
        total: reports.length,
        pending: reports.filter(r => r.status === 'PENDING').length,
        underReview: reports.filter(r => r.status === 'UNDER_REVIEW').length,
        resolved: reports.filter(r => r.status === 'RESOLVED').length
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDING': return <Clock className="w-5 h-5 text-orange-600" />;
            case 'UNDER_REVIEW': return <AlertCircle className="w-5 h-5 text-blue-600" />;
            case 'RESOLVED': return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'DISMISSED': return <X className="w-5 h-5 text-red-600" />;
            default: return <Clock className="w-5 h-5" />;
        }
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'UNDER_REVIEW': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'RESOLVED': return 'bg-green-100 text-green-800 border-green-300';
            case 'DISMISSED': return 'bg-red-100 text-red-800 border-red-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch {
            return 'Invalid Date';
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleString();
        } catch {
            return 'Invalid Date';
        }
    };

    const getReporterName = (report) => {
        if (report.student && report.student.firstName && report.student.lastName) {
            return `${report.student.firstName} ${report.student.lastName}`;
        }
        return report.studentId ? `Student ID: ${report.studentId}` : 'N/A';
    };

    return (
        <div className="p-6 space-y-6">
            {/* Statistics Cards */}
            <div className='flex justify-between gap-4'>
                <div className='flex justify-between items-center font-semibold p-4 py-6 flex-1 rounded-md shadow-md border-2 border-[#A31800] bg-gradient-to-r from-red-700 to-amber-800 text-white'>
                    <div className='flex flex-col'>
                        <h6>Total Reports</h6>
                        <h4 className='text-3xl font-bold'>{stats.total}</h4>
                    </div>
                    <AlertCircle className="w-11 h-11" />
                </div>

                <div className='flex justify-between items-center font-semibold p-4 py-6 flex-1 rounded-md shadow-md border-2 border-[#A31800] bg-gradient-to-r from-orange-600 to-amber-700 text-white'>
                    <div className='flex flex-col'>
                        <h6>Pending</h6>
                        <h4 className='text-3xl font-bold'>{stats.pending}</h4>
                    </div>
                    <Clock className="w-9 h-9" />
                </div>

                <div className='flex justify-between items-center font-semibold p-4 py-6 flex-1 rounded-md shadow-md border-2 border-[#A31800] bg-gradient-to-r from-blue-700 to-indigo-800 text-white'>
                    <div className='flex flex-col'>
                        <h6>Under Review</h6>
                        <h4 className='text-3xl font-bold'>{stats.underReview}</h4>
                    </div>
                    <AlertCircle className="w-9 h-9" />
                </div>

                <div className='flex justify-between items-center font-semibold p-4 py-6 flex-1 rounded-md shadow-md border-2 border-[#A31800] bg-gradient-to-r from-green-600 to-green-800 text-white'>
                    <div className='flex flex-col'>
                        <h6>Resolved</h6>
                        <h4 className='text-3xl font-bold'>{stats.resolved}</h4>
                    </div>
                    <CheckCircle className="w-9 h-9" />
                </div>
            </div>

            {/* Filter Section */}
            <div className='p-4 px-6 bg-[#FFF7DA] rounded-md shadow-md border-2 border-[#A31800]'>
                <div className='flex items-center py-3 gap-2'>
                    <AlertCircle className='w-4 h-4 text-red-900' />
                    <h4 className='text-red-900 font-bold'>Filter Reports</h4>
                </div>
                <div className='flex gap-2 mb-3 flex-wrap'>
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setSelectedFilter(filter)}
                            className={`${baseClasses} ${
                                selectedFilter === filter ? activeClasses : inactiveClasses
                            }`}
                        >
                            {filterLabels[filter]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Reports List */}
            <div>
                <div className='flex justify-between items-center py-3'>
                    <h2 className='text-red-900 text-xl font-bold'>{filterLabels[selectedFilter]}</h2>
                    <h6 className='text-red-900 text-xs font-bold'>{reports.length} reports</h6>
                </div>

                {loading ? (
                    <div className='w-full h-64 bg-[#FFF7DA] flex items-center justify-center rounded-md shadow-md border-2 border-[#A31800]'>
                        <p className='text-red-900 font-semibold'>Loading reports...</p>
                    </div>
                ) : reports.length === 0 ? (
                    <div className='w-full h-64 bg-[#FFF7DA] flex rounded-md shadow-md border-2 border-[#A31800]'>
                        <div className='w-full h-full flex flex-col justify-center items-center'>
                            <AlertCircle className='w-16 h-16 text-red-900 mb-3' />
                            <h3 className='text-red-900 font-bold'>No reports found</h3>
                            <p className='text-red-900'>There are no reports in this category yet.</p>
                        </div>
                    </div>
                ) : (
                    <div className='bg-[#FFF7DA] rounded-md shadow-md border-2 border-[#A31800] overflow-hidden'>
                        <div className='overflow-x-auto'>
                            <table className='w-full'>
                                <thead className='bg-[#A31800] text-white'>
                                <tr>
                                    <th className='p-3 text-left text-sm font-semibold'>ID</th>
                                    <th className='p-3 text-left text-sm font-semibold'>Reason</th>
                                    <th className='p-3 text-left text-sm font-semibold'>Resource</th>
                                    <th className='p-3 text-left text-sm font-semibold'>Reporter</th>
                                    <th className='p-3 text-left text-sm font-semibold'>Status</th>
                                    <th className='p-3 text-left text-sm font-semibold'>Date</th>
                                    <th className='p-3 text-left text-sm font-semibold'>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {reports.map((report, index) => (
                                    <tr key={report.reportId} className={index % 2 === 0 ? 'bg-white' : 'bg-[#FFF9E5]'}>
                                        <td className='p-3 text-sm text-red-900'>#{report.reportId}</td>
                                        <td className='p-3 text-sm text-red-900 font-semibold'>{report.reason}</td>
                                        <td className='p-3 text-sm text-red-900'>
                                            {report.resource?.title || `ID: ${report.resourceId || 'N/A'}`}
                                        </td>
                                        <td className='p-3 text-sm text-red-900'>{getReporterName(report)}</td>
                                        <td className='p-3'>
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(report.status)}`}>
                                                {getStatusIcon(report.status)}
                                                {report.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className='p-3 text-sm text-red-900'>
                                            {formatDate(report.dateReported)}
                                        </td>
                                        <td className='p-3'>
                                            <button
                                                onClick={() => {
                                                    setSelectedReport(report);
                                                    setShowModal(true);
                                                }}
                                                className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold transition flex items-center gap-1'
                                            >
                                                <Eye className='w-3 h-3' />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal for Report Details */}
            {showModal && selectedReport && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
                        <div className='bg-[#A31800] text-white p-4 flex justify-between items-center sticky top-0'>
                            <h3 className='text-xl font-bold'>Report Details #{selectedReport.reportId}</h3>
                            <button onClick={() => setShowModal(false)} className='hover:bg-red-800 p-1 rounded'>
                                <X className='w-6 h-6' />
                            </button>
                        </div>

                        <div className='p-6 space-y-4'>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='text-sm font-semibold text-gray-700'>Status</label>
                                    <div className='mt-1'>
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusBadgeColor(selectedReport.status)}`}>
                                            {getStatusIcon(selectedReport.status)}
                                            {selectedReport.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className='text-sm font-semibold text-gray-700'>Date Reported</label>
                                    <p className='mt-1 text-sm'>{formatDateTime(selectedReport.dateReported)}</p>
                                </div>
                            </div>

                            <div>
                                <label className='text-sm font-semibold text-gray-700'>Reason</label>
                                <p className='mt-1 text-sm font-semibold text-red-900'>{selectedReport.reason}</p>
                            </div>

                            <div>
                                <label className='text-sm font-semibold text-gray-700'>Description</label>
                                <p className='mt-1 text-sm bg-gray-50 p-3 rounded border'>{selectedReport.description || 'No description provided'}</p>
                            </div>

                            <div>
                                <label className='text-sm font-semibold text-gray-700'>Reporter Information</label>
                                <div className='mt-1 bg-gray-50 p-3 rounded border'>
                                    {selectedReport.student ? (
                                        <>
                                            <p className='text-sm'><strong>Name:</strong> {selectedReport.student.firstName} {selectedReport.student.lastName}</p>
                                            <p className='text-sm'><strong>Email:</strong> {selectedReport.student.email || 'N/A'}</p>
                                            <p className='text-sm'><strong>Student ID:</strong> {selectedReport.student.studentId}</p>
                                        </>
                                    ) : (
                                        <p className='text-sm'><strong>Student ID:</strong> {selectedReport.studentId || 'N/A'}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className='text-sm font-semibold text-gray-700'>Reported Resource</label>
                                <div className='mt-1 bg-gray-50 p-3 rounded border'>
                                    {selectedReport.resource ? (
                                        <>
                                            <p className='text-sm'><strong>Resource ID:</strong> {selectedReport.resource.resourceId}</p>
                                            <p className='text-sm'><strong>Title:</strong> {selectedReport.resource.title}</p>
                                        </>
                                    ) : (
                                        <p className='text-sm'><strong>Resource ID:</strong> {selectedReport.resourceId || 'N/A'}</p>
                                    )}
                                </div>
                            </div>

                            {selectedReport.dateResolved && (
                                <div>
                                    <label className='text-sm font-semibold text-gray-700'>Date Resolved</label>
                                    <p className='mt-1 text-sm'>{formatDateTime(selectedReport.dateResolved)}</p>
                                </div>
                            )}

                            <div className='border-t pt-4 mt-4'>
                                <label className='text-sm font-semibold text-gray-700 block mb-3'>Admin Actions</label>
                                <div className='grid grid-cols-2 gap-3'>
                                    <button
                                        onClick={() => updateReportStatus(selectedReport.reportId, 'UNDER_REVIEW')}
                                        disabled={deleteLoading}
                                        className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                                    >
                                        <UserCheck className='w-4 h-4' />
                                        Mark Under Review
                                    </button>
                                    <button
                                        onClick={() => updateReportStatus(selectedReport.reportId, 'RESOLVED')}
                                        disabled={deleteLoading}
                                        className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                                    >
                                        <CheckCircle className='w-4 h-4' />
                                        Mark Resolved
                                    </button>
                                    <button
                                        onClick={() => updateReportStatus(selectedReport.reportId, 'DISMISSED')}
                                        disabled={deleteLoading}
                                        className='bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                                    >
                                        <X className='w-4 h-4' />
                                        Dismiss Report
                                    </button>
                                    <button
                                        onClick={() => deleteResource(selectedReport.resourceId)}
                                        disabled={!selectedReport.resourceId || deleteLoading}
                                        className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                                        title={!selectedReport.resourceId ? 'No resource ID available' : deleteLoading ? 'Deleting...' : 'Delete the reported resource'}
                                    >
                                        {deleteLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Deleting...
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 className='w-4 h-4' />
                                                Delete Resource
                                            </>
                                        )}
                                    </button>
                                </div>
                                <button
                                    onClick={() => deleteReport(selectedReport.reportId)}
                                    disabled={deleteLoading}
                                    className='w-full mt-3 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    <Trash2 className='w-4 h-4' />
                                    Delete Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsDashboard;