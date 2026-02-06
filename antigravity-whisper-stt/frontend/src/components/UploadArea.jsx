import React, { useState, useRef } from 'react';
import { UploadCloud, FileAudio, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { uploadAudio } from '../api';
import { useNavigate } from 'react-router-dom';

const UploadArea = () => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [language, setLanguage] = useState('auto');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (file) => {
        const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/x-m4a', 'video/mp4', 'audio/ogg', 'audio/flac', 'audio/webm'];
        // Simple check, backend does robust check
        setFile(file);
        setError(null);
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setError(null);
        try {
            await uploadAudio(file, language);
            navigate('/history'); // Redirect to history after upload
        } catch (err) {
            console.error(err);
            setError("Failed to upload file. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Upload Audio</h2>
                <p className="text-gray-500 mt-2">Support for MP3, WAV, MP4, M4A, OGG, FLAC, WEBM</p>
            </div>

            <div
                className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 ease-in-out ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    onChange={handleChange}
                    accept=".mp3,.wav,.mp4,.m4a,.ogg,.flac,.webm"
                />

                {!file ? (
                    <div className="flex flex-col items-center cursor-pointer" onClick={() => inputRef.current.click()}>
                        <UploadCloud className="h-16 w-16 text-indigo-400 mb-4" />
                        <p className="text-lg font-medium text-gray-700">Drag & Drop your file here</p>
                        <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <FileAudio className="h-16 w-16 text-emerald-500 mb-4" />
                        <p className="text-lg font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        <button
                            onClick={() => setFile(null)}
                            className="mt-4 text-sm text-red-500 hover:text-red-700 font-medium"
                        >
                            Remove file
                        </button>
                    </div>
                )}
            </div>

            {/* Language Selection */}
            <div className="mt-6">
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                    Spoken Language (Optional)
                </label>
                <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <option value="auto">Auto-Detect</option>
                    <option value="en">English</option>
                    <option value="hi">Hindi (Devanagari)</option>
                    <option value="ur">Urdu</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                    Force a specific language if auto-detect gets it wrong (e.g., Hindi vs Urdu).
                </p>
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    {error}
                </div>
            )}

            <div className="mt-8 flex justify-center">
                <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className={`px-8 py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 ${!file || uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-200'}`}
                >
                    {uploading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            Start Transcription
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default UploadArea;
