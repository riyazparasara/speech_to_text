import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mic, FileAudio, List, LayoutDashboard } from 'lucide-react';

const Layout = ({ children }) => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-600';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="bg-indigo-800 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <Mic className="h-8 w-8 text-indigo-300" />
                            <span className="font-bold text-xl">Whisper STT</span>
                        </div>
                        <div className="flex space-x-4">
                            <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${isActive('/')}`}>
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                            </Link>
                            <Link to="/upload" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${isActive('/upload')}`}>
                                <FileAudio className="h-4 w-4" />
                                Upload
                            </Link>
                            <Link to="/history" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${isActive('/history')}`}>
                                <List className="h-4 w-4" />
                                History
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {children}
            </main>
            <footer className="bg-gray-800 text-gray-400 py-6">
                <div className="max-w-7xl mx-auto px-4 text-center text-sm">
                    &copy; {new Date().getFullYear()} Antigravity Whisper AI. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Layout;
