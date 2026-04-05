import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, Star, TrendingUp, AlertTriangle, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react'

const outcomeBadge = {
    Distinction: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20' },
    Pass: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/20' },
    Fail: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', border: 'border-red-500/20' },
    Withdrawn: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/20' },
}

const riskColor = {
    'Low Risk': 'text-emerald-500',
    'Medium Risk': 'text-amber-500',
    'High Risk': 'text-red-500',
}

export default function ElectiveRankings({ electives }) {
    const [showOthers, setShowOthers] = useState(false)

    if (!electives || !electives.length) return null

    const top = electives[0]
    const rest = electives.slice(1)
    const topOb = outcomeBadge[top.predicted_outcome] || outcomeBadge.Pass

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-card rounded-2xl shadow-card p-6"
        >
            <div className="flex items-center gap-2 mb-5">
                <Award className="w-5 h-5 text-accent" />
                <h3 className="text-sm font-bold text-surface-900 dark:text-white uppercase tracking-wider">
                    Best Elective for You
                </h3>
            </div>

            {/* ─── Top Recommendation ─── */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                className="relative p-5 rounded-xl bg-gradient-to-br from-accent/5 via-purple-500/5 to-accent/5 dark:from-accent/10 dark:via-purple-500/10 dark:to-accent/10 border border-accent/20"
            >
                {/* Top badge */}
                <div className="absolute -top-3 left-5">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-accent to-purple-500 text-[11px] font-bold text-white uppercase tracking-wider shadow-lg shadow-accent/25">
                        <Sparkles className="w-3 h-3" /> Recommended
                    </span>
                </div>

                <div className="mt-2 flex items-start gap-4">
                    {/* Rank badge */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center shadow-lg shadow-accent/25">
                        <Star className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-lg font-bold text-surface-900 dark:text-white">{top.name}</span>
                            <span className="text-xs font-mono text-accent font-bold bg-accent/10 px-2 py-0.5 rounded-md">{top.code}</span>
                        </div>

                        <div className="flex items-center gap-4 mt-3 flex-wrap">
                            {/* Score */}
                            <div className="flex items-center gap-1.5 text-sm">
                                <TrendingUp className="w-4 h-4 text-accent" />
                                <span className="text-surface-400">Score:</span>
                                <span className="font-bold text-surface-900 dark:text-white text-base">{top.score}</span>
                            </div>

                            {/* Outcome */}
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold uppercase ${topOb.bg} ${topOb.text} ${topOb.border}`}>
                                <CheckCircle2 className="w-3 h-3" />
                                Expected: {top.predicted_outcome}
                            </span>

                            {/* Risk */}
                            <span className={`text-xs font-bold uppercase ${riskColor[top.risk_label]}`}>
                                {top.risk_label} ({top.risk_score}%)
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ─── Show Other Options Toggle ─── */}
            {rest.length > 0 && (
                <div className="mt-4">
                    <button
                        onClick={() => setShowOthers(!showOthers)}
                        className="flex items-center gap-2 text-xs font-semibold text-surface-400 hover:text-accent transition-colors"
                    >
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showOthers ? 'rotate-180' : ''}`} />
                        {showOthers ? 'Hide' : 'Show'} {rest.length} other option{rest.length > 1 ? 's' : ''}
                    </button>

                    <AnimatePresence>
                        {showOthers && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden"
                            >
                                <div className="mt-3 space-y-2">
                                    {rest.map((e, i) => {
                                        const ob = outcomeBadge[e.predicted_outcome] || outcomeBadge.Pass
                                        return (
                                            <div
                                                key={e.code}
                                                className="flex items-center gap-3 p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50 border border-transparent"
                                            >
                                                <span className="flex-shrink-0 w-6 h-6 rounded-md bg-surface-200 dark:bg-surface-700 flex items-center justify-center text-[11px] font-bold text-surface-500 dark:text-surface-400">
                                                    {i + 2}
                                                </span>
                                                <span className="flex-1 text-sm font-medium text-surface-700 dark:text-surface-200 truncate">
                                                    {e.name} <span className="text-accent font-mono text-xs">({e.code})</span>
                                                </span>
                                                <span className="text-xs font-mono font-bold text-surface-500">{e.score}</span>
                                                <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border text-[9px] font-bold uppercase ${ob.bg} ${ob.text} ${ob.border}`}>
                                                    {e.predicted_outcome}
                                                </span>
                                                <span className={`text-[9px] font-bold uppercase ${riskColor[e.risk_label]}`}>
                                                    {e.risk_label}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    )
}
