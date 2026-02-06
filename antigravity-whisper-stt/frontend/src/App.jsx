import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { Dashboard, History } from './pages/Dashboard';
import JobDetails from './pages/JobDetails';
import UploadArea from './components/UploadArea';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/upload" element={<div className="max-w-2xl mx-auto"><UploadArea /></div>} />
                    <Route path="/history" element={<History />} />
                    <Route path="/jobs/:id" element={<JobDetails />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
