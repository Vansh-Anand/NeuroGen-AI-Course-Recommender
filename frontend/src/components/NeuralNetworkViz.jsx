import { motion } from 'framer-motion'
import { Cpu, Zap } from 'lucide-react'

const LAYERS = [
    { label: 'Input', neurons: 5, color: '#6366f1' },
    { label: 'Hidden 1', neurons: 8, color: '#818cf8' },
    { label: 'Hidden 2', neurons: 6, color: '#a78bfa' },
    { label: 'Output', neurons: 4, color: '#22c55e' },
]

const OUTPUT_LABELS = ['Distinction', 'Pass', 'Fail', 'Withdrawn']
const OUTPUT_COLORS = ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b']

export default function NeuralNetworkViz({ probabilities, isActive }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="glass-card rounded-2xl shadow-card p-6 overflow-hidden relative"
        >
            {/* Glowing backdrop */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl" />

            <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-lg bg-accent/10">
                        <Cpu className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-surface-900 dark:text-white">
                            Neural Network Architecture
                        </h3>
                        <p className="text-[10px] text-surface-400">Multi-Layer Perceptron · 4-class classifier</p>
                    </div>
                </div>

                {/* Network visualization */}
                <div className="flex items-center justify-between py-6 px-2 select-none">
                    {LAYERS.map((layer, li) => (
                        <div key={layer.label} className="flex flex-col items-center gap-1">
                            {/* Neurons */}
                            <div className="flex flex-col items-center gap-1.5">
                                {Array.from({ length: layer.neurons }, (_, ni) => {
                                    const isOutput = li === LAYERS.length - 1
                                    const prob = isOutput && probabilities
                                        ? [probabilities.distinction, probabilities.pass, probabilities.fail, probabilities.withdrawn][ni]
                                        : null
                                    const neuronColor = isOutput ? OUTPUT_COLORS[ni] : layer.color

                                    return (
                                        <motion.div
                                            key={ni}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.3 + li * 0.1 + ni * 0.03, type: 'spring' }}
                                            className="relative group"
                                        >
                                            <div
                                                className={`w-5 h-5 rounded-full border-2 transition-all duration-500 ${isActive ? 'shadow-lg' : ''
                                                    }`}
                                                style={{
                                                    borderColor: neuronColor,
                                                    background: isActive
                                                        ? `${neuronColor}${isOutput && prob ? Math.round(prob * 255).toString(16).padStart(2, '0') : '40'}`
                                                        : `${neuronColor}15`,
                                                    boxShadow: isActive ? `0 0 8px ${neuronColor}40` : 'none',
                                                }}
                                            />
                                            {/* Output labels */}
                                            {isOutput && (
                                                <div className="absolute left-7 top-1/2 -translate-y-1/2 whitespace-nowrap">
                                                    <span className="text-[9px] font-bold" style={{ color: neuronColor }}>
                                                        {OUTPUT_LABELS[ni]}
                                                    </span>
                                                    {prob !== null && (
                                                        <span className="text-[9px] text-surface-400 ml-1">
                                                            {(prob * 100).toFixed(0)}%
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </motion.div>
                                    )
                                })}
                            </div>
                            {/* Layer label */}
                            <span className="text-[9px] font-semibold text-surface-400 mt-2 uppercase tracking-wider">
                                {layer.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Connection lines (SVG overlay) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ top: 0, left: 0 }}>
                    {/* We draw simplified connection hints with dashed lines */}
                </svg>

                {/* Legend chips */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                    {isActive && probabilities ? (
                        <>
                            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-surface-50 dark:bg-surface-800 text-[10px]">
                                <Zap className="w-2.5 h-2.5 text-accent" />
                                <span className="font-semibold text-surface-600 dark:text-surface-300">Inference Complete</span>
                            </div>
                            <div className="px-2 py-1 rounded-md bg-emerald-500/10 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                {LAYERS.reduce((acc, l) => acc + l.neurons, 0)} neurons · {LAYERS.length} layers
                            </div>
                        </>
                    ) : (
                        <div className="px-2 py-1 rounded-md bg-surface-50 dark:bg-surface-800 text-[10px] font-medium text-surface-400">
                            Awaiting input data for inference
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
