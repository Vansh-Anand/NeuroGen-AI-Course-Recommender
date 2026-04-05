import { motion } from 'framer-motion'
import { Lightbulb } from 'lucide-react'

const barColors = [
    'from-accent to-purple-500',
    'from-blue-500 to-cyan-400',
    'from-emerald-500 to-teal-400',
    'from-amber-500 to-orange-400',
    'from-pink-500 to-rose-400',
]

export default function Explainability({ features }) {
    if (!features || !features.length) return null
    const maxVal = Math.max(...features.map(f => f.importance))

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="glass-card rounded-2xl shadow-card p-6"
        >
            <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-accent" />
                <h3 className="text-sm font-bold text-surface-900 dark:text-white uppercase tracking-wider">
                    Explainability — Feature Contributions
                </h3>
            </div>

            <p className="text-xs text-surface-500 dark:text-surface-400 mb-5">
                Top {features.length} most influential features driving this prediction
            </p>

            <div className="space-y-4">
                {features.map((f, i) => {
                    const pct = maxVal > 0 ? (f.importance / maxVal) * 100 : 0
                    return (
                        <div key={f.feature} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-surface-700 dark:text-surface-200">{f.feature}</span>
                                <span className="font-bold text-surface-900 dark:text-white">{(f.importance * 100).toFixed(0)}%</span>
                            </div>
                            <div className="h-2.5 rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ duration: 0.8, delay: 0.6 + i * 0.1, ease: 'easeOut' }}
                                    className={`h-full rounded-full bg-gradient-to-r ${barColors[i % barColors.length]}`}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        </motion.div>
    )
}
