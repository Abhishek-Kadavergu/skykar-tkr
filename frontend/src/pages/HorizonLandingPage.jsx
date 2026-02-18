import React from 'react';
import { Link } from 'react-router-dom';
import Component from '../components/ui/horizon-hero-section';

function HorizonLandingPage() {
    return (
        <div className="relative">
            {/* Hero Section with Three.js Animation */}
            <Component />

            {/* Features Section - Appears after scrolling */}
            <div className="relative z-20 bg-transparent text-white">
                <div className="max-w-7xl mx-auto px-6 py-20">
                    <h2 className="text-4xl font-bold text-center mb-16 text-slate-100">
                        Intelligent Product Discovery
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-8 border border-slate-700 hover:border-slate-600 transition-all">
                            <div className="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-100">Smart Matching Algorithm</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Our AI analyzes your preferences—budget, brand, features—to find products that perfectly match your needs.
                            </p>
                        </div>

                        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-8 border border-slate-700 hover:border-slate-600 transition-all">
                            <div className="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-100">Personalized Scoring</h3>
                            <p className="text-slate-400 leading-relaxed">
                                See detailed match scores for every recommendation based on price, features, brand, and ratings.
                            </p>
                        </div>

                        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-8 border border-slate-700 hover:border-slate-600 transition-all">
                            <div className="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-100">Instant Results</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Local recommendation engine delivers results instantly—no waiting, no external APIs.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories Section */}
            <div className="relative z-20 bg-transparent text-white">
                <div className="max-w-7xl mx-auto px-6 py-20">
                    <h2 className="text-4xl font-bold text-center mb-16 text-slate-100">
                        Explore Categories
                    </h2>

                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-8 border border-slate-700 hover:border-slate-600 transition-all text-center">
                            <div className="w-16 h-16 bg-slate-700/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-slate-100">Shoes</h3>
                            <p className="text-slate-400 text-sm">Nike, Adidas, Puma & more</p>
                        </div>

                        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-8 border border-slate-700 hover:border-slate-600 transition-all text-center">
                            <div className="w-16 h-16 bg-slate-700/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-slate-100">Tech</h3>
                            <p className="text-slate-400 text-sm">Headphones, keyboards & gadgets</p>
                        </div>

                        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-8 border border-slate-700 hover:border-slate-600 transition-all text-center">
                            <div className="w-16 h-16 bg-slate-700/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-slate-100">Music</h3>
                            <p className="text-slate-400 text-sm">Instruments & equipment</p>
                        </div>

                        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-8 border border-slate-700 hover:border-slate-600 transition-all text-center">
                            <div className="w-16 h-16 bg-slate-700/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-slate-100">Hobbies</h3>
                            <p className="text-slate-400 text-sm">Drones, cameras & art supplies</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="relative z-20 bg-transparent text-white">
                <div className="max-w-7xl mx-auto px-6 py-20">
                    <h2 className="text-4xl font-bold text-center mb-16 text-slate-100">
                        How It Works
                    </h2>

                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-slate-800/80 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-slate-700">
                                <span className="text-2xl font-bold text-slate-300">1</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-100">Set Your Preferences</h3>
                            <p className="text-slate-400">
                                Choose your category, budget range, preferred brands, and desired features.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-slate-800/80 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-slate-700">
                                <span className="text-2xl font-bold text-slate-300">2</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-100">AI Analyzes & Scores</h3>
                            <p className="text-slate-400">
                                Our algorithm evaluates products based on price match, features, brand, and ratings.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-slate-800/80 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-slate-700">
                                <span className="text-2xl font-bold text-slate-300">3</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-100">Get Top Matches</h3>
                            <p className="text-slate-400">
                                Receive your top 3 personalized recommendations with detailed match scores.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final CTA Section */}
            <div className="relative z-20 bg-transparent text-white">
                <div className="max-w-4xl mx-auto px-6 py-20 text-center">
                    <h2 className="text-4xl font-bold mb-6 text-slate-100">
                        Ready to Find Your Perfect Match?
                    </h2>
                    <p className="text-xl text-slate-400 mb-10">
                        Join AalayaX and discover products tailored to your unique preferences
                    </p>
                    <Link
                        to="/login"
                        className="inline-block px-10 py-5 bg-slate-800 text-white text-lg font-semibold rounded-lg hover:bg-slate-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        Get Started Free
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default HorizonLandingPage;
