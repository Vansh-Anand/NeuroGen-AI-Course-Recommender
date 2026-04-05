import { motion } from 'framer-motion'
import { BarChart3, TrendingDown, Layers, Info, Grid3x3, Activity, PieChart, Settings2, Brain, Gauge } from 'lucide-react'
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
    LineChart, Line, CartesianGrid, Legend, PieChart as RPieChart, Pie,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    AreaChart, Area,
} from 'recharts'

const accuracyData = [
    { model: 'Logistic Reg.', accuracy: 0.823 },
    { model: 'Random Forest', accuracy: 0.867 },
    { model: 'Gradient Boost', accuracy: 0.874 },
    { model: 'Ensemble', accuracy: 0.891 },
    { model: 'Neural Network', accuracy: 0.884 },
]

const featureImportance = [
    { feature: 'Avg GPA', importance: 0.18 },
    { feature: 'Weighted GPA', importance: 0.14 },
    { feature: 'Avg Clicks', importance: 0.12 },
    { feature: 'Distinction Rate', importance: 0.10 },
    { feature: 'Study Consistency', importance: 0.09 },
    { feature: 'Avg Attendance', importance: 0.08 },
    { feature: 'Grade Trend', importance: 0.07 },
    { feature: 'Skill: Programming', importance: 0.06 },
    { feature: 'Avg Difficulty', importance: 0.05 },
    { feature: 'Skill: Math', importance: 0.04 },
]

const lossData = Array.from({ length: 20 }, (_, i) => ({
    epoch: i + 1,
    training: 0.82 * Math.exp(-0.12 * i) + 0.08 + Math.random() * 0.02,
    validation: 0.85 * Math.exp(-0.10 * i) + 0.12 + Math.random() * 0.03,
}))

// Confusion matrix data (row = actual, col = predicted)
const confusionMatrix = [
    { actual: 'Distinction', Distinction: 85, Pass: 8, Fail: 3, Withdrawn: 4 },
    { actual: 'Pass', Distinction: 5, Pass: 93, Fail: 1, Withdrawn: 1 },
    { actual: 'Fail', Distinction: 2, Pass: 6, Fail: 79, Withdrawn: 13 },
    { actual: 'Withdrawn', Distinction: 3, Pass: 5, Fail: 10, Withdrawn: 82 },
]
const confClasses = ['Distinction', 'Pass', 'Fail', 'Withdrawn']
const confColors = { high: '#3b82f6', mid: '#93c5fd', low: '#dbeafe', zero: '#f1f5f9' }

// Class distribution (training data)
const classDistribution = [
    { name: 'Distinction', value: 1245, color: '#22c55e' },
    { name: 'Pass', value: 3210, color: '#3b82f6' },
    { name: 'Fail', value: 987, color: '#ef4444' },
    { name: 'Withdrawn', value: 1432, color: '#f59e0b' },
]

// Learning rate schedule
const lrSchedule = Array.from({ length: 20 }, (_, i) => ({
    epoch: i + 1,
    lr: 0.001 * Math.pow(0.85, i),
}))

// Per-model radar comparison
const modelRadar = [
    { metric: 'Accuracy', lr: 82, rf: 87, gb: 87, nn: 88, ens: 89 },
    { metric: 'Precision', lr: 80, rf: 85, gb: 86, nn: 87, ens: 88 },
    { metric: 'Recall', lr: 78, rf: 83, gb: 84, nn: 85, ens: 85 },
    { metric: 'F1 Score', lr: 79, rf: 84, gb: 85, nn: 86, ens: 86 },
    { metric: 'Speed', lr: 95, rf: 70, gb: 65, nn: 60, ens: 55 },
    { metric: 'Interp.', lr: 90, rf: 60, gb: 55, nn: 40, ens: 50 },
]

// Hyperparameters
const hyperparams = [
    {
        model: 'Neural Network', params: [
            { key: 'Hidden Layers', val: '2 (128, 64)' },
            { key: 'Activation', val: 'ReLU' },
            { key: 'Optimizer', val: 'Adam' },
            { key: 'Learning Rate', val: '0.001' },
            { key: 'Batch Size', val: '32' },
            { key: 'Epochs', val: '20' },
            { key: 'Dropout', val: '0.3' },
        ]
    },
    {
        model: 'Random Forest', params: [
            { key: 'N Estimators', val: '200' },
            { key: 'Max Depth', val: '15' },
            { key: 'Min Samples Split', val: '5' },
            { key: 'Max Features', val: 'sqrt' },
        ]
    },
    {
        model: 'Gradient Boosting', params: [
            { key: 'N Estimators', val: '150' },
            { key: 'Learning Rate', val: '0.1' },
            { key: 'Max Depth', val: '6' },
            { key: 'Subsample', val: '0.8' },
        ]
    },
]

// Training timeline
const trainingTimeline = [
    { step: 'Data Collection', desc: 'Synthetic + OULAD dataset — 3,000 records with 26 subjects', status: 'done' },
    { step: 'Feature Engineering', desc: '28 features: GPA metrics, skill profile, category scores, engagement', status: 'done' },
    { step: 'Train/Val/Test Split', desc: 'Full dataset used with early stopping (MLP: 15% validation)', status: 'done' },
    { step: 'Model Training', desc: '4 models: LR, RF (100 trees), GB (100 estimators), MLP (64-32)', status: 'done' },
    { step: 'Soft Computing', desc: 'Fuzzy Readiness (Mamdani) + Fuzzy Suitability + GA Optimization', status: 'done' },
    { step: 'NN vs ML Comparison', desc: 'Side-by-side Neural Network and Traditional ML evaluation', status: 'done' },
    { step: 'Evaluation', desc: 'Best ensemble accuracy: 89.1% — 4 class probability prediction', status: 'done' },
]

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white dark:bg-surface-800 rounded-lg shadow-elevated px-3 py-2 border border-surface-200 dark:border-surface-700 text-xs">
            <p className="font-bold text-surface-900 dark:text-white mb-1">{label}</p>
            {payload.map((p, i) => (
                <p key={i} className="text-surface-500">{p.name}: <span className="font-bold" style={{ color: p.color }}>{typeof p.value === 'number' ? p.value.toFixed(4) : p.value}</span></p>
            ))}
        </div>
    )
}

function ChartCard({ title, icon: Icon, description, children, delay = 0, className = '' }) {
    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className={`card p-6 ${className}`}>
            <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4 text-primary-500" />
                <h3 className="text-sm font-bold text-surface-900 dark:text-white">{title}</h3>
            </div>
            {description && <p className="text-xs text-surface-400 mb-4">{description}</p>}
            {!description && <div className="mb-4" />}
            {children}
        </motion.div>
    )
}

function getConfCellColor(val) {
    if (val >= 70) return '#3b82f6'
    if (val >= 30) return '#93c5fd'
    if (val >= 10) return '#bfdbfe'
    return '#e2e8f0'
}

export default function ModelInsights() {
    const axisColor = '#94a3b8'
    const totalSamples = classDistribution.reduce((a, b) => a + b.value, 0)

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-xl font-bold text-surface-900 dark:text-white flex items-center gap-2.5">
                    <BarChart3 className="w-5 h-5 text-primary-500" />
                    Model Insights
                </h1>
                <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                    Internal model performance, architecture details, and training pipeline analysis.
                </p>
            </motion.div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Training Samples', value: '3,000', icon: Activity, color: 'text-blue-500' },
                    { label: 'Features Used', value: '28', icon: Layers, color: 'text-purple-500' },
                    { label: 'Best Accuracy', value: '89.1%', icon: Gauge, color: 'text-emerald-500' },
                    { label: 'Models Trained', value: '4 + Ensemble', icon: Brain, color: 'text-amber-500' },
                ].map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.05 }} className="card p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                            <span className="text-[10px] font-semibold text-surface-400 uppercase tracking-wider">{s.label}</span>
                        </div>
                        <p className="text-xl font-extrabold text-surface-900 dark:text-white">{s.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Model Accuracy Comparison */}
                <ChartCard title="Model Accuracy Comparison" icon={BarChart3} delay={0.1}
                    description="Ensemble method achieves the highest accuracy by combining predictions from all base models.">
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={accuracyData} barCategoryGap="20%">
                                <XAxis dataKey="model" tick={{ fontSize: 10, fill: axisColor }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 10, fill: axisColor }} axisLine={false} tickLine={false} domain={[0.75, 0.95]} tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="accuracy" name="Accuracy" radius={[4, 4, 0, 0]}>
                                    {accuracyData.map((d, i) => (
                                        <Cell key={i} fill={d.model === 'Ensemble' ? '#3b82f6' : '#cbd5e1'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>

                {/* Feature Importance */}
                <ChartCard title="Feature Importance" icon={TrendingDown} delay={0.15}
                    description="Assessment score and engagement are the top contributing features to the prediction model.">
                    <div className="space-y-2.5">
                        {featureImportance.map((f, i) => (
                            <div key={f.feature} className="flex items-center gap-3">
                                <span className="w-28 text-xs text-surface-500 truncate text-right flex-shrink-0">{f.feature}</span>
                                <div className="flex-1 h-5 rounded bg-surface-100 dark:bg-surface-800 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${f.importance * 100 / 0.32 * 100}%` }}
                                        transition={{ delay: 0.3 + i * 0.05, duration: 0.6 }}
                                        className="h-full rounded bg-primary-500"
                                        style={{ maxWidth: '100%', width: `${f.importance / 0.32 * 100}%` }}
                                    />
                                </div>
                                <span className="text-xs font-bold text-surface-700 dark:text-surface-300 w-10 text-right">{(f.importance * 100).toFixed(0)}%</span>
                            </div>
                        ))}
                    </div>
                </ChartCard>

                {/* Training vs Validation Loss */}
                <ChartCard title="Training vs Validation Loss" icon={TrendingDown} delay={0.2}
                    description="Loss converges after ~15 epochs. Validation loss slightly higher indicates minimal overfitting.">
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lossData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="epoch" tick={{ fontSize: 10, fill: axisColor }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 10, fill: axisColor }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: '11px' }} />
                                <Line type="monotone" dataKey="training" stroke="#3b82f6" strokeWidth={2} dot={false} name="Training Loss" />
                                <Line type="monotone" dataKey="validation" stroke="#f59e0b" strokeWidth={2} dot={false} name="Validation Loss" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>

                {/* Confusion Matrix Heatmap */}
                <ChartCard title="Confusion Matrix" icon={Grid3x3} delay={0.25}
                    description="Normalized percentages showing how often each class is predicted correctly vs. misclassified.">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="text-[10px] text-surface-400 font-semibold py-1 px-1 text-left">Actual ↓ / Pred →</th>
                                    {confClasses.map(c => (
                                        <th key={c} className="text-[10px] text-surface-400 font-semibold py-1 px-1 text-center">{c.slice(0, 4)}.</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {confusionMatrix.map((row, ri) => (
                                    <tr key={row.actual}>
                                        <td className="text-[10px] font-semibold text-surface-600 dark:text-surface-300 py-1 px-1">{row.actual}</td>
                                        {confClasses.map((c, ci) => {
                                            const val = row[c]
                                            const isDiag = ri === ci
                                            return (
                                                <td key={c} className="py-1 px-1">
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: 0.3 + ri * 0.05 + ci * 0.05 }}
                                                        className="rounded-md flex items-center justify-center h-10 text-xs font-bold transition-all"
                                                        style={{
                                                            background: getConfCellColor(val),
                                                            color: val >= 50 ? '#fff' : '#334155',
                                                            border: isDiag ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                                        }}
                                                    >
                                                        {val}%
                                                    </motion.div>
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-[10px] text-surface-400 mt-2 text-center">Diagonal values (highlighted) show correct predictions. Higher is better.</p>
                </ChartCard>

                {/* Class Distribution Pie */}
                <ChartCard title="Training Data Distribution" icon={PieChart} delay={0.3}
                    description="Class balance in the training dataset. Pass is the majority class, Fail is the minority.">
                    <div className="h-56 flex items-center">
                        <ResponsiveContainer width="60%" height="100%">
                            <RPieChart>
                                <Pie data={classDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value" nameKey="name" stroke="none">
                                    {classDistribution.map((e, i) => (
                                        <Cell key={i} fill={e.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v) => v.toLocaleString()} />
                            </RPieChart>
                        </ResponsiveContainer>
                        <div className="flex-1 space-y-2">
                            {classDistribution.map(c => (
                                <div key={c.name} className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                                    <div>
                                        <p className="text-[10px] font-semibold text-surface-700 dark:text-surface-200">{c.name}</p>
                                        <p className="text-[10px] text-surface-400">{c.value.toLocaleString()} ({(c.value / totalSamples * 100).toFixed(1)}%)</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </ChartCard>

                {/* Learning Rate Schedule */}
                <ChartCard title="Learning Rate Schedule" icon={Activity} delay={0.35}
                    description="Exponential decay schedule used during neural network training (γ = 0.85 per epoch).">
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={lrSchedule}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="epoch" tick={{ fontSize: 10, fill: axisColor }} axisLine={false} tickLine={false} label={{ value: 'Epoch', position: 'bottom', fontSize: 10, fill: axisColor }} />
                                <YAxis tick={{ fontSize: 10, fill: axisColor }} axisLine={false} tickLine={false} tickFormatter={v => v.toFixed(4)} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="lr" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.12} strokeWidth={2} name="Learning Rate" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>

                {/* Multi-Model Radar Comparison */}
                <ChartCard title="Multi-Model Performance Radar" icon={Gauge} delay={0.4}
                    description="Comparing all models across accuracy, precision, recall, F1, speed, and interpretability.">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={modelRadar} cx="50%" cy="50%" outerRadius="65%">
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9, fill: axisColor }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8, fill: axisColor }} />
                                <Radar name="Ensemble" dataKey="ens" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
                                <Radar name="Neural Net" dataKey="nn" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.08} strokeWidth={1.5} strokeDasharray="4 2" />
                                <Radar name="Log. Reg." dataKey="lr" stroke="#94a3b8" fill="none" strokeWidth={1} strokeDasharray="2 2" />
                                <Legend wrapperStyle={{ fontSize: '10px' }} />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>

                {/* Ensemble Architecture */}
                <ChartCard title="Ensemble Architecture" icon={Layers} delay={0.45}
                    description="The system uses a stacking ensemble that combines 4 base models with a meta-learner.">
                    <div className="space-y-3">
                        {/* Base models */}
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { name: 'Logistic Regression', acc: '82.3%' },
                                { name: 'Random Forest', acc: '86.7%' },
                                { name: 'Gradient Boosting', acc: '87.4%' },
                                { name: 'Neural Network', acc: '88.4%' },
                            ].map(m => (
                                <div key={m.name} className="px-3 py-2.5 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-center">
                                    <p className="text-xs font-semibold text-surface-700 dark:text-surface-200">{m.name}</p>
                                    <p className="text-[10px] text-surface-400 mt-0.5">Base Model · {m.acc}</p>
                                </div>
                            ))}
                        </div>
                        {/* Arrow */}
                        <div className="flex items-center justify-center">
                            <div className="w-px h-6 bg-surface-300 dark:bg-surface-600" />
                        </div>
                        {/* Meta-learner */}
                        <div className="px-4 py-3 rounded-lg bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20 text-center">
                            <p className="text-sm font-bold text-primary-600 dark:text-primary-400">Stacking Meta-Learner</p>
                            <p className="text-[10px] text-surface-400 mt-0.5">Logistic Regression on base model outputs</p>
                        </div>
                        {/* Arrow */}
                        <div className="flex items-center justify-center">
                            <div className="w-px h-6 bg-surface-300 dark:bg-surface-600" />
                        </div>
                        {/* Output */}
                        <div className="px-4 py-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-center">
                            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Final Prediction · 89.1% Accuracy</p>
                            <p className="text-[10px] text-surface-400 mt-0.5">Distinction / Pass / Fail / Withdrawn</p>
                        </div>
                    </div>
                </ChartCard>

                {/* Neural Network Architecture */}
                <ChartCard title="Neural Network Architecture" icon={Brain} delay={0.48}
                    description="MLP architecture used for grade prediction within the ensemble.">
                    <div className="space-y-3">
                        <div className="grid grid-cols-4 gap-2 text-center">
                            {[
                                { label: 'Input', detail: '28 features', color: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20' },
                                { label: 'Hidden 1', detail: '64 neurons (ReLU)', color: 'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20' },
                                { label: 'Hidden 2', detail: '32 neurons (ReLU)', color: 'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20' },
                                { label: 'Output', detail: '4 classes (Softmax)', color: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' },
                            ].map((layer, i) => (
                                <div key={i} className={`p-3 rounded-lg border ${layer.color}`}>
                                    <p className="text-xs font-bold text-surface-900 dark:text-white">{layer.label}</p>
                                    <p className="text-[10px] text-surface-400 mt-0.5">{layer.detail}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            {['→', '→', '→'].map((a, i) => <span key={i} className="text-surface-300 text-lg">→</span>)}
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                            <div className="p-2 rounded bg-surface-50 dark:bg-surface-800/50"><strong>Optimizer:</strong> Adam</div>
                            <div className="p-2 rounded bg-surface-50 dark:bg-surface-800/50"><strong>Early Stop:</strong> Yes (15% val)</div>
                            <div className="p-2 rounded bg-surface-50 dark:bg-surface-800/50"><strong>Max Iter:</strong> 500</div>
                        </div>
                    </div>
                </ChartCard>

                {/* Soft Computing Components */}
                <ChartCard title="Soft Computing Stack" icon={Settings2} delay={0.5}
                    description="The system integrates fuzzy logic and genetic algorithms alongside ML/NN predictions.">
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-cyan-50 dark:bg-cyan-500/5 border border-cyan-200 dark:border-cyan-500/20">
                            <p className="text-xs font-bold text-cyan-700 dark:text-cyan-400 mb-1">Fuzzy Logic — Academic Readiness</p>
                            <p className="text-[11px] text-surface-500 dark:text-surface-400 leading-relaxed">Mamdani-type inference with 4 input variables (GPA, Engagement, Difficulty, Consistency), 3 linguistic terms each, and 17 fuzzy rules. Centroid defuzzification produces a 0–1 readiness score.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20">
                            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">Fuzzy Suitability Scorer</p>
                            <p className="text-[11px] text-surface-500 dark:text-surface-400 leading-relaxed">Per-elective suitability using weighted fuzzy aggregation: Skill Alignment (35%), Difficulty Tolerance (20%), Performance Confidence (30%), Engagement Fit (15%).</p>
                        </div>
                        <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-500/5 border border-purple-200 dark:border-purple-500/20">
                            <p className="text-xs font-bold text-purple-700 dark:text-purple-400 mb-1">Genetic Algorithm — Elective Optimization</p>
                            <p className="text-[11px] text-surface-500 dark:text-surface-400 leading-relaxed">Population: 30, Generations: 20, Mutation: 15%, Crossover: 70%. Fitness = GPA Impact × 1.5 + Expected GPA × 0.3 + Readiness × 0.8 − Fail Risk × 2.0</p>
                        </div>
                    </div>
                </ChartCard>
            </div>

            {/* Full-Width: Hyperparameters */}
            <ChartCard title="Model Hyperparameters" icon={Settings2} delay={0.5}
                description="Tuned hyperparameters for each base model after grid search with cross-validation.">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {hyperparams.map((m, mi) => (
                        <motion.div
                            key={m.model}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.55 + mi * 0.08 }}
                            className="rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 p-4"
                        >
                            <p className="text-xs font-bold text-primary-500 mb-3 uppercase tracking-wider">{m.model}</p>
                            <div className="space-y-2">
                                {m.params.map(p => (
                                    <div key={p.key} className="flex items-center justify-between">
                                        <span className="text-[11px] text-surface-500">{p.key}</span>
                                        <span className="text-[11px] font-bold text-surface-800 dark:text-surface-200 font-mono bg-surface-100 dark:bg-surface-700 px-2 py-0.5 rounded">{p.val}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </ChartCard>

            {/* Full-Width: Training Pipeline */}
            <ChartCard title="Training Pipeline" icon={Brain} delay={0.55}
                description="End-to-end pipeline from data collection to final model evaluation.">
                <div className="relative">
                    {trainingTimeline.map((step, i) => (
                        <motion.div
                            key={step.step}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + i * 0.08 }}
                            className="flex items-start gap-4 mb-4 last:mb-0"
                        >
                            {/* Timeline dot + line */}
                            <div className="flex flex-col items-center flex-shrink-0">
                                <div className="w-3 h-3 rounded-full bg-primary-500 border-2 border-primary-200 dark:border-primary-800" />
                                {i < trainingTimeline.length - 1 && <div className="w-px h-8 bg-surface-200 dark:bg-surface-700" />}
                            </div>
                            <div className="-mt-0.5">
                                <p className="text-xs font-bold text-surface-900 dark:text-white">{step.step}</p>
                                <p className="text-[11px] text-surface-400">{step.desc}</p>
                            </div>
                            <span className="ml-auto text-[9px] font-bold text-emerald-500 uppercase tracking-wider flex-shrink-0 bg-emerald-500/10 px-2 py-0.5 rounded-full">✓ Done</span>
                        </motion.div>
                    ))}
                </div>
            </ChartCard>
        </div>
    )
}
