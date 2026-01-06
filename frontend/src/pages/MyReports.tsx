import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysis } from '../context/AnalysisContext';

const MyReports: React.FC = () => {
    const { analysisHistory } = useAnalysis();
    const navigate = useNavigate();

    return (
        <div className="max-w-3xl mx-auto py-10">
            <h1 className="text-2xl font-serif font-bold mb-6 text-white">My Reports</h1>
            {analysisHistory.length === 0 ? (
                <div className="text-muted-foreground text-sm">No previous reports found.</div>
            ) : (
                <ul className="space-y-4">
                    {analysisHistory.map((rep) => (
                        <li key={rep.id} className="bg-card border border-border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div>
                                <div className="font-medium text-white truncate max-w-[200px]">{rep.filename}</div>
                                <div className="text-xs text-muted-foreground">{new Date(rep.timestamp).toLocaleString()}</div>
                                {rep.result && (
                                    <div className="mt-1 text-xs text-muted-foreground">
                                        Originality: <span className="font-semibold text-white">{Math.round(100 - rep.result.overall_score)}%</span>
                                    </div>
                                )}
                            </div>
                            <button
                                className="px-4 py-1 bg-landing-blue/80 hover:bg-landing-blue text-white text-xs rounded transition-colors"
                                onClick={() => navigate(`/report/${rep.id}`)}
                            >
                                View Report
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyReports;
