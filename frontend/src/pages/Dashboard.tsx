import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, FileText, AlertCircle, Check, X, Type, RefreshCw, Shield } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { api, type PlagiarismCheckResponse } from '../services/api';
import { useAnalysis, type AnalysisData } from '../context/AnalysisContext';
import { useUser } from '../context/UserContext';

export const Dashboard: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
    const [dbStats, setDbStats] = useState<{ total_documents: number, index_size: number } | null>(null);
    const { analysisHistory } = useAnalysis();
    const userInfo = useUser();

    const stats = useMemo(() => {
        const totalSubmissions = analysisHistory.length;
        const avgOriginality = analysisHistory.length > 0
            ? Math.round(analysisHistory.reduce((sum, a) => sum + (a.result ? (100 - a.result.overall_score) : 0), 0) / analysisHistory.length)
            : 0;
        const flagsReview = analysisHistory.filter(a => a.result && (100 - a.result.overall_score) < 70).length;
        return { totalSubmissions, avgOriginality, flagsReview };
    }, [analysisHistory]);

    const checkBackendHealth = useCallback(async () => {
        try {
            await api.checkHealth();
            setBackendStatus('online');
        } catch {
            setBackendStatus('offline');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchStats = useCallback(async () => {
        try {
            const response = await api.getStats(userInfo?.email);
            if (response.success) {
                setDbStats(response.stats);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    }, [userInfo?.email]);

    useEffect(() => {
        checkBackendHealth();
        fetchStats();
    }, [checkBackendHealth, fetchStats]);

    return (
        <div className="space-y-8 relative">
            {/* Backend Status Banner - Only show when offline */}
            {backendStatus === 'offline' && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="text-red-500" size={20} />
                        <div>
                            <p className="text-red-500 font-medium">Backend Offline</p>
                            <p className="text-red-400/70 text-sm">Cannot connect to the analysis server at http://localhost:8000</p>
                        </div>
                    </div>
                    <button onClick={checkBackendHealth} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2">
                        <RefreshCw size={16} />
                        Retry
                    </button>
                </div>
            )}

            {/* Header */}
            <div>
                <h1 className="text-3xl font-serif font-bold text-white">Dashboard</h1>
                <p className="text-muted-foreground mt-2">Welcome back, Professor. Here's your academic integrity overview.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Total Submissions"
                    value={isLoading ? "..." : String(analysisHistory.length || 0)}
                    change="+12% this week"
                    icon={<FileText className="text-landing-blue" />}
                />
                <StatCard
                    label="Average Originality"
                    value={isLoading ? "..." : `${stats.avgOriginality}%`}
                    change="+2.4% vs last semester"
                    icon={<Check className="text-highlight-green" />}
                />
                <StatCard
                    label="Flags Review"
                    value={isLoading ? "..." : String(stats.flagsReview)}
                    change="Pending Action"
                    icon={<AlertCircle className="text-highlight-orange" />}
                />
                <StatCard
                    label="Shared Knowledge Base"
                    value={dbStats ? String(dbStats.total_documents) : "..."}
                    change="Global Database"
                    icon={<Shield className="text-landing-purple" />}
                />
            </div>

            {/* Main Action Area */}
            <div
                className={`bg-card rounded-xl border border-border p-8 shadow-soft text-center group cursor-pointer hover:border-landing-blue/50 transition-colors ${backendStatus === 'offline' ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={() => backendStatus === 'online' && setIsModalOpen(true)}
            >
                <div className="w-16 h-16 rounded-2xl bg-landing-blue/10 text-landing-blue flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Upload size={32} />
                </div>
                <h3 className="text-lg font-semibold text-white">New Submission Analysis</h3>
                <p className="text-muted-foreground max-w-sm mx-auto mt-2 mb-6">
                    Upload student papers (PDF, DOCX) or paste text to begin a comprehensive plagiarism and AI detection scan.
                </p>
                <button
                    className="px-6 py-2.5 bg-gradient-to-r from-landing-blue to-landing-purple text-white font-medium rounded-lg hover:shadow-lg hover:shadow-landing-blue/30 transition-all disabled:opacity-50"
                    disabled={backendStatus === 'offline'}
                >
                    Start New Scan
                </button>
            </div>

            {/* Recent Activity */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-serif font-semibold text-white">Recent Reports</h2>
                    <button className="text-sm text-landing-blue hover:underline">View All</button>
                </div>

                <div className="bg-card rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium">
                            <tr>
                                <th className="px-6 py-4">Student / Document</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Originality Score</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {analysisHistory.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                        No submissions yet. Start a new scan to analyze documents.
                                    </td>
                                </tr>
                            ) : (
                                analysisHistory.slice(0, 5).map((analysis) => {
                                    const originalityScore = analysis.result ? Math.round(100 - analysis.result.overall_score) : 0;
                                    return (
                                        <tr key={analysis.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4 font-medium">{analysis.filename}</td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {new Date(analysis.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-highlight-green/20 text-highlight-green border border-highlight-green/30">
                                                    {analysis.status === 'completed' ? 'Completed' : 'Processing'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                                                        <div className={`h-full ${originalityScore >= 80 ? 'bg-highlight-green' : originalityScore >= 60 ? 'bg-highlight-orange' : 'bg-red-500'}`} style={{ width: `${originalityScore}%` }}></div>
                                                    </div>
                                                    <span className="font-semibold text-foreground">{originalityScore}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link to={`/report/${analysis.id}`} className="text-muted-foreground hover:text-landing-blue transition-colors">View Report</Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Upload/Input Modal */}
            <AnimatePresence>
                {isModalOpen && <SubmissionModal onClose={() => setIsModalOpen(false)} />}
            </AnimatePresence>
        </div>
    );
};

const StatCard: React.FC<{ label: string; value: string; change: string; icon: React.ReactNode }> = ({ label, value, change, icon }) => (
    <div className="bg-card p-6 rounded-xl border border-border shadow-soft flex items-start justify-between">
        <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold font-serif text-white">{value}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{change}</p>
        </div>
        <div className="p-3 rounded-lg bg-muted border border-border">
            {icon}
        </div>
    </div>
);

const SubmissionModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [pastedText, setPastedText] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { setCurrentAnalysis, addToHistory } = useAnalysis();
    const userInfo = useUser();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleAnalyze = async () => {
        setError(null);
        setIsAnalyzing(true);
        setProgress(0);

        try {
            let textToAnalyze = '';
            let filename = 'pasted_text.txt';

            // Step 1: Get the text
            setProgress(10);
            if (activeTab === 'upload' && file) {
                const uploadResponse = await api.uploadFile(file);
                if (!uploadResponse.success) {
                    throw new Error('Failed to upload file');
                }
                textToAnalyze = uploadResponse.text;
                filename = uploadResponse.filename;
                setProgress(30);
            } else if (activeTab === 'text' && pastedText.trim()) {
                const textResponse = await api.submitText(pastedText);
                if (!textResponse.success) {
                    throw new Error('Failed to submit text');
                }
                textToAnalyze = textResponse.text;
                setProgress(30);
            } else {
                throw new Error('Please provide a file or text to analyze');
            }

            // Step 2: Run plagiarism check
            setProgress(50);
            const checkResponse: PlagiarismCheckResponse = await api.checkPlagiarism(textToAnalyze, filename, userInfo?.email);
            setProgress(80);

            if (!checkResponse.success) {
                throw new Error(checkResponse.error || 'Plagiarism check failed');
            }

            // Step 3: Create analysis data
            const analysisId = `analysis_${Date.now()}`;
            const analysisData: AnalysisData = {
                id: analysisId,
                filename,
                text: textToAnalyze,
                result: checkResponse.result,
                matches: checkResponse.result?.matches || [],
                timestamp: new Date(),
                status: 'completed',
            };

            setProgress(100);
            setCurrentAnalysis(analysisData);
            addToHistory(analysisData);

            // Navigate to report
            setTimeout(() => {
                navigate(`/report/${analysisId}`);
            }, 500);

        } catch (err) {
            console.error('Analysis error:', err);
            setError(err instanceof Error ? err.message : 'An error occurred during analysis');
            setIsAnalyzing(false);
        }
    };

    const canAnalyze = (activeTab === 'upload' && file) || (activeTab === 'text' && pastedText.trim().length >= 10);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card w-full max-w-lg rounded-xl shadow-2xl border border-border overflow-hidden"
            >
                {isAnalyzing ? (
                    <div className="p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full border-4 border-landing-blue/20 border-t-landing-blue animate-spin mb-6" />
                        <h3 className="text-xl font-serif font-bold text-white">Analyzing Document</h3>
                        <p className="text-muted-foreground mt-2">
                            {progress < 30 ? 'Uploading and processing document...' :
                                progress < 50 ? 'Extracting text content...' :
                                    progress < 80 ? 'Running plagiarism detection...' :
                                        'Finalizing results...'}
                        </p>
                        <div className="w-64 h-2 bg-muted rounded-full mt-6 overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-landing-blue to-landing-purple"
                                initial={{ width: "0%" }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{progress}% complete</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h3 className="text-lg font-serif font-semibold text-white">New Scan</h3>
                            <button onClick={onClose} className="text-muted-foreground hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            {error && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-4 mb-6">
                                <button
                                    onClick={() => setActiveTab('upload')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border text-sm font-medium transition-colors
                                        ${activeTab === 'upload' ? 'bg-landing-blue/10 border-landing-blue text-landing-blue' : 'bg-transparent border-border text-muted-foreground hover:bg-muted'}
                                    `}
                                >
                                    <Upload size={18} />
                                    Upload File
                                </button>
                                <button
                                    onClick={() => setActiveTab('text')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border text-sm font-medium transition-colors
                                        ${activeTab === 'text' ? 'bg-landing-blue/10 border-landing-blue text-landing-blue' : 'bg-transparent border-border text-muted-foreground hover:bg-muted'}
                                    `}
                                >
                                    <Type size={18} />
                                    Paste Text
                                </button>
                            </div>

                            {activeTab === 'upload' ? (
                                <div
                                    className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-landing-blue/50 hover:bg-muted/30 transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                                        onChange={handleFileChange}
                                    />
                                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                                        <FileText size={24} />
                                    </div>
                                    {file ? (
                                        <div>
                                            <p className="text-white font-medium">{file.name}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024).toFixed(1)} KB - Ready to scan</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-white font-medium">Click to upload or drag and drop</p>
                                            <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX, TXT up to 10MB</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <textarea
                                        value={pastedText}
                                        onChange={(e) => setPastedText(e.target.value)}
                                        className="w-full h-48 p-4 rounded-xl border border-border bg-muted/50 text-white focus:ring-2 focus:ring-landing-blue/20 focus:border-landing-blue outline-none resize-none font-mono text-sm placeholder-muted-foreground"
                                        placeholder="Paste the academic text here (minimum 10 characters)..."
                                    />
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {pastedText.length} characters • {pastedText.split(/\s+/).filter(w => w).length} words
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-border bg-muted/20 flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-white hover:bg-muted rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAnalyze}
                                disabled={!canAnalyze}
                                className="px-6 py-2 bg-gradient-to-r from-landing-blue to-landing-purple text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-landing-blue/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                Start Analysis
                            </button>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
};
