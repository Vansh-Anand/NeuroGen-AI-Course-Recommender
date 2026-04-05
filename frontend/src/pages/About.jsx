import { motion } from 'framer-motion'
import {
    Info, Database, Cpu, GitBranch, Zap,
    BookOpen, Shield, BarChart3, BrainCircuit,
    ChevronRight,
} from 'lucide-react'

const models = [
    { name: 'Logistic Regression', desc: 'Linear baseline classifier for multi-class outcome prediction. Provides interpretable coefficients and probability calibration.', accuracy: '82.3%' },
    { name: 'Random Forest', desc: 'Ensemble of decision trees with bootstrap aggregation. Handles non-linear relationships and provides feature importance rankings.', accuracy: '86.7%' },
    { name: 'Gradient Boosting', desc: 'Sequential boosting algorithm that minimizes prediction errors iteratively. Strong performance on tabular academic data.', accuracy: '87.4%' },
    { name: 'Stacking Ensemble', desc: 'Meta-learner that combines outputs from all base models using logistic regression. Achieves highest overall accuracy.', accuracy: '89.1%' },
    { name: 'Neural Network (MLP)', desc: 'Multi-layer perceptron with ReLU activations. Captures complex non-linear patterns in student engagement and performance data.', accuracy: '88.4%' },
]

const pipeline = [
    { icon: Database, label: 'OULAD Data', desc: 'Raw student records' },
    { icon: GitBranch, label: 'Preprocessing', desc: 'Feature engineering & scaling' },
    { icon: Cpu, label: 'Model Training', desc: '5 ML models + ensemble' },
    { icon: BrainCircuit, label: 'Neuro-Fuzzy', desc: 'Risk classification' },
    { icon: BarChart3, label: 'Prediction', desc: 'Outcome & probabilities' },
    { icon: BookOpen, label: 'Recommendation', desc: 'Elective ranking' },
]

export default function About() {
    return (
        <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-xl font-bold text-surface-900 dark:text-white flex items-center gap-2.5">
                    <Info className="w-5 h-5 text-primary-500" />
                    About System
                </h1>
                <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                    System architecture, dataset, and methodology overview.
                </p>
            </motion.div>

            {/* Problem Statement */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
                <h2 className="text-base font-bold text-surface-900 dark:text-white mb-3">Problem Statement</h2>
                <p className="text-sm text-surface-600 dark:text-surface-300 leading-relaxed">
                    Higher education institutions face challenges in identifying at-risk students early and recommending suitable elective courses. Traditional advisory methods rely on subjective judgment and limited data analysis. This system addresses these challenges by applying hybrid machine learning models to predict academic outcomes, classify risk levels, and generate personalized elective recommendations based on student profiles and engagement patterns.
                </p>
            </motion.div>

            {/* Dataset */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-6">
                <h2 className="text-base font-bold text-surface-900 dark:text-white mb-3 flex items-center gap-2">
                    <Database className="w-4 h-4 text-primary-500" />
                    Dataset — OULAD
                </h2>
                <p className="text-sm text-surface-600 dark:text-surface-300 leading-relaxed mb-4">
                    The <strong>Open University Learning Analytics Dataset (OULAD)</strong> contains anonymized data from 32,593 students across 7 course modules. It includes demographic information, assessment scores, Virtual Learning Environment (VLE) interaction logs, and final academic outcomes.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: 'Students', value: '32,593' },
                        { label: 'Modules', value: '7' },
                        { label: 'VLE Records', value: '10M+' },
                        { label: 'Outcome Classes', value: '4' },
                    ].map(s => (
                        <div key={s.label} className="px-3 py-2.5 rounded-lg bg-surface-50 dark:bg-surface-800 text-center">
                            <p className="text-lg font-extrabold text-surface-900 dark:text-white">{s.value}</p>
                            <p className="text-[10px] text-surface-400 uppercase tracking-wider mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Models Used */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
                <h2 className="text-base font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-primary-500" />
                    Models Used
                </h2>
                <div className="space-y-3">
                    {models.map((m, i) => (
                        <div key={m.name} className="flex items-start gap-4 p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                            <span className="flex-shrink-0 w-6 h-6 rounded-md bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center text-[10px] font-bold text-primary-500">{i + 1}</span>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-bold text-surface-900 dark:text-white">{m.name}</h4>
                                    <span className="text-xs font-bold text-primary-500 bg-primary-50 dark:bg-primary-500/10 px-2 py-0.5 rounded-md">{m.accuracy}</span>
                                </div>
                                <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 leading-relaxed">{m.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* System Pipeline */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card p-6">
                <h2 className="text-base font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-primary-500" />
                    System Architecture Pipeline
                </h2>
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {pipeline.map((step, i) => (
                        <div key={step.label} className="flex items-center gap-2">
                            <div className="flex flex-col items-center text-center px-3 py-2.5 rounded-lg bg-surface-50 dark:bg-surface-800 min-w-[90px]">
                                <step.icon className="w-5 h-5 text-primary-500 mb-1" />
                                <p className="text-[10px] font-bold text-surface-900 dark:text-white leading-tight">{step.label}</p>
                                <p className="text-[9px] text-surface-400 mt-0.5">{step.desc}</p>
                            </div>
                            {i < pipeline.length - 1 && (
                                <ChevronRight className="w-4 h-4 text-surface-300 dark:text-surface-600 flex-shrink-0" />
                            )}
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Future Enhancements */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6">
                <h2 className="text-base font-bold text-surface-900 dark:text-white mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary-500" />
                    Future Enhancements
                </h2>
                <ul className="space-y-2">
                    {[
                        'Neuro-Fuzzy integration for interpretable risk classification with linguistic rule extraction.',
                        'Real-time VLE data streaming for dynamic, mid-semester predictions.',
                        'Explainable AI (XAI) dashboard with SHAP/LIME feature attributions.',
                        'Student self-service portal for personalized academic planning.',
                        'Multi-institutional deployment with federated learning support.',
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-surface-600 dark:text-surface-300">
                            <ChevronRight className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                            {item}
                        </li>
                    ))}
                </ul>
            </motion.div>

            {/* Tech Stack */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card p-6">
                <h2 className="text-base font-bold text-surface-900 dark:text-white mb-4">Technology Stack</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                        { label: 'Frontend', value: 'React + Tailwind CSS' },
                        { label: 'Backend', value: 'Flask REST API' },
                        { label: 'ML Framework', value: 'scikit-learn' },
                        { label: 'Neural Network', value: 'MLPClassifier' },
                        { label: 'Fuzzy Logic', value: 'scikit-fuzzy' },
                        { label: 'Visualization', value: 'Recharts' },
                    ].map(t => (
                        <div key={t.label} className="px-3 py-2.5 rounded-lg bg-surface-50 dark:bg-surface-800">
                            <p className="text-[10px] text-surface-400 uppercase tracking-wider">{t.label}</p>
                            <p className="text-xs font-bold text-surface-900 dark:text-white mt-0.5">{t.value}</p>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}
