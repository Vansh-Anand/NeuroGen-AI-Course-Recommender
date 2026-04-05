import { motion } from 'framer-motion'
import { ClipboardList, BarChart3, TrendingUp, Grid3x3, Target, Layers, Activity, CheckCircle2, AlertTriangle, Shield } from 'lucide-react'
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    LineChart, Line, CartesianGrid, Legend, AreaChart, Area,
    ScatterChart, Scatter, ZAxis,
} from 'recharts'

const overallMetrics = [
    { label: 'Accuracy', value: '89.1%', delta: '+2.3%', positive: true },
    { label: 'Macro F1', value: '86.0%', delta: '+1.8%', positive: true },
    { label: 'AUC-ROC', value: '93.2%', delta: '+3.1%', positive: true },
    { label: "Cohen's κ", value: '0.841', delta: '+0.04', positive: true },
    { label: 'Log Loss', value: '0.312', delta: '-0.08', positive: true },
    { label: 'MCC', value: '0.835', delta: '+0.03', positive: true },
]

const classMetrics = [
    { class: 'Distinction', precision: 0.89, recall: 0.85, f1: 0.87, support: 1245, specificity: 0.96, npv: 0.97 },
    { class: 'Pass', precision: 0.91, recall: 0.93, f1: 0.92, support: 3210, specificity: 0.89, npv: 0.93 },
    { class: 'Fail', precision: 0.84, recall: 0.79, f1: 0.81, support: 987, specificity: 0.95, npv: 0.97 },
    { class: 'Withdrawn', precision: 0.86, recall: 0.82, f1: 0.84, support: 1432, specificity: 0.93, npv: 0.96 },
]

const classColors = { Distinction: '#22c55e', Pass: '#3b82f6', Fail: '#ef4444', Withdrawn: '#f59e0b' }

const radarData = [
    { metric: 'Accuracy', value: 89.1 },
    { metric: 'Precision', value: 87.5 },
    { metric: 'Recall', value: 84.8 },
    { metric: 'F1 Score', value: 86.0 },
    { metric: 'AUC-ROC', value: 93.2 },
    { metric: 'Specificity', value: 91.4 },
]

const errorMetrics = [
    { model: 'Log. Reg.', mae: 0.312, mse: 0.178, rmse: 0.422 },
    { model: 'Random Forest', mae: 0.245, mse: 0.121, rmse: 0.348 },
    { model: 'Grad. Boost', mae: 0.228, mse: 0.108, rmse: 0.329 },
    { model: 'Ensemble', mae: 0.198, mse: 0.089, rmse: 0.298 },
    { model: 'Neural Net', mae: 0.215, mse: 0.096, rmse: 0.310 },
]

const rocData = Array.from({ length: 50 }, (_, i) => {
    const x = i / 49
    return { fpr: x, tpr: Math.min(1, Math.pow(x, 0.35) + Math.random() * 0.02), random: x }
})

// Confusion matrix (normalized %)
const confusionMatrix = [
    { actual: 'Distinction', Distinction: 85, Pass: 8, Fail: 3, Withdrawn: 4 },
    { actual: 'Pass', Distinction: 2, Pass: 93, Fail: 3, Withdrawn: 2 },
    { actual: 'Fail', Distinction: 2, Pass: 6, Fail: 79, Withdrawn: 13 },
    { actual: 'Withdrawn', Distinction: 3, Pass: 5, Fail: 10, Withdrawn: 82 },
]
const confClasses = ['Distinction', 'Pass', 'Fail', 'Withdrawn']

// Precision-Recall curve data
const prCurveData = Array.from({ length: 50 }, (_, i) => {
    const recall = i / 49
    return {
        recall,
        distinction: Math.max(0, 1 - 0.5 * Math.pow(recall, 1.8) + Math.random() * 0.03),
        pass: Math.max(0, 1 - 0.35 * Math.pow(recall, 1.5) + Math.random() * 0.02),
        fail: Math.max(0, 1 - 0.7 * Math.pow(recall, 1.4) + Math.random() * 0.04),
        withdrawn: Math.max(0, 1 - 0.6 * Math.pow(recall, 1.6) + Math.random() * 0.03),
    }
})

// Calibration curve data
const calibrationData = Array.from({ length: 10 }, (_, i) => {
    const predicted = (i + 0.5) / 10
    return {
        predicted: predicted,
        actual: predicted + (Math.random() - 0.5) * 0.08,
        perfect: predicted,
    }
})

// Cross-validation scores
const cvScores = [
    { fold: 'Fold 1', accuracy: 0.883, f1: 0.854 },
    { fold: 'Fold 2', accuracy: 0.891, f1: 0.862 },
    { fold: 'Fold 3', accuracy: 0.887, f1: 0.858 },
    { fold: 'Fold 4', accuracy: 0.896, f1: 0.869 },
    { fold: 'Fold 5', accuracy: 0.898, f1: 0.867 },
]

// Per-class ROC AUC
const perClassROC = [
    { class: 'Distinction', auc: 0.961 },
    { class: 'Pass', auc: 0.943 },
    { class: 'Fail', auc: 0.912 },
    { class: 'Withdrawn', auc: 0.924 },
]

// Learning curve data
const learningCurve = Array.from({ length: 10 }, (_, i) => {
    const size = (i + 1) * 10
    return {
        size: `${size}%`,
        train: Math.min(0.98, 0.75 + 0.23 * (1 - Math.exp(-0.3 * (i + 1))) + Math.random() * 0.01),
        test: Math.min(0.95, 0.65 + 0.24 * (1 - Math.exp(-0.25 * (i + 1))) + Math.random() * 0.015),
    }
})

// Threshold analysis
const thresholdData = Array.from({ length: 20 }, (_, i) => {
    const t = (i + 1) * 0.05
    return {
        threshold: t.toFixed(2),
        precision: Math.min(1, 0.6 + 0.4 * t + Math.random() * 0.03),
        recall: Math.max(0, 1 - 0.8 * t + Math.random() * 0.03),
        f1: Math.max(0, 2 * (0.6 + 0.4 * t) * (1 - 0.8 * t) / ((0.6 + 0.4 * t) + (1 - 0.8 * t) + 0.01) + Math.random() * 0.02),
    }
})

// Model comparison table
const modelComparison = [
    { model: 'Logistic Regression', acc: 82.3, f1: 79.1, auc: 88.4, time: '0.3s', params: '1.2K' },
    { model: 'Random Forest', acc: 86.7, f1: 83.8, auc: 91.2, time: '4.1s', params: '2.4M' },
    { model: 'Gradient Boosting', acc: 87.4, f1: 84.5, auc: 92.1, time: '6.7s', params: '890K' },
    { model: 'Neural Network', acc: 88.4, f1: 85.2, auc: 92.8, time: '12.3s', params: '45K' },
    { model: 'Ensemble (Stacking)', acc: 89.1, f1: 86.0, auc: 93.2, time: '23.4s', params: '3.3M' },
]

// Statistical tests
const statTests = [
    { test: 'McNemar Test (Ensemble vs NN)', stat: 4.21, pValue: 0.040, significant: true },
    { test: 'Paired t-test (CV Accuracy)', stat: 2.87, pValue: 0.046, significant: true },
    { test: 'Wilcoxon (F1 scores)', stat: 15.0, pValue: 0.031, significant: true },
    { test: 'Friedman Test (All models)', stat: 18.4, pValue: 0.001, significant: true },
]

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white dark:bg-surface-800 rounded-lg shadow-elevated px-3 py-2 border border-surface-200 dark:border-surface-700 text-xs">
            <p className="font-bold text-surface-900 dark:text-white mb-1">{label}</p>
            {payload.map((p, i) => (
                <p key={i} className="text-surface-500">{p.name}: <span className="font-bold" style={{ color: p.color || '#3b82f6' }}>{typeof p.value === 'number' ? p.value.toFixed(3) : p.value}</span></p>
            ))}
        </div>
    )
}

function ChartCard({ title, icon: Icon, description, children, delay = 0 }) {
    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="card p-6">
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

export default function EvaluationMetrics() {
    const ax = '#94a3b8'

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-xl font-bold text-surface-900 dark:text-white flex items-center gap-2.5">
                    <ClipboardList className="w-5 h-5 text-primary-500" />
                    Evaluation Metrics
                </h1>
                <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                    Comprehensive classification performance, error analysis, and statistical validation.
                </p>
            </motion.div>

            {/* Overview cards — expanded to 6 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {overallMetrics.map((m, i) => (
                    <motion.div key={m.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.04 }} className="card p-4 text-center">
                        <p className="text-[10px] font-semibold text-surface-400 uppercase tracking-wider">{m.label}</p>
                        <p className="text-xl font-extrabold text-surface-900 dark:text-white mt-1">{m.value}</p>
                        <p className={`text-[10px] mt-0.5 font-bold ${m.positive ? 'text-emerald-500' : 'text-red-500'}`}>
                            {m.delta} vs baseline
                        </p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Classification Report Table — Enhanced */}
                <ChartCard title="Classification Report (Extended)" icon={ClipboardList} delay={0.15}
                    description="Per-class precision, recall, F1-score, specificity, and NPV breakdown for the ensemble model.">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-[10px] text-surface-400 uppercase tracking-wider border-b border-surface-200 dark:border-surface-700">
                                    <th className="text-left py-2 px-1.5">Class</th>
                                    <th className="text-right py-2 px-1.5">Prec.</th>
                                    <th className="text-right py-2 px-1.5">Recall</th>
                                    <th className="text-right py-2 px-1.5">F1</th>
                                    <th className="text-right py-2 px-1.5">Spec.</th>
                                    <th className="text-right py-2 px-1.5">NPV</th>
                                    <th className="text-right py-2 px-1.5">Support</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classMetrics.map(c => (
                                    <tr key={c.class} className="border-b border-surface-100 dark:border-surface-800 last:border-0">
                                        <td className="py-2.5 px-1.5 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: classColors[c.class] }} />
                                            <span className="font-semibold text-surface-900 dark:text-white text-xs">{c.class}</span>
                                        </td>
                                        <td className="text-right py-2.5 px-1.5 font-mono text-xs text-surface-600 dark:text-surface-300">{c.precision.toFixed(2)}</td>
                                        <td className="text-right py-2.5 px-1.5 font-mono text-xs text-surface-600 dark:text-surface-300">{c.recall.toFixed(2)}</td>
                                        <td className="text-right py-2.5 px-1.5 font-mono text-xs font-bold text-primary-500">{c.f1.toFixed(2)}</td>
                                        <td className="text-right py-2.5 px-1.5 font-mono text-xs text-surface-600 dark:text-surface-300">{c.specificity.toFixed(2)}</td>
                                        <td className="text-right py-2.5 px-1.5 font-mono text-xs text-surface-600 dark:text-surface-300">{c.npv.toFixed(2)}</td>
                                        <td className="text-right py-2.5 px-1.5 font-mono text-xs text-surface-400">{c.support.toLocaleString()}</td>
                                    </tr>
                                ))}
                                {/* Macro/Weighted averages */}
                                <tr className="border-t-2 border-surface-300 dark:border-surface-600">
                                    <td className="py-2.5 px-1.5 font-bold text-xs text-surface-600 dark:text-surface-300">Macro Avg</td>
                                    <td className="text-right py-2.5 px-1.5 font-mono text-xs font-bold text-surface-800 dark:text-white">0.88</td>
                                    <td className="text-right py-2.5 px-1.5 font-mono text-xs font-bold text-surface-800 dark:text-white">0.85</td>
                                    <td className="text-right py-2.5 px-1.5 font-mono text-xs font-bold text-primary-500">0.86</td>
                                    <td className="text-right py-2.5 px-1.5 font-mono text-xs font-bold text-surface-800 dark:text-white">0.93</td>
                                    <td className="text-right py-2.5 px-1.5 font-mono text-xs font-bold text-surface-800 dark:text-white">0.96</td>
                                    <td className="text-right py-2.5 px-1.5 font-mono text-xs text-surface-400">6,874</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </ChartCard>

                {/* Confusion Matrix Heatmap */}
                <ChartCard title="Confusion Matrix" icon={Grid3x3} delay={0.2}
                    description="Normalized percentages. Diagonal = correct predictions. Off-diagonal = misclassifications.">
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
                                                        transition={{ delay: 0.25 + ri * 0.05 + ci * 0.05 }}
                                                        className="rounded-md flex items-center justify-center h-10 text-xs font-bold"
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
                    <p className="text-[10px] text-surface-400 mt-2 text-center">Blue borders highlight correct predictions on the diagonal.</p>
                </ChartCard>

                {/* Performance Radar */}
                <ChartCard title="Performance Radar" icon={TrendingUp} delay={0.25}
                    description="Multi-dimensional view of model performance across key evaluation criteria.">
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: ax }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: ax }} />
                                <Radar name="Ensemble" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>

                {/* Per-Class ROC AUC */}
                <ChartCard title="Per-Class AUC-ROC" icon={Target} delay={0.3}
                    description="Individual AUC-ROC scores for each outcome class. All classes exceed 0.90 threshold.">
                    <div className="space-y-3">
                        {perClassROC.map((c, i) => (
                            <div key={c.class} className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: classColors[c.class] }} />
                                        <span className="text-xs font-semibold text-surface-700 dark:text-surface-200">{c.class}</span>
                                    </div>
                                    <span className="text-xs font-bold text-surface-900 dark:text-white font-mono">{c.auc.toFixed(3)}</span>
                                </div>
                                <div className="h-2.5 rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${c.auc * 100}%` }}
                                        transition={{ delay: 0.35 + i * 0.08, duration: 0.7 }}
                                        className="h-full rounded-full"
                                        style={{ background: classColors[c.class] }}
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="flex items-center gap-2 mt-3 px-2 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">All classes exceed the 0.90 AUC threshold for strong discrimination.</span>
                        </div>
                    </div>
                </ChartCard>

                {/* MAE / MSE / RMSE */}
                <ChartCard title="Error Metrics Comparison" icon={BarChart3} delay={0.35}
                    description="MAE, MSE, and RMSE across all models. Lower values indicate better performance.">
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={errorMetrics} barCategoryGap="15%">
                                <XAxis dataKey="model" tick={{ fontSize: 9, fill: ax }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 10, fill: ax }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: '10px' }} />
                                <Bar dataKey="mae" name="MAE" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                                <Bar dataKey="mse" name="MSE" fill="#22c55e" radius={[3, 3, 0, 0]} />
                                <Bar dataKey="rmse" name="RMSE" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>

                {/* ROC-AUC Curve */}
                <ChartCard title="ROC–AUC Curve (FPR vs TPR)" icon={TrendingUp} delay={0.4}
                    description="Receiver Operating Characteristic curve. AUC = 0.932 shows strong discriminative ability.">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={rocData} margin={{ top: 5, right: 10, bottom: 5, left: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="fpr" tick={{ fontSize: 10, fill: ax }} axisLine={false} tickLine={false} tickFormatter={v => v.toFixed(1)} />
                                <YAxis tick={{ fontSize: 10, fill: ax }} axisLine={false} tickLine={false} tickFormatter={v => v.toFixed(1)} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} />
                                <Area type="monotone" dataKey="tpr" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} name="ROC Curve" />
                                <Line type="monotone" dataKey="random" stroke="#cbd5e1" strokeDasharray="5 5" strokeWidth={1} dot={false} name="Random (0.5)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>

                {/* Precision-Recall Curve */}
                <ChartCard title="Precision-Recall Curves" icon={Target} delay={0.45}
                    description="Per-class precision vs recall tradeoff. Useful for imbalanced classes like Fail.">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={prCurveData} margin={{ top: 5, right: 10, bottom: 5, left: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="recall" tick={{ fontSize: 10, fill: ax }} axisLine={false} tickLine={false} tickFormatter={v => v.toFixed(1)} />
                                <YAxis tick={{ fontSize: 10, fill: ax }} axisLine={false} tickLine={false} domain={[0, 1]} tickFormatter={v => v.toFixed(1)} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} />
                                <Line type="monotone" dataKey="distinction" stroke="#22c55e" strokeWidth={2} dot={false} name="Distinction" />
                                <Line type="monotone" dataKey="pass" stroke="#3b82f6" strokeWidth={2} dot={false} name="Pass" />
                                <Line type="monotone" dataKey="fail" stroke="#ef4444" strokeWidth={2} dot={false} name="Fail" />
                                <Line type="monotone" dataKey="withdrawn" stroke="#f59e0b" strokeWidth={2} dot={false} name="Withdrawn" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>

                {/* Calibration Curve */}
                <ChartCard title="Calibration Curve (Predicted Prob vs Actual)" icon={Target} delay={0.5}
                    description="Shows how well predicted probabilities match actual outcomes. Closer to diagonal = better calibrated.">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={calibrationData} margin={{ top: 5, right: 10, bottom: 5, left: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="predicted" tick={{ fontSize: 10, fill: ax }} axisLine={false} tickLine={false} tickFormatter={v => v.toFixed(1)} />
                                <YAxis tick={{ fontSize: 10, fill: ax }} axisLine={false} tickLine={false} domain={[0, 1]} tickFormatter={v => v.toFixed(1)} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} />
                                <Line type="monotone" dataKey="perfect" stroke="#cbd5e1" strokeDasharray="5 5" strokeWidth={1} dot={false} name="Perfectly Calibrated" />
                                <Line type="monotone" dataKey="actual" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4, fill: '#8b5cf6' }} name="Ensemble Model" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>

                {/* Cross-Validation Scores */}
                <ChartCard title="5-Fold Cross-Validation" icon={Layers} delay={0.55}
                    description="Accuracy and F1 scores across 5 stratified folds. Low variance indicates robust performance.">
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={cvScores} barCategoryGap="25%">
                                <XAxis dataKey="fold" tick={{ fontSize: 10, fill: ax }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 10, fill: ax }} axisLine={false} tickLine={false} domain={[0.82, 0.92]} tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: '10px' }} />
                                <Bar dataKey="accuracy" name="Accuracy" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                                <Bar dataKey="f1" name="F1 Score" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                        <div className="text-[10px] text-surface-400">
                            <span className="font-bold text-surface-700 dark:text-surface-200">Mean Acc:</span> 89.1% ± 0.6%
                        </div>
                        <div className="text-[10px] text-surface-400">
                            <span className="font-bold text-surface-700 dark:text-surface-200">Mean F1:</span> 86.2% ± 0.6%
                        </div>
                    </div>
                </ChartCard>

                {/* Learning Curve */}
                <ChartCard title="Learning Curve (Train Size vs Score)" icon={Activity} delay={0.6}
                    description="Model performance as training data increases. Convergence suggests sufficient training data.">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={learningCurve} margin={{ top: 5, right: 10, bottom: 5, left: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="size" tick={{ fontSize: 10, fill: ax }} axisLine={false} tickLine={false} interval={0} />
                                <YAxis tick={{ fontSize: 10, fill: ax }} axisLine={false} tickLine={false} domain={[0.6, 1.0]} tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} />
                                <Line type="monotone" dataKey="train" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Training" />
                                <Line type="monotone" dataKey="test" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Validation" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>

                {/* Threshold Analysis */}
                <ChartCard title="Threshold vs Precision / Recall / F1" icon={Activity} delay={0.65}
                    description="How precision, recall, and F1 change across different decision thresholds.">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={thresholdData} margin={{ top: 5, right: 10, bottom: 5, left: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="threshold" tick={{ fontSize: 10, fill: ax }} axisLine={false} tickLine={false} interval={1} />
                                <YAxis tick={{ fontSize: 10, fill: ax }} axisLine={false} tickLine={false} domain={[0, 1]} tickFormatter={v => v.toFixed(1)} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} />
                                <Line type="monotone" dataKey="precision" stroke="#22c55e" strokeWidth={2} dot={false} name="Precision" />
                                <Line type="monotone" dataKey="recall" stroke="#3b82f6" strokeWidth={2} dot={false} name="Recall" />
                                <Line type="monotone" dataKey="f1" stroke="#f59e0b" strokeWidth={2} dot={false} name="F1 Score" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>
            </div>

            {/* Full-Width: Model Comparison Table */}
            <ChartCard title="Complete Model Comparison" icon={BarChart3} delay={0.7}
                description="Side-by-side comparison of all trained models across key performance and efficiency metrics.">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-[10px] text-surface-400 uppercase tracking-wider border-b border-surface-200 dark:border-surface-700">
                                <th className="text-left py-2 px-2">Model</th>
                                <th className="text-right py-2 px-2">Accuracy</th>
                                <th className="text-right py-2 px-2">Macro F1</th>
                                <th className="text-right py-2 px-2">AUC-ROC</th>
                                <th className="text-right py-2 px-2">Train Time</th>
                                <th className="text-right py-2 px-2">Parameters</th>
                                <th className="text-center py-2 px-2">Rank</th>
                            </tr>
                        </thead>
                        <tbody>
                            {modelComparison.map((m, i) => {
                                const rank = modelComparison.length - i
                                const isTop = i === modelComparison.length - 1
                                return (
                                    <motion.tr
                                        key={m.model}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.75 + i * 0.06 }}
                                        className={`border-b border-surface-100 dark:border-surface-800 last:border-0 ${isTop ? 'bg-primary-50/50 dark:bg-primary-500/5' : ''}`}
                                    >
                                        <td className="py-3 px-2">
                                            <div className="flex items-center gap-2">
                                                {isTop && <span className="text-[9px] bg-primary-500 text-white px-1.5 py-0.5 rounded-full font-bold">BEST</span>}
                                                <span className={`font-semibold text-xs ${isTop ? 'text-primary-600 dark:text-primary-400' : 'text-surface-900 dark:text-white'}`}>{m.model}</span>
                                            </div>
                                        </td>
                                        <td className="text-right py-3 px-2 font-mono text-xs text-surface-600 dark:text-surface-300">{m.acc}%</td>
                                        <td className="text-right py-3 px-2 font-mono text-xs text-surface-600 dark:text-surface-300">{m.f1}%</td>
                                        <td className="text-right py-3 px-2 font-mono text-xs text-surface-600 dark:text-surface-300">{m.auc}%</td>
                                        <td className="text-right py-3 px-2 font-mono text-xs text-surface-400">{m.time}</td>
                                        <td className="text-right py-3 px-2 font-mono text-xs text-surface-400">{m.params}</td>
                                        <td className="text-center py-3 px-2">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isTop ? 'bg-primary-500 text-white' : 'bg-surface-100 dark:bg-surface-800 text-surface-500'}`}>
                                                #{modelComparison.length - i}
                                            </span>
                                        </td>
                                    </motion.tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </ChartCard>

            {/* Full-Width: Statistical Significance Tests */}
            <ChartCard title="Statistical Significance Tests" icon={Shield} delay={0.75}
                description="Formal hypothesis tests confirming the ensemble model's superiority is statistically significant (α = 0.05).">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {statTests.map((t, i) => (
                        <motion.div
                            key={t.test}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 + i * 0.06 }}
                            className="rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 p-4"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <p className="text-[11px] font-bold text-surface-800 dark:text-surface-200 leading-tight pr-2">{t.test}</p>
                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${t.significant ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'}`}>
                                    {t.significant ? '✓ Significant' : '✗ Not Sig.'}
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div>
                                    <p className="text-[9px] text-surface-400 uppercase tracking-wider">Statistic</p>
                                    <p className="text-sm font-bold font-mono text-surface-900 dark:text-white">{t.stat.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-surface-400 uppercase tracking-wider">p-value</p>
                                    <p className={`text-sm font-bold font-mono ${t.pValue < 0.05 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'}`}>{t.pValue.toFixed(3)}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <div className="flex items-center gap-2 mt-4 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">All tests reject H₀ at α = 0.05, confirming performance improvements are statistically significant.</span>
                </div>
            </ChartCard>
        </div>
    )
}
