import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { BarChart3 } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const COLORS = {
    Distinction: '#22c55e',
    Pass: '#3b82f6',
    Fail: '#ef4444',
    Withdrawn: '#f59e0b',
}

const GRADIENTS = {
    Distinction: ['#22c55e', '#16a34a'],
    Pass: ['#3b82f6', '#2563eb'],
    Fail: ['#ef4444', '#dc2626'],
    Withdrawn: ['#f59e0b', '#d97706'],
}

function CustomTooltip({ active, payload }) {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    return (
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-elevated px-4 py-3 border border-surface-200 dark:border-surface-700">
            <p className="text-sm font-bold text-surface-900 dark:text-white">{d.name}</p>
            <p className="text-sm text-surface-500 dark:text-surface-400">
                Probability: <span className="font-bold" style={{ color: COLORS[d.name] }}>{(d.value * 100).toFixed(1)}%</span>
            </p>
        </div>
    )
}

export default function ProbabilityChart({ probabilities }) {
    const { darkMode } = useTheme()
    if (!probabilities) return null

    const data = [
        { name: 'Distinction', value: probabilities.distinction },
        { name: 'Pass', value: probabilities.pass },
        { name: 'Fail', value: probabilities.fail },
        { name: 'Withdrawn', value: probabilities.withdrawn },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card rounded-2xl shadow-card p-6"
        >
            <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-accent" />
                <h3 className="text-sm font-bold text-surface-900 dark:text-white uppercase tracking-wider">
                    Probability Distribution
                </h3>
            </div>

            <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barCategoryGap="20%">
                        <defs>
                            {Object.entries(GRADIENTS).map(([key, [c1, c2]]) => (
                                <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={c1} stopOpacity={0.9} />
                                    <stop offset="100%" stopColor={c2} stopOpacity={0.7} />
                                </linearGradient>
                            ))}
                        </defs>
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 11, fill: darkMode ? '#a1a1aa' : '#71717a', fontWeight: 500 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 10, fill: darkMode ? '#71717a' : '#a1a1aa' }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={v => `${(v * 100).toFixed(0)}%`}
                            domain={[0, 'auto']}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={false} />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                            {data.map(entry => (
                                <Cell key={entry.name} fill={`url(#grad-${entry.name})`} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-3">
                {data.map(d => (
                    <div key={d.name} className="flex items-center gap-1.5 text-xs text-surface-500 dark:text-surface-400">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[d.name] }} />
                        <span className="font-medium">{d.name}</span>
                        <span className="font-bold text-surface-700 dark:text-surface-200">{(d.value * 100).toFixed(1)}%</span>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}
