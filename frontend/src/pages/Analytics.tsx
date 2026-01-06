import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, FileText, AlertTriangle, CheckCircle, Brain, PieChart } from 'lucide-react';
import { useAnalysis } from '../context/AnalysisContext';

export const Analytics: React.FC = () => {
    const { analysisHistory } = useAnalysis();

    // Calculate analytics data from history
    const analytics = useMemo(() => {
        if (analysisHistory.length === 0) {
            return {
                totalReports: 0,
                avgOriginality: 0,
                avgAIScore: 0,
                highRiskCount: 0,
                mediumRiskCount: 0,
                lowRiskCount: 0,
                exactMatches: 0,
                paraphraseMatches: 0,
                semanticMatches: 0,
                recentReports: [],
                originalityTrend: [],
                aiScoreTrend: [],
            };
        }

        const completedReports = analysisHistory.filter(a => a.result);

        const totalOriginality = completedReports.reduce((sum, a) =>
            sum + (a.result ? (100 - a.result.overall_score) : 0), 0);
        const totalAI = completedReports.reduce((sum, a) =>
            sum + (a.result?.ai_score || 0), 0);

        const highRisk = completedReports.filter(a => a.result && (100 - a.result.overall_score) < 50).length;
        const mediumRisk = completedReports.filter(a => a.result && (100 - a.result.overall_score) >= 50 && (100 - a.result.overall_score) < 80).length;
        const lowRisk = completedReports.filter(a => a.result && (100 - a.result.overall_score) >= 80).length;

        // Count match types
        let exact = 0, paraphrase = 0, semantic = 0;
        completedReports.forEach(a => {
            a.matches.forEach(m => {
                if (m.match_type === 'exact') exact++;
                else if (m.match_type === 'paraphrase') paraphrase++;
                else if (m.match_type === 'semantic') semantic++;
            });
        });

        // Get last 7 reports for trend
        const recentReports = completedReports.slice(0, 7).reverse();
        const originalityTrend = recentReports.map(a => ({
            label: a.filename.substring(0, 8),
            value: a.result ? Math.round(100 - a.result.overall_score) : 0,
        }));
        const aiScoreTrend = recentReports.map(a => ({
            label: a.filename.substring(0, 8),
            value: a.result?.ai_score || 0,
        }));

        return {
            totalReports: analysisHistory.length,
            avgOriginality: completedReports.length > 0 ? Math.round(totalOriginality / completedReports.length) : 0,
            avgAIScore: completedReports.length > 0 ? Math.round(totalAI / completedReports.length) : 0,
            highRiskCount: highRisk,
            mediumRiskCount: mediumRisk,
            lowRiskCount: lowRisk,
            exactMatches: exact,
            paraphraseMatches: paraphrase,
            semanticMatches: semantic,
            recentReports,
            originalityTrend,
            aiScoreTrend,
        };
    }, [analysisHistory]);

    const totalMatches = analytics.exactMatches + analytics.paraphraseMatches + analytics.semanticMatches;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-serif font-bold text-white">Analytics</h1>
                <p className="text-muted-foreground mt-2">Comprehensive overview of your academic integrity analysis.</p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    icon={<FileText className="text-landing-blue" />}
                    label="Total Reports"
                    value={String(analytics.totalReports)}
                    subtitle="Documents analyzed"
                />
                <StatCard
                    icon={<CheckCircle className="text-highlight-green" />}
                    label="Avg. Originality"
                    value={`${analytics.avgOriginality}%`}
                    subtitle="Across all reports"
                />
                <StatCard
                    icon={<Brain className="text-landing-purple" />}
                    label="Avg. AI Content"
                    value={`${analytics.avgAIScore}%`}
                    subtitle="AI detection score"
                />
                <StatCard
                    icon={<AlertTriangle className="text-highlight-orange" />}
                    label="Flags for Review"
                    value={String(analytics.highRiskCount + analytics.mediumRiskCount)}
                    subtitle="Needs attention"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Originality Trend Chart */}
                <div className="bg-card rounded-xl border border-border shadow-soft p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-landing-blue/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-landing-blue" />
                        </div>
                        <div>
                            <h3 className="font-serif font-semibold text-white">Originality Trend</h3>
                            <p className="text-xs text-muted-foreground">Last {analytics.originalityTrend.length} reports</p>
                        </div>
                    </div>

                    {analytics.originalityTrend.length === 0 ? (
                        <div className="h-48 flex items-center justify-center text-muted-foreground">
                            No data available yet
                        </div>
                    ) : (
                        <div className="h-48 flex items-end justify-around gap-2">
                            {analytics.originalityTrend.map((item, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                    <motion.div
                                        className="w-full rounded-t-lg bg-gradient-to-t from-landing-blue to-landing-blue/60"
                                        initial={{ height: 0 }}
                                        animate={{ height: `${Math.max(item.value * 1.5, 8)}px` }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    />
                                    <span className="text-xs text-muted-foreground truncate max-w-full">{item.label}</span>
                                    <span className="text-xs font-medium text-white">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* AI Score Trend Chart */}
                <div className="bg-card rounded-xl border border-border shadow-soft p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-landing-purple/20 flex items-center justify-center">
                            <Brain className="w-5 h-5 text-landing-purple" />
                        </div>
                        <div>
                            <h3 className="font-serif font-semibold text-white">AI Content Trend</h3>
                            <p className="text-xs text-muted-foreground">Last {analytics.aiScoreTrend.length} reports</p>
                        </div>
                    </div>

                    {analytics.aiScoreTrend.length === 0 ? (
                        <div className="h-48 flex items-center justify-center text-muted-foreground">
                            No data available yet
                        </div>
                    ) : (
                        <div className="h-48 flex items-end justify-around gap-2">
                            {analytics.aiScoreTrend.map((item, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                    <motion.div
                                        className="w-full rounded-t-lg bg-gradient-to-t from-landing-purple to-landing-purple/60"
                                        initial={{ height: 0 }}
                                        animate={{ height: `${Math.max(item.value * 1.5, 8)}px` }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    />
                                    <span className="text-xs text-muted-foreground truncate max-w-full">{item.label}</span>
                                    <span className="text-xs font-medium text-white">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Second Row: Risk Distribution + Match Types */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Risk Distribution */}
                <div className="bg-card rounded-xl border border-border shadow-soft p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-highlight-orange/20 flex items-center justify-center">
                            <BarChart2 className="w-5 h-5 text-highlight-orange" />
                        </div>
                        <div>
                            <h3 className="font-serif font-semibold text-white">Risk Distribution</h3>
                            <p className="text-xs text-muted-foreground">Based on originality scores</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <RiskBar
                            label="Low Risk (≥80%)"
                            count={analytics.lowRiskCount}
                            total={analytics.totalReports}
                            color="bg-highlight-green"
                        />
                        <RiskBar
                            label="Medium Risk (50-79%)"
                            count={analytics.mediumRiskCount}
                            total={analytics.totalReports}
                            color="bg-highlight-orange"
                        />
                        <RiskBar
                            label="High Risk (<50%)"
                            count={analytics.highRiskCount}
                            total={analytics.totalReports}
                            color="bg-red-500"
                        />
                    </div>

                    <div className="mt-6 pt-4 border-t border-border flex justify-around text-center">
                        <div>
                            <div className="text-2xl font-bold text-highlight-green">{analytics.lowRiskCount}</div>
                            <div className="text-xs text-muted-foreground">Low Risk</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-highlight-orange">{analytics.mediumRiskCount}</div>
                            <div className="text-xs text-muted-foreground">Medium Risk</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-red-500">{analytics.highRiskCount}</div>
                            <div className="text-xs text-muted-foreground">High Risk</div>
                        </div>
                    </div>
                </div>

                {/* Match Types Breakdown */}
                <div className="bg-card rounded-xl border border-border shadow-soft p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-landing-blue/20 flex items-center justify-center">
                            <PieChart className="w-5 h-5 text-landing-blue" />
                        </div>
                        <div>
                            <h3 className="font-serif font-semibold text-white">Match Types</h3>
                            <p className="text-xs text-muted-foreground">Breakdown of detected similarities</p>
                        </div>
                    </div>

                    {totalMatches === 0 ? (
                        <div className="h-48 flex items-center justify-center text-muted-foreground">
                            No matches detected yet
                        </div>
                    ) : (
                        <>
                            {/* Donut Chart */}
                            <div className="flex items-center justify-center gap-8">
                                <div className="relative w-32 h-32">
                                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                        <circle
                                            className="text-muted stroke-current"
                                            strokeWidth="12"
                                            fill="transparent"
                                            r="40"
                                            cx="50"
                                            cy="50"
                                        />
                                        {/* Exact Matches */}
                                        <motion.circle
                                            className="text-highlight-orange stroke-current"
                                            strokeWidth="12"
                                            fill="transparent"
                                            r="40"
                                            cx="50"
                                            cy="50"
                                            strokeDasharray="251.2"
                                            initial={{ strokeDashoffset: 251.2 }}
                                            animate={{ strokeDashoffset: 251.2 * (1 - analytics.exactMatches / totalMatches) }}
                                            transition={{ duration: 0.8 }}
                                        />
                                        {/* Paraphrase offset */}
                                        <motion.circle
                                            className="text-highlight-green stroke-current"
                                            strokeWidth="12"
                                            fill="transparent"
                                            r="40"
                                            cx="50"
                                            cy="50"
                                            strokeDasharray="251.2"
                                            initial={{ strokeDashoffset: 251.2 }}
                                            animate={{
                                                strokeDashoffset: 251.2 * (1 - (analytics.exactMatches + analytics.paraphraseMatches) / totalMatches)
                                            }}
                                            transition={{ duration: 0.8, delay: 0.2 }}
                                        />
                                        {/* Semantic */}
                                        <motion.circle
                                            className="text-highlight-purple stroke-current"
                                            strokeWidth="12"
                                            fill="transparent"
                                            r="40"
                                            cx="50"
                                            cy="50"
                                            strokeDasharray="251.2"
                                            initial={{ strokeDashoffset: 251.2 }}
                                            animate={{ strokeDashoffset: 0 }}
                                            transition={{ duration: 0.8, delay: 0.4 }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-xl font-bold text-white">{totalMatches}</span>
                                        <span className="text-[10px] text-muted-foreground">Total</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-highlight-orange" />
                                        <span className="text-sm text-muted-foreground">Exact:</span>
                                        <span className="text-sm font-medium text-white">{analytics.exactMatches}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-highlight-green" />
                                        <span className="text-sm text-muted-foreground">Paraphrase:</span>
                                        <span className="text-sm font-medium text-white">{analytics.paraphraseMatches}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-highlight-purple" />
                                        <span className="text-sm text-muted-foreground">Semantic:</span>
                                        <span className="text-sm font-medium text-white">{analytics.semanticMatches}</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* AI vs Human Content Overview */}
            <div className="bg-card rounded-xl border border-border shadow-soft p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-landing-blue/20 to-landing-purple/20 flex items-center justify-center">
                        <Brain className="w-5 h-5 text-landing-purple" />
                    </div>
                    <div>
                        <h3 className="font-serif font-semibold text-white">AI vs Human Content Analysis</h3>
                        <p className="text-xs text-muted-foreground">Average distribution across all analyzed documents</p>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    {/* Large Progress Bar */}
                    <div className="flex-1">
                        <div className="h-8 bg-muted rounded-full overflow-hidden flex">
                            <motion.div
                                className="h-full bg-gradient-to-r from-highlight-green to-highlight-green/80 flex items-center justify-center"
                                initial={{ width: 0 }}
                                animate={{ width: `${100 - analytics.avgAIScore}%` }}
                                transition={{ duration: 0.8 }}
                            >
                                <span className="text-xs font-medium text-white px-2">
                                    {100 - analytics.avgAIScore}% Human
                                </span>
                            </motion.div>
                            <motion.div
                                className="h-full bg-gradient-to-r from-landing-purple/80 to-landing-purple flex items-center justify-center"
                                initial={{ width: 0 }}
                                animate={{ width: `${analytics.avgAIScore}%` }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                {analytics.avgAIScore >= 15 && (
                                    <span className="text-xs font-medium text-white px-2">
                                        {analytics.avgAIScore}% AI
                                    </span>
                                )}
                            </motion.div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                            <span>Human Written Content</span>
                            <span>AI Generated Content</span>
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="flex gap-4">
                        <div className="text-center p-4 bg-highlight-green/10 rounded-lg border border-highlight-green/20">
                            <div className="text-2xl font-bold text-highlight-green">{100 - analytics.avgAIScore}%</div>
                            <div className="text-xs text-muted-foreground">Human</div>
                        </div>
                        <div className="text-center p-4 bg-landing-purple/10 rounded-lg border border-landing-purple/20">
                            <div className="text-2xl font-bold text-landing-purple">{analytics.avgAIScore}%</div>
                            <div className="text-xs text-muted-foreground">AI</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Stat Card Component
const StatCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string;
    subtitle: string;
}> = ({ icon, label, value, subtitle }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card p-6 rounded-xl border border-border shadow-soft"
    >
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <p className="text-3xl font-bold font-serif text-white mt-2">{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted border border-border">
                {icon}
            </div>
        </div>
    </motion.div>
);

// Risk Bar Component
const RiskBar: React.FC<{
    label: string;
    count: number;
    total: number;
    color: string;
}> = ({ label, count, total, color }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;

    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">{label}</span>
                <span className="text-white font-medium">{count} reports</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                    className={`h-full ${color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.6 }}
                />
            </div>
        </div>
    );
};

export default Analytics;
