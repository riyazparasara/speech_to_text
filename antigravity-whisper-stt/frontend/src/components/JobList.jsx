import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const StatusBadge = ({ status }) => {
    const styles = {
        pending: 'bg-yellow-100 text-yellow-800',
        processing: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800',
    };

    const icons = {
        pending: <Clock className="h-4 w-4" />,
        processing: <Loader2 className="h-4 w-4 animate-spin" />,
        completed: <CheckCircle2 className="h-4 w-4" />,
        failed: <XCircle className="h-4 w-4" />,
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status] || styles.pending}`}>
            {icons[status]}
            {status}
        </span>
    );
};

const JobList = ({ jobs }) => {
    if (!jobs.length) {
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No transcription jobs found.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {jobs.map((job) => (
                            <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{job.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <FileText className="h-5 w-5 text-gray-400 mr-2" />
                                        <span className="text-sm font-medium text-gray-900 truncate max-w-xs">{job.filename}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={job.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link to={`/jobs/${job.id}`} className="text-indigo-600 hover:text-indigo-900">
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default JobList;
