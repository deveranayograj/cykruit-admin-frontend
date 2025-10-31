'use client';

import React from 'react';
import { Shield, ArrowLeft, Search } from 'lucide-react';

const NotFoundPage = () => {

    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0062FF' }}>
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold" style={{ color: '#0062FF' }}>
                                    Cykruit
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
                <div className="text-center">
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-blue-50 mb-6">
                            <Search className="w-16 h-16" style={{ color: '#0062FF' }} />
                        </div>
                    </div>

                    <h1 className="text-9xl font-bold mb-4" style={{ color: '#0062FF' }}>
                        404
                    </h1>

                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Page Not Found
                    </h2>

                    <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                        Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={handleGoBack}
                            className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-2xl border-2 border-gray-300 hover:border-gray-400 transition-all flex items-center space-x-2 shadow-sm hover:shadow-md"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Go Back</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;