import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GraduationCap, BarChart3, Shield, BookOpen, ArrowRight, Zap } from 'lucide-react'


const features = [
    {
        icon: BarChart3,
        title: 'Outcome Prediction',
        desc: 'Predict student academic outcomes using ensemble ML models and neural networks trained on OULAD data.',
    },
    {
        icon: Shield,
        title: 'Risk Analysis',
        desc: 'Identify at-risk students early through neuro-fuzzy risk classification and probability assessment.',
    },
    {
        icon: BookOpen,
        title: 'Elective Recommendation',
        desc: 'Recommend optimal elective courses based on predicted performance and engagement compatibility.',
    },
]

export default function Landing() {
    return (
        <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
            {/* Header */}
            <header className="border-b border-surface-200 dark:border-surface-800 bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-extrabold text-surface-900 dark:text-white tracking-tight">Academ<span className="text-primary-500">IQ</span></span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link to="/about" className="text-sm font-semibold text-surface-600 dark:text-surface-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors hidden sm:block">System Overview</Link>
                        <Link
                            to="/login"
                            className="px-5 py-2.5 text-sm font-bold text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="max-w-6xl mx-auto px-6">
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="pt-20 pb-16 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20 text-xs font-semibold text-primary-600 dark:text-primary-400 mb-6">
                        <Zap className="w-3 h-3" />
                        Powered by Hybrid Machine Learning
                    </div>

                    <h2 className="text-4xl md:text-5xl font-extrabold text-surface-900 dark:text-white leading-tight max-w-3xl mx-auto">
                        Intelligent Academic
                        <span className="text-primary-500"> Advisory Platform</span>
                    </h2>

                    <p className="mt-5 text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto leading-relaxed">
                        Predicting academic outcomes and recommending electives using hybrid machine learning models trained on the Open University Learning Analytics Dataset.
                    </p>

                    <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-lg shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 transition-all"
                        >
                            Get Started
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            to="/about"
                            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-surface-600 dark:text-surface-300 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg hover:border-surface-300 dark:hover:border-surface-600 transition-all"
                        >
                            View System Overview
                        </Link>
                    </div>
                </motion.section>

                {/* Feature Cards */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="pb-24"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <motion.div
                                key={f.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="card-hover p-6"
                            >
                                <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center mb-4">
                                    <f.icon className="w-5 h-5 text-primary-500" />
                                </div>
                                <h3 className="text-base font-bold text-surface-900 dark:text-white mb-2">{f.title}</h3>
                                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>
            </main>

            {/* Footer */}
            <footer className="border-t border-surface-200 dark:border-surface-800 py-6 text-center text-xs text-surface-400">
                © 2025 AcademIQ Intelligence Suite · Built with React, Tailwind CSS & Machine Learning
            </footer>
        </div>
    )
}
