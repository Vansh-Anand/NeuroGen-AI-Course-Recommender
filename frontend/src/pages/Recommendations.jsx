import { motion } from 'framer-motion'
import { useResults } from '../context/ResultsContext'
import { Link } from 'react-router-dom'
import {
    BookOpen, Star, TrendingUp, CheckCircle2, AlertTriangle,
    Shield, BarChart3, ArrowLeft, Sparkles, Award,
} from 'lucide-react'
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
} from 'recharts'

const outcomeColors = {
    Distinction: '#22c55e', Pass: '#3b82f6', Fail: '#ef4444', Withdrawn: '#f59e0b',
}

const riskColors = { 'Low Risk': 'text-emerald-600', 'Medium Risk': 'text-amber-600', 'High Risk': 'text-red-600' }
const riskBg = { 'Low Risk': 'bg-emerald-50 dark:bg-emerald-500/10', 'Medium Risk': 'bg-amber-50 dark:bg-amber-500/10', 'High Risk': 'bg-red-50 dark:bg-red-500/10' }

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white dark:bg-surface-800 rounded-lg shadow-elevated px-3 py-2 border border-surface-200 dark:border-surface-700 text-xs">
            <p className="font-bold text-surface-900 dark:text-white">{label}</p>
            <p className="text-surface-500">{(payload[0].value * 100).toFixed(1)}%</p>
        </div>
    )
}

export default function Recommendations() {
    const { results } = useResults()

    if (!results) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-14 h-14 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6 text-surface-400" />
                </div>
                <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-2">No Analysis Results Yet</h2>
                <p className="text-sm text-surface-500 dark:text-surface-400 mb-6 max-w-sm">
                    Run an analysis from the Dashboard to see your personalized elective recommendation.
                </p>
                <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Go to Dashboard
                </Link>
            </div>
        )
    }

    const top = results.electives?.[0]
    const prediction = results.prediction
    const risk = results.risk
    const probs = results.probabilities

    const chartData = probs ? [
        { name: 'Distinction', value: probs.distinction || 0 },
        { name: 'Pass', value: probs.pass || 0 },
        { name: 'Fail', value: probs.fail || 0 },
        { name: 'Withdrawn', value: probs.withdrawn || 0 },
    ] : []

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-xl font-bold text-surface-900 dark:text-white flex items-center gap-2.5">
                    <BookOpen className="w-5 h-5 text-primary-500" />
                    Recommendations
                </h1>
                <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                    Analysis results and personalized elective recommendation.
                </p>
            </motion.div>

            {/* Overview cards row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Predicted Outcome */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className="w-4 h-4 text-primary-500" />
                        <h3 className="text-xs font-bold text-surface-500 uppercase tracking-wider">Predicted Outcome</h3>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full" style={{ background: outcomeColors[prediction?.label] }} />
                        <span className="text-2xl font-extrabold text-surface-900 dark:text-white">{prediction?.label}</span>
                    </div>
                    <p className="text-xs text-surface-400 mt-1">Confidence: <span className="font-bold text-surface-600 dark:text-surface-300">{prediction?.confidence}%</span></p>
                </motion.div>

                {/* Risk Level */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <Shield className="w-4 h-4 text-primary-500" />
                        <h3 className="text-xs font-bold text-surface-500 uppercase tracking-wider">Risk Level</h3>
                    </div>
                    <span className={`text-2xl font-extrabold ${riskColors[risk?.label]}`}>{risk?.label}</span>
                    <p className="text-xs text-surface-400 mt-1">Risk Score: <span className="font-bold text-surface-600 dark:text-surface-300">{risk?.score}%</span></p>
                </motion.div>

                {/* Recommended Elective preview */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <Award className="w-4 h-4 text-primary-500" />
                        <h3 className="text-xs font-bold text-surface-500 uppercase tracking-wider">Best Elective</h3>
                    </div>
                    {top && (
                        <>
                            <span className="text-2xl font-extrabold text-surface-900 dark:text-white">{top.code}</span>
                            <p className="text-xs text-surface-400 mt-1">{top.name}</p>
                        </>
                    )}
                </motion.div>
            </div>

            {/* Recommended Elective (highlight card) */}
            {top && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className="card p-6 border-primary-200 dark:border-primary-500/20"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                            <Star className="w-6 h-6 text-primary-500" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h2 className="text-lg font-bold text-surface-900 dark:text-white">{top.name}</h2>
                                <span className="text-xs font-mono font-bold text-primary-500 bg-primary-50 dark:bg-primary-500/10 px-2 py-0.5 rounded-md">{top.code}</span>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-500 text-[10px] font-bold text-white uppercase tracking-wider">
                                    <Sparkles className="w-2.5 h-2.5" /> Recommended
                                </span>
                            </div>
                            <div className="flex items-center gap-4 mt-2 flex-wrap text-sm">
                                <span className="flex items-center gap-1 text-surface-500">
                                    <TrendingUp className="w-3.5 h-3.5" /> Score: <span className="font-bold text-surface-900 dark:text-white">{top.score}</span>
                                </span>
                                <span className="flex items-center gap-1 text-surface-500">
                                    {top.predicted_outcome === 'Fail' || top.predicted_outcome === 'Withdrawn'
                                        ? <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                                        : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                                    Expected: <span className="font-bold text-surface-900 dark:text-white">{top.predicted_outcome}</span>
                                </span>
                                <span className={`font-bold text-xs uppercase ${riskColors[top.risk_label]}`}>{top.risk_label}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Why This Elective? */}
            {top && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6">
                    <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary-500" />
                        Why This Elective?
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            { icon: CheckCircle2, color: 'text-emerald-500', title: 'High Predicted Success', desc: `The model predicts "${top.predicted_outcome}" outcome with the highest composite score of ${top.score}.` },
                            { icon: Shield, color: 'text-blue-500', title: 'Low Failure Risk', desc: `Risk level classified as "${top.risk_label}" (${top.risk_score}%), indicating minimal academic risk.` },
                            { icon: TrendingUp, color: 'text-amber-500', title: 'Engagement Compatibility', desc: 'Your engagement metrics and activity pattern align well with students who succeed in this course.' },
                            { icon: Award, color: 'text-purple-500', title: 'Academic Readiness', desc: 'Your prior academic performance and credit load suggest strong readiness for this elective.' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                                <item.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${item.color}`} />
                                <div>
                                    <p className="text-xs font-bold text-surface-900 dark:text-white mb-0.5">{item.title}</p>
                                    <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Probability Breakdown */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card p-6">
                <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary-500" />
                    Probability Breakdown
                </h3>
                <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} barCategoryGap="25%">
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                {chartData.map(d => <Cell key={d.name} fill={outcomeColors[d.name]} opacity={0.85} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                {/* Legend */}
                <div className="flex items-center justify-center gap-4 mt-3 flex-wrap">
                    {chartData.map(d => (
                        <span key={d.name} className="flex items-center gap-1.5 text-xs text-surface-500">
                            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: outcomeColors[d.name] }} />
                            {d.name}: {(d.value * 100).toFixed(1)}%
                        </span>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}
