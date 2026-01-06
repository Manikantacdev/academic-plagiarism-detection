import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api, { type PlagiarismResult, type PlagiarismMatch } from '../services/api';
import { useUser } from './UserContext';

export interface AnalysisData {
    id: string;
    filename: string;
    text: string;
    result: PlagiarismResult | null;
    matches: PlagiarismMatch[];
    timestamp: Date;
    status: 'pending' | 'analyzing' | 'completed' | 'error';
    error?: string;
}

interface AnalysisContextType {
    currentAnalysis: AnalysisData | null;
    analysisHistory: AnalysisData[];
    setCurrentAnalysis: (analysis: AnalysisData | null) => void;
    addToHistory: (analysis: AnalysisData) => void;
    refreshHistory: () => Promise<void>;
    clearHistory: () => void;
    getAnalysisById: (id: string) => AnalysisData | undefined;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisData | null>(null);
    const [analysisHistory, setAnalysisHistory] = useState<AnalysisData[]>([]);
    const userInfo = useUser();

    // Fetch history from backend whenever user changes
    const fetchHistory = React.useCallback(async () => {
        if (!userInfo?.email) {
            setAnalysisHistory([]);
            return;
        }

        try {
            const response = await api.fetchHistory(userInfo.email);
            if (response.success) {
                // Convert back to Date objects
                const history = response.history.map(item => ({
                    ...item,
                    timestamp: new Date(item.timestamp)
                }));
                setAnalysisHistory(history);
            }
        } catch (error) {
            console.error('Failed to fetch history:', error);
        }
    }, [userInfo?.email]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const addToHistory = (analysis: AnalysisData) => {
        setAnalysisHistory(prev => [analysis, ...prev]);
    };

    const clearHistory = () => {
        setAnalysisHistory([]);
    };

    const getAnalysisById = (id: string) => {
        if (currentAnalysis?.id === id) return currentAnalysis;
        return analysisHistory.find(a => a.id === id);
    };

    return (
        <AnalysisContext.Provider
            value={{
                currentAnalysis,
                analysisHistory,
                setCurrentAnalysis,
                addToHistory,
                refreshHistory: fetchHistory,
                clearHistory,
                getAnalysisById,
            }}
        >
            {children}
        </AnalysisContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAnalysis = () => {
    const context = useContext(AnalysisContext);
    if (context === undefined) {
        throw new Error('useAnalysis must be used within an AnalysisProvider');
    }
    return context;
};
