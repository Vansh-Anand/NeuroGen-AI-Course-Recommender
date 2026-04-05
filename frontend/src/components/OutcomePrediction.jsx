import { motion } from 'framer-motion'
import { Target, TrendingUp, BookOpen } from 'lucide-react'

const badgeStyles = {
    Distinction: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    Pass: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20',
    Withdrawn: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20',
    Fail: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20',
}

const dotStyles = {
    Distinction: 'bg-emerald-500',
    Pass: 'bg-blue-500',
    Withdrawn: 'bg-amber-500',
    Fail: 'bg-red-500',
}

export default function OutcomePrediction({ prediction, moduleCode = 'CCC', moduleName = 'Data Structures' }) {
    if (!prediction) return null
    const { label, confidence } = prediction

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card rounded-2xl shadow-card p-6"
        >
            <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-accent" />
                <h3 className="text-sm font-bold text-surface-900 dark:text-white uppercase tracking-wider">
                    Academic Outcome Prediction
                </h3>
            </div>

            {/* Module context banner */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/5 dark:bg-accent/10 border border-accent/10 mb-4">
                <BookOpen className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                <p className="text-xs text-surface-600 dark:text-surface-300">
                    <span className="font-bold text-accent">{moduleCode}</span>
                    <span className="mx-1.5 text-surface-300 dark:text-surface-600">·</span>
                    <span className="font-medium">{moduleName}</span>
                    <span className="mx-1.5 text-surface-300 dark:text-surface-600">·</span>
                    <span className="text-surface-400">Currently Enrolled</span>
                </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
                {/* Main Badge */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                    className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl border text-lg font-bold ${badgeStyles[label]}`}
                >
                    <span className={`w-2.5 h-2.5 rounded-full ${dotStyles[label]} animate-pulse`} />
                    {label}
                </motion.div>

                {/* Confidence */}
                <div className="space-y-2 w-full max-w-xs">
                    <div className="flex items-center justify-between text-xs text-surface-500 dark:text-surface-400">
                        <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Confidence
                        </span>
                        <span className="font-bold text-surface-900 dark:text-white text-sm">{confidence}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${confidence}%` }}
                            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                            className="h-full rounded-full bg-gradient-to-r from-accent to-purple-500"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
