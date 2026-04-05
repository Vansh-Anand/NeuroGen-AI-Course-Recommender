import { motion } from 'framer-motion'
import { ShieldAlert } from 'lucide-react'

const riskConfig = {
    'Low Risk': { color: '#22c55e', bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', label: 'LOW' },
    'Medium Risk': { color: '#f59e0b', bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', label: 'MEDIUM' },
    'High Risk': { color: '#ef4444', bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', label: 'HIGH' },
}

function CircularGauge({ score, color, size = 140 }) {
    const radius = (size - 16) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (score / 100) * circumference

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                {/* Background ring */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    className="text-surface-100 dark:text-surface-800"
                    strokeWidth="8"
                />
                {/* Progress ring */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
                />
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-2xl font-bold text-surface-900 dark:text-white"
                >
                    {score}
                </motion.span>
                <span className="text-[10px] font-medium text-surface-400 uppercase tracking-wider">Risk %</span>
            </div>
        </div>
    )
}

export default function RiskIndicator({ risk }) {
    if (!risk) return null
    const config = riskConfig[risk.label] || riskConfig['Medium Risk']

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card rounded-2xl shadow-card p-6"
        >
            <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="w-5 h-5 text-accent" />
                <h3 className="text-sm font-bold text-surface-900 dark:text-white uppercase tracking-wider">
                    Academic Risk Indicator
                </h3>
            </div>

            <div className="flex flex-col items-center space-y-4">
                <CircularGauge score={risk.score} color={config.color} />

                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${config.bg}`}>
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: config.color }} />
                    <span className={`text-sm font-bold ${config.text}`}>{config.label} RISK</span>
                </div>

                <div className="w-full grid grid-cols-2 gap-3 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-surface-50 dark:bg-surface-800">
                        <p className="text-surface-400 font-medium">Positive Prob</p>
                        <p className="font-bold text-surface-900 dark:text-white mt-0.5">{(risk.positive_prob * 100).toFixed(1)}%</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface-50 dark:bg-surface-800">
                        <p className="text-surface-400 font-medium">Negative Prob</p>
                        <p className="font-bold text-surface-900 dark:text-white mt-0.5">{(risk.negative_prob * 100).toFixed(1)}%</p>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
