import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { SourceItem } from '../components/SourceItem';
import { useAnalysis } from '../context/AnalysisContext';
import type { PlagiarismMatch } from '../services/api';

export const Report: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getAnalysisById, currentAnalysis } = useAnalysis();
    const [selectedMatch, setSelectedMatch] = useState<number | null>(null);

    const analysis = id ? getAnalysisById(id) : currentAnalysis;

    if (!analysis || !analysis.result) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-theme(spacing.24))]">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl font-serif font-semibold text-white mb-2">Report Not Found</h2>
                    <p className="text-muted-foreground mb-6">The analysis report you're looking for doesn't exist or has expired.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-gradient-to-r from-landing-blue to-landing-purple text-white font-medium rounded-lg"
                    >
                        <ArrowLeft className="inline w-4 h-4 mr-2" />
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const { result, text, filename, matches } = analysis;
    const originalityScore = Math.round(100 - result.overall_score);

    // Group matches by chunk for highlighting
    const matchesByChunk = matches.reduce((acc, match) => {
        if (!acc[match.chunk_id]) acc[match.chunk_id] = [];
        acc[match.chunk_id].push(match);
        return acc;
    }, {} as Record<number, PlagiarismMatch[]>);

    // Get unique sources
    const uniqueSources = matches.reduce((acc, match) => {
        const existingIndex = acc.findIndex(m => m.source_id === match.source_id);
        if (existingIndex === -1) {
            acc.push({ ...match, displayId: acc.length + 1 });
        }
        return acc;
    }, [] as (PlagiarismMatch & { displayId: number })[])

    const getMatchColor = (matchType: string) => {
        switch (matchType) {
            case 'exact': return 'bg-highlight-orange';
            case 'paraphrase': return 'bg-highlight-green';
            case 'semantic': return 'bg-highlight-purple';
            default: return 'bg-muted';
        }
    };

    const selectedMatchData = selectedMatch !== null
        ? uniqueSources.find(m => m.displayId === selectedMatch)
        : null;

    return (
        <div className="flex h-[calc(100vh-theme(spacing.24))] gap-6">
            {/* Center: Document Content Panel */}
            <div className="flex-1 bg-card rounded-xl border border-border shadow-soft flex flex-col overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="text-muted-foreground hover:text-white transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h2 className="font-serif font-semibold text-lg text-white">Document Viewer</h2>
                    </div>
                    <div className="text-xs text-muted-foreground">{filename}</div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 font-serif leading-relaxed text-lg text-white/90 space-y-4">
                    {result.chunks.map((chunk) => {
                        const chunkMatches = matchesByChunk[chunk.chunk_id] || [];
                        const bestMatch = chunkMatches.length > 0
                            ? chunkMatches.reduce((best, m) => m.similarity_score > best.similarity_score ? m : best)
                            : null;

                        if (bestMatch && bestMatch.similarity_score >= 0.5) {
                            const sourceIndex = uniqueSources.findIndex(s => s.source_id === bestMatch.source_id) + 1;
                            return (
                                <p key={chunk.chunk_id}>
                                    <span
                                        className={`${getMatchColor(bestMatch.match_type)}/20 border-b-2 ${getMatchColor(bestMatch.match_type).replace('bg-', 'border-')} relative group cursor-pointer hover:opacity-80 transition-opacity`}
                                        onClick={() => setSelectedMatch(sourceIndex)}
                                    >
                                        {chunk.text}
                                        <span className={`absolute -top-3 -right-3 w-5 h-5 ${getMatchColor(bestMatch.match_type)} text-white text-[10px] flex items-center justify-center rounded-full font-sans font-bold shadow-sm`}>
                                            {sourceIndex}
                                        </span>
                                    </span>
                                </p>
                            );
                        }
                        return <p key={chunk.chunk_id}>{chunk.text}</p>;
                    })}

                    {result.chunks.length === 0 && (
                        <p className="text-muted-foreground">
                            {text.substring(0, 2000)}
                            {text.length > 2000 && '...'}
                        </p>
                    )}
                </div>
            </div>

            {/* Right: Score & Sources Panel */}
            <div className="w-96 flex flex-col gap-4 overflow-y-auto">

                {/* Originality Report Panel */}
                <div className="bg-card rounded-xl border border-border shadow-soft p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-landing-blue/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-landing-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="font-serif font-semibold text-lg text-white">Originality Report</h3>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle className="text-muted stroke-current" strokeWidth="10" fill="transparent" r="40" cx="50" cy="50" />
                                <circle
                                    className="text-landing-blue stroke-current"
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                    fill="transparent"
                                    r="40"
                                    cx="50"
                                    cy="50"
                                    strokeDasharray="251.2"
                                    strokeDashoffset={251.2 * (1 - originalityScore / 100)}
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-2xl font-serif font-bold text-white">{originalityScore}%</span>
                                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Original</span>
                            </div>
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">Matched</span>
                                <span className="text-sm font-bold text-highlight-orange">{matches.length} sections</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">Sources</span>
                                <span className="text-sm font-bold text-white">{uniqueSources.length} found</span>
                            </div>
                            <div className="flex gap-1 pt-2">
                                <div className="flex-1 text-center p-1.5 bg-red-500/10 rounded">
                                    <div className="text-sm font-bold text-red-400">{result.high_risk_count}</div>
                                    <div className="text-[8px] text-muted-foreground">High</div>
                                </div>
                                <div className="flex-1 text-center p-1.5 bg-highlight-orange/10 rounded">
                                    <div className="text-sm font-bold text-highlight-orange">{result.medium_risk_count}</div>
                                    <div className="text-[8px] text-muted-foreground">Med</div>
                                </div>
                                <div className="flex-1 text-center p-1.5 bg-highlight-green/10 rounded">
                                    <div className="text-sm font-bold text-highlight-green">{result.low_risk_count}</div>
                                    <div className="text-[8px] text-muted-foreground">Low</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Detection Report Panel */}
                <div className="bg-card rounded-xl border border-border shadow-soft p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-landing-purple/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-landing-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="font-serif font-semibold text-lg text-white">AI Detection Report</h3>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle className="text-muted stroke-current" strokeWidth="10" fill="transparent" r="40" cx="50" cy="50" />
                                <circle
                                    className="text-landing-purple stroke-current"
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                    fill="transparent"
                                    r="40"
                                    cx="50"
                                    cy="50"
                                    strokeDasharray="251.2"
                                    strokeDashoffset={251.2 * (1 - (result.ai_score || 0) / 100)}
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-2xl font-serif font-bold text-white">{(result.ai_score || 0).toFixed(2)}%</span>
                                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">AI Content</span>
                            </div>
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">Human Written</span>
                                <span className="text-sm font-bold text-highlight-green">{(100 - (result.ai_score || 0)).toFixed(2)}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">AI Generated</span>
                                <span className="text-sm font-bold text-landing-purple">{(result.ai_score || 0).toFixed(2)}%</span>
                            </div>
                            <div className="pt-2">
                                <div className={`text-center p-2 rounded-lg ${(result.ai_score || 0) < 20
                                    ? 'bg-highlight-green/10 text-highlight-green'
                                    : (result.ai_score || 0) < 50
                                        ? 'bg-highlight-orange/10 text-highlight-orange'
                                        : 'bg-red-500/10 text-red-400'
                                    }`}>
                                    <div className="text-xs font-semibold">
                                        {(result.ai_score || 0) < 20
                                            ? '✓ Likely Human Written'
                                            : (result.ai_score || 0) < 50
                                                ? '⚠ Mixed Content'
                                                : '⚠ Likely AI Generated'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sources List */}
                <div className="bg-card rounded-xl border border-border shadow-soft flex-1 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-border bg-muted/30">
                        <h3 className="font-serif font-semibold text-white">Matched Sources</h3>
                    </div>
                    <div className="overflow-y-auto p-2">
                        {uniqueSources.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground text-sm">
                                No significant matches found. Document appears to be original.
                            </div>
                        ) : (
                            uniqueSources.map((source) => (
                                <SourceItem
                                    key={source.displayId}
                                    id={source.displayId}
                                    title={source.source_id}
                                    similarity={`${Math.round(source.similarity_score * 100)}%`}
                                    color={getMatchColor(source.match_type)}
                                    type={source.match_type === 'exact' ? 'Exact Match' : source.match_type === 'paraphrase' ? 'Paraphrase' : 'Semantic'}
                                    active={selectedMatch === source.displayId}
                                    onClick={() => setSelectedMatch(source.displayId)}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Side-by-Side Explanation Modal / Overlay */}
            <AnimatePresence>
                {selectedMatch && selectedMatchData && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-6 right-6 left-72 bg-card border border-border shadow-2xl rounded-xl p-6 z-50 overflow-hidden"
                    >
                        <div className="flex items-start gap-6 h-full">
                            {/* Submitted Text */}
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    <div className={`w-2 h-2 rounded-full ${getMatchColor(selectedMatchData.match_type)}`}></div>
                                    Submitted Text (Chunk #{selectedMatchData.chunk_id})
                                </div>
                                <p className={`font-serif text-lg leading-relaxed ${getMatchColor(selectedMatchData.match_type)}/10 border-l-4 ${getMatchColor(selectedMatchData.match_type).replace('bg-', 'border-')} p-4 rounded-r-lg text-white/90`}>
                                    {result.chunks.find(c => c.chunk_id === selectedMatchData.chunk_id)?.text || 'Text chunk not found'}
                                </p>
                            </div>

                            <div className="flex items-center self-center text-muted-foreground">
                                <ArrowRight size={24} />
                            </div>

                            {/* Source Text */}
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    <BookOpen size={14} />
                                    Source: {selectedMatchData.source_id}
                                </div>
                                <p className="font-serif text-lg leading-relaxed bg-landing-blue/10 border-l-4 border-landing-blue p-4 rounded-r-lg text-white/90">
                                    {selectedMatchData.source_text}
                                </p>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedMatch(null)}
                                className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        {/* Match Info Box */}
                        <div className="mt-6 pt-6 border-t border-border">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-landing-blue/10 flex items-center justify-center text-landing-blue flex-shrink-0">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white mb-1">Match Analysis</h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        <strong>Type:</strong> {selectedMatchData.match_type === 'exact' ? 'Exact Match' : selectedMatchData.match_type === 'paraphrase' ? 'Paraphrase Detected' : 'Semantic Similarity'}<br />
                                        <strong>Similarity Score:</strong> {Math.round(selectedMatchData.similarity_score * 100)}%<br />
                                        This section was flagged because it shows {selectedMatchData.match_type === 'exact' ? 'near-identical wording' : selectedMatchData.match_type === 'paraphrase' ? 'paraphrased content with similar meaning' : 'semantic similarity in concepts'} to the source material.
                                    </p>
                                    <div className="mt-2 text-xs text-muted-foreground/70 italic">
                                        * This analysis is AI-assisted. Final judgment remains with the reviewer.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
