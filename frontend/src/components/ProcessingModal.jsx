import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

const LAYERS = [
    { label: 'Input', neurons: 6, color: '#6366f1' },
    { label: 'Hidden 1', neurons: 8, color: '#818cf8' },
    { label: 'Hidden 2', neurons: 6, color: '#a78bfa' },
    { label: 'Output', neurons: 4, color: '#22c55e' },
]
const OUTPUT_LABELS = ['Dist', 'Pass', 'Fail', 'With']

function NeuralNetAnim({ progress }) {
    const canvasRef = useRef(null)
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        const W = canvas.width, H = canvas.height
        ctx.clearRect(0, 0, W, H)
        const pad = 40, layerGap = (W - pad * 2) / (LAYERS.length - 1)
        const positions = LAYERS.map((l, li) => {
            const x = pad + li * layerGap
            const gap = Math.min(22, (H - 40) / l.neurons)
            const startY = H / 2 - ((l.neurons - 1) * gap) / 2
            return Array.from({ length: l.neurons }, (_, ni) => ({ x, y: startY + ni * gap }))
        })
        // Draw connections
        const activeLayer = Math.min(Math.floor(progress / 25), LAYERS.length - 1)
        for (let li = 0; li < positions.length - 1; li++) {
            for (const from of positions[li]) {
                for (const to of positions[li + 1]) {
                    ctx.beginPath()
                    ctx.moveTo(from.x, from.y)
                    ctx.lineTo(to.x, to.y)
                    const active = li <= activeLayer
                    ctx.strokeStyle = active ? `${LAYERS[li].color}40` : '#e2e8f020'
                    ctx.lineWidth = active ? 1.2 : 0.5
                    ctx.stroke()
                }
            }
        }
        // Draw neurons
        positions.forEach((layer, li) => {
            layer.forEach((pos, ni) => {
                const active = li <= activeLayer
                ctx.beginPath()
                ctx.arc(pos.x, pos.y, active ? 6 : 4, 0, Math.PI * 2)
                ctx.fillStyle = active ? LAYERS[li].color : '#334155'
                ctx.fill()
                if (active) {
                    ctx.beginPath()
                    ctx.arc(pos.x, pos.y, 9, 0, Math.PI * 2)
                    ctx.strokeStyle = `${LAYERS[li].color}30`
                    ctx.lineWidth = 2
                    ctx.stroke()
                }
                if (li === LAYERS.length - 1) {
                    ctx.fillStyle = '#94a3b8'
                    ctx.font = '9px Inter, sans-serif'
                    ctx.fillText(OUTPUT_LABELS[ni] || '', pos.x + 12, pos.y + 3)
                }
            })
        })
    }, [progress])
    return <canvas ref={canvasRef} width={360} height={180} className="w-full max-w-[360px] mx-auto" />
}

export default function ProcessingModal({ isOpen, onComplete }) {
    const [progress, setProgress] = useState(0)
    const [stage, setStage] = useState(0)
    const stages = [
        'Engineering features from course history...',
        'Training ensemble models (LR, RF, GB)...',
        'Running MLP neural network inference...',
        'Computing fuzzy readiness score...',
        'Optimizing with genetic algorithm...',
        'Generating recommendations & explanations...',
    ]

    useEffect(() => {
        if (!isOpen) { setProgress(0); setStage(0); return }
        const interval = setInterval(() => {
            setProgress(prev => { if (prev >= 100) { clearInterval(interval); return 100 } return prev + 1.5 })
        }, 35)
        return () => clearInterval(interval)
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) return
        setStage(Math.min(Math.floor(progress / (100 / stages.length)), stages.length - 1))
        if (progress >= 100) { const t = setTimeout(onComplete, 500); return () => clearTimeout(t) }
    }, [progress, isOpen])

    if (!isOpen) return null
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-surface-900/40 dark:bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative card p-8 max-w-lg w-full mx-4 text-center">
                <h3 className="text-base font-bold text-surface-900 dark:text-white mb-1">
                    Hybrid AI Analysis in Progress
                </h3>
                <p className="text-xs text-surface-400 mb-4">
                    Ensemble ML · Neural Network · Fuzzy Logic · Genetic Algorithm
                </p>
                <NeuralNetAnim progress={progress} />
                <div className="w-full h-2 rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden mt-4 mb-3">
                    <motion.div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-purple-500"
                        initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ ease: 'linear' }} />
                </div>
                <div className="flex items-center justify-between text-xs">
                    <span className="text-surface-400 truncate pr-2">{stages[stage]}</span>
                    <span className="text-primary-500 font-bold flex-shrink-0">{Math.round(progress)}%</span>
                </div>
            </motion.div>
        </motion.div>
    )
}
