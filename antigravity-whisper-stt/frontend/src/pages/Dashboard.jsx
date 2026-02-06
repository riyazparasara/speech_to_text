import React, { useEffect, useState } from 'react';
import UploadArea from '../components/UploadArea';
import JobList from '../components/JobList';
import { getJobs } from '../api';

export const Dashboard = () => {
    const [recentJobs, setRecentJobs] = useState([]);

    useEffect(() => {
        // Fetch recent jobs
        getJobs().then(res => setRecentJobs(res.data.slice(0, 5)));
    }, []);

    return (
        <div className="space-y-8">
            <section>
                <UploadArea />
            </section>

            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Recent Jobs</h2>
                </div>
                <JobList jobs={recentJobs} />
            </section>
        </div>
    );
};

export const History = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        getJobs().then(res => setJobs(res.data));
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Transcription History</h1>
            <JobList jobs={jobs} />
        </div>
    );
};
