import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJob, getDownloadUrl, deleteJob } from '../api';
import { Download, FileText, ArrowLeft, Trash2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [segments, setSegments] = useState([]);

    useEffect(() => {
        fetchJob();
    }, [id]);

    useEffect(() => {
        if (job?.status === 'completed') {
            fetch(getDownloadUrl(job.id, 'segments'))
                .then(res => {
                    if (res.ok) return res.json();
                    throw new Error('No segments');
                })
                .then(data => setSegments(data))
                .catch(err => console.log('Segments not available', err));
        }
    }, [job]);

    const fetchJob = async () => {
        try {
            setLoading(true);
            const res = await getJob(id);
            setJob(res.data);
        } catch (err) {
            setError("Failed to load job details.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
    if (error) return <div className="text-center py-12 text-red-600">{error}</div>;
    if (!job) return null;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <Link to="/history" className="flex items-center text-gray-500 hover:text-gray-700">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to History
                </Link>
                <div className="flex gap-2">
                    {/* Add delete button potentially */}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.filename}</h1>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${job.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {job.status}
                            </span>
                        </div>
                    </div>

                    {job.status === 'completed' && (
                        <div className="flex gap-2">
                            <a
                                href={getDownloadUrl(job.id, 'txt')}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                <FileText className="h-4 w-4" />
                                TXT
                            </a>
                            <a
                                href={getDownloadUrl(job.id, 'json')}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                <Download className="h-4 w-4" />
                                JSON
                            </a>
                        </div>
                    )}
                </div>

                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Transcript</h3>
                    {job.status === 'completed' ? (
                        <>
                            <div className="bg-gray-50 rounded-lg p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap text-gray-800 border border-gray-200 mb-8">
                                {job.transcript_text}
                            </div>

                            {segments.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Segments</h3>
                                    <div className="overflow-hidden border border-gray-200 rounded-lg">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Time</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Text</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {segments.map((seg, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">
                                                            {new Date(seg.start * 1000).toISOString().substr(11, 8)} - {new Date(seg.end * 1000).toISOString().substr(11, 8)}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">
                                                            {seg.text}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <p className="text-gray-500">
                                {job.status === 'processing' ? 'Transcription in progress...' : 'Transcription pending...'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
