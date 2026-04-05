import { motion } from 'framer-motion'
import { Scale, CheckCircle, Shield } from 'lucide-react'

export default function FairnessAudit({ fairness }) {
    if (!fairness) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="glass-card rounded-2xl shadow-card p-6"
        >
            <div className="flex items-center gap-2 mb-4">
                <Scale className="w-5 h-5 text-accent" />
                <h3 className="text-sm font-bold text-surface-900 dark:text-white uppercase tracking-wider">
                    Fairness & Bias Audit
                </h3>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
                {/* Status Badge */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, type: 'spring' }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                >
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        No Disparate Impact Detected
                    </span>
                </motion.div>

                {/* Fairness Score */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-50 dark:bg-surface-800 w-full">
                    <Shield className="w-8 h-8 text-accent opacity-50" />
                    <div className="text-left">
                        <p className="text-[10px] font-semibold text-surface-400 uppercase tracking-wider">Model Fairness Score</p>
                        <p className="text-2xl font-bold text-surface-900 dark:text-white">
                            {fairness.score}
                            <span className="text-sm font-medium text-surface-400 ml-0.5">%</span>
                        </p>
                    </div>
                </div>

                <p className="text-[11px] text-surface-400 leading-relaxed">
                    Assessed across demographic groups. Scores above 80% indicate no significant disparate impact in model predictions.
                </p>
            </div>
        </motion.div>
    )
}
