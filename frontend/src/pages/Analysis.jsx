import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Activity, Brain, BarChart3, Lightbulb, Target, Shield, TrendingUp,
    CheckCircle2, Zap, FlaskConical, AlertTriangle, GraduationCap,
    TrendingDown, Minus, Award, Star, ArrowUpRight, ArrowDownRight, Layers,
    ChevronDown, Shuffle, Code, Cpu, Atom
} from 'lucide-react'
import {
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
    LineChart, Line, CartesianGrid, Legend
} from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { useResults } from '../context/ResultsContext'
import NeuralNetworkViz from '../components/NeuralNetworkViz'
import OutcomePrediction from '../components/OutcomePrediction'

// ── Constants & Micro Components ──────────────────────────
const outcomeColors = { Distinction: '#22c55e', Pass: '#3b82f6', Fail: '#ef4444', Withdrawn: '#f59e0b' }
const careerIcons = { AI: Brain, Software: Code, Core: Cpu, Research: Atom }
const careerColors = { AI: '#10b981', Software: '#8b5cf6', Core: '#3b82f6', Research: '#f59e0b' }

function GradeBadge({ grade }) {
    const c = { Distinction: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400', Pass: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400', Fail: 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400', Withdrawn: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400' }
    return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${c[grade] || ''}`}>{grade}</span>
}

function DifficultyBadge({ level }) {
    const colors = { Easy: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400', Moderate: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400', Hard: 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400' }
    return <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${colors[level] || colors.Moderate}`}>{level}</span>
}

function CareerTag({ tag }) {
    const color = careerColors[tag] || '#94a3b8'
    const Icon = careerIcons[tag] || Code
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider" style={{ background: `${color}15`, color }}>
            <Icon className="w-2.5 h-2.5" />{tag}
        </span>
    )
}

function RiskBadge({ profile }) {
    const styles = {
        'Safe Choice': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
        'Moderate': 'bg-amber-50 text-amber-700 dark:bg-amber-500/15  dark:text-amber-400',
        'High Risk High Reward': 'bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400',
        'High Risk': 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400',
    }
    return <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${styles[profile] || styles.Moderate}`}>{profile}</span>
}

function Stat({ icon: I, label, value, sub, color = 'text-primary-500', delay = 0 }) {
    return (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="card p-4">
            <div className="flex items-center gap-2 mb-2"><I className={`w-4 h-4 ${color}`} /><span className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">{label}</span></div>
            <p className="text-2xl font-extrabold text-surface-900 dark:text-white">{value}</p>
            {sub && <p className="text-xs text-surface-400 mt-0.5">{sub}</p>}
        </motion.div>
    )
}

function Tip({ active, payload, label }) {
    if (!active || !payload?.length) return null
    return <div className="bg-white dark:bg-surface-800 rounded-lg shadow-elevated px-3 py-2 border border-surface-200 dark:border-surface-700 text-xs">
        <p className="font-bold text-surface-900 dark:text-white">{label}</p>
        <p className="text-surface-500">{typeof payload[0].value === 'number' && payload[0].value < 1 ? `${(payload[0].value * 100).toFixed(1)}%` : payload[0].value}</p>
    </div>
}

// ── Main Page ────────────────────────────────────────────────

export default function Analysis() {
    const { results } = useResults()
    const { darkMode } = useTheme()
    const [expandedRec, setExpandedRec] = useState(null)

    if (!results) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <div className="w-20 h-20 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-6">
                    <FlaskConical className="w-10 h-10 text-surface-400" />
                </div>
                <h2 className="text-2xl font-black text-surface-900 dark:text-white mb-2 tracking-tight">
                    No Analysis Data Available
                </h2>
                <p className="text-surface-500 max-w-sm mb-6">
                    Run a recommendation on the Dashboard first to view deep academic profile analysis and soft computing synthesis.
                </p>
                <a href="/dashboard" className="px-6 py-3 rounded-lg bg-primary-500 text-white font-bold hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/30">
                    Go to Dashboard
                </a>
            </div>
        )
    }

    const top = results.recommendations[0]
    const profile = results.profile_metrics || results.student_profile
    const readiness = results.readiness

    return (
        <div className="space-y-6 pb-12">
            <header className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-black text-surface-900 dark:text-white tracking-tight leading-tight flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/20 flex-shrink-0">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    Deep Analysis & Results
                </h1>
                <p className="text-surface-500 mt-2 font-medium">Detailed breakdown of soft-computing metrics, neural network focus, and complete academic profile.</p>
            </header>

            {/* Profile Stats */}
            {profile && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Stat icon={GraduationCap} label="Current CGPA" value={profile.current_cgpa?.toFixed(2)} sub={`Weighted: ${profile.weighted_cgpa?.toFixed(2)}`} delay={0.05} />
                    <Stat icon={profile.grade_trend === 'Improving' ? TrendingUp : profile.grade_trend === 'Declining' ? TrendingDown : Minus} label="Grade Trend" value={profile.grade_trend} sub={`Slope: ${profile.grade_trend_value}`} color={profile.grade_trend === 'Improving' ? 'text-emerald-500' : profile.grade_trend === 'Declining' ? 'text-red-500' : 'text-amber-500'} delay={0.1} />
                    <Stat icon={Award} label="Distinction Rate" value={`${profile.distinction_rate}%`} sub={`Fail: ${profile.fail_rate}%`} color="text-emerald-500" delay={0.15} />
                    <Stat icon={Activity} label="Readiness" value={readiness ? `${(readiness.score * 100).toFixed(0)}%` : 'N/A'} sub={readiness?.label || ''} color={readiness?.label === 'High' ? 'text-emerald-500' : readiness?.label === 'Low' ? 'text-red-500' : 'text-amber-500'} delay={0.2} />
                </div>
            )}

            {/* Top Recommended Course Prediction */}
            {top && (
                <div className="mb-6">
                    <OutcomePrediction 
                        prediction={{ 
                            label: top.predicted_outcome, 
                            confidence: Math.round(Math.max(top.probabilities.distinction || 0, top.probabilities.pass || 0, top.probabilities.fail || 0, top.probabilities.withdrawn || 0) * 100) 
                        }} 
                        moduleCode={top.code} 
                        moduleName={top.name} 
                    />
                </div>
            )}

            {/* Recommended Elective Hero */}
            {top && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className="card p-6 border-2 border-primary-200 dark:border-primary-500/25 bg-gradient-to-br from-primary-50/60 via-transparent to-transparent dark:from-primary-500/5">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/30">
                            <Star className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h2 className="text-lg font-bold text-surface-900 dark:text-white">Recommended: {top.name}</h2>
                                <span className="text-xs font-mono font-bold text-primary-500 bg-primary-50 dark:bg-primary-500/10 px-2 py-0.5 rounded-md">{top.code}</span>
                                <DifficultyBadge level={top.difficulty_level} />
                                <CareerTag tag={top.career_tag} />
                                <RiskBadge profile={top.risk_profile} />
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                                <div className="p-2.5 rounded-lg bg-white/70 dark:bg-surface-800/50"><p className="text-[10px] text-surface-400 font-bold uppercase mb-0.5">Expected GPA</p><p className="text-lg font-extrabold text-surface-900 dark:text-white">{top.expected_gpa}</p></div>
                                <div className="p-2.5 rounded-lg bg-white/70 dark:bg-surface-800/50"><p className="text-[10px] text-surface-400 font-bold uppercase mb-0.5">GPA Impact</p><p className={`text-lg font-extrabold flex items-center gap-1 ${top.gpa_impact >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{top.gpa_impact >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}{top.gpa_impact >= 0 ? '+' : ''}{top.gpa_impact}</p></div>
                                <div className="p-2.5 rounded-lg bg-white/70 dark:bg-surface-800/50"><p className="text-[10px] text-surface-400 font-bold uppercase mb-0.5">Predicted</p><GradeBadge grade={top.predicted_outcome} /></div>
                                <div className="p-2.5 rounded-lg bg-white/70 dark:bg-surface-800/50"><p className="text-[10px] text-surface-400 font-bold uppercase mb-0.5">Fail Risk</p><p className={`text-lg font-extrabold ${top.fail_risk < 20 ? 'text-emerald-600' : top.fail_risk < 40 ? 'text-amber-600' : 'text-red-600'}`}>{top.fail_risk}%</p></div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Ranked Recommendations Table */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-6">
                <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2"><Layers className="w-4 h-4 text-primary-500" /> Ranked Elective Recommendations</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead><tr className="text-left text-[10px] font-bold text-surface-400 uppercase tracking-wider border-b border-surface-100 dark:border-surface-800">
                            <th className="pb-3 pr-3">Rank</th><th className="pb-3 pr-3">Course</th><th className="pb-3 pr-3">Score</th><th className="pb-3 pr-3">Impact</th><th className="pb-3 pr-3">Predicted</th><th className="pb-3 pr-3">Difficulty</th><th className="pb-3 pr-3">Career</th><th className="pb-3 pr-3">Risk</th><th className="pb-3"></th>
                        </tr></thead>
                        <tbody>{results.recommendations?.slice(0, 7).map((rec, i) => (
                            <tr key={rec.code} className={`border-b border-surface-50 dark:border-surface-800/50 hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors cursor-pointer ${i === 0 ? 'bg-primary-50/40 dark:bg-primary-500/5' : ''}`} onClick={() => setExpandedRec(expandedRec === rec.code ? null : rec.code)}>
                                <td className="py-3 pr-3"><span className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-[10px] font-bold ${i === 0 ? 'bg-primary-500 text-white' : 'bg-surface-100 dark:bg-surface-800 text-surface-500'}`}>{i + 1}</span></td>
                                <td className="py-3 pr-3"><span className="font-bold text-surface-900 dark:text-white">{rec.code}</span><span className="text-surface-400 ml-1.5 text-xs">{rec.name}</span>{rec.ga_recommended && <FlaskConical className="w-3 h-3 text-purple-500 inline ml-1.5" />}</td>
                                <td className="py-3 pr-3 font-bold text-surface-900 dark:text-white">{rec.recommendation_score}</td>
                                <td className="py-3 pr-3"><span className={`font-bold flex items-center gap-0.5 ${rec.gpa_impact >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>{rec.gpa_impact >= 0 ? '+' : ''}{rec.gpa_impact}</span></td>
                                <td className="py-3 pr-3"><GradeBadge grade={rec.predicted_outcome} /></td>
                                <td className="py-3 pr-3"><DifficultyBadge level={rec.difficulty_level} /></td>
                                <td className="py-3 pr-3"><CareerTag tag={rec.career_tag} /></td>
                                <td className="py-3 pr-3"><RiskBadge profile={rec.risk_profile} /></td>
                                <td className="py-3"><ChevronDown className={`w-3.5 h-3.5 text-surface-400 transition-transform ${expandedRec === rec.code ? 'rotate-180' : ''}`} /></td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>

                {/* Expanded detail */}
                <AnimatePresence>{expandedRec && (() => {
                    const rec = results.recommendations?.find(r => r.code === expandedRec); if (!rec) return null
                    return (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/30 border border-surface-100 dark:border-surface-800">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-xs font-bold text-surface-900 dark:text-white mb-2">Probability Distribution</h4>
                                    <div className="h-36">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={[{ name: 'Dist', value: rec.probabilities?.distinction || 0 }, { name: 'Pass', value: rec.probabilities?.pass || 0 }, { name: 'Fail', value: rec.probabilities?.fail || 0 }, { name: 'With', value: rec.probabilities?.withdrawn || 0 }]} barCategoryGap="25%">
                                                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
                                                <Tooltip content={<Tip />} />
                                                <Bar dataKey="value" radius={[6, 6, 0, 0]}>{['Distinction', 'Pass', 'Fail', 'Withdrawn'].map(n => <Cell key={n} fill={outcomeColors[n]} opacity={0.85} />)}</Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {rec.explanations?.slice(0, 3).map((e, j) => <p key={j} className="text-xs text-surface-400"><strong className="text-surface-600 dark:text-surface-300">{e.title}:</strong> {e.text}</p>)}
                                    {/* Better Alternative */}
                                    {rec.better_alternative && (
                                        <div className="mt-2 p-3 rounded-lg bg-gradient-to-r from-amber-50 via-transparent to-transparent dark:from-amber-500/5 border border-amber-200 dark:border-amber-500/20">
                                            <div className="flex items-start gap-2">
                                                <Shuffle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">Better Alternative: <span className="font-mono bg-amber-100 dark:bg-amber-500/15 px-1.5 py-0.5 rounded">{rec.better_alternative.suggested_code}</span> {rec.better_alternative.suggested_name}</p>
                                                    <p className="text-[11px] text-surface-600 dark:text-surface-400 leading-relaxed">{rec.better_alternative.reason}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )
                })()}</AnimatePresence>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-4">
                {/* Custom Neural Network Visualisation */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <NeuralNetworkViz probabilities={top?.probabilities} isActive={true} />
                </motion.div>

                {/* Network Feature Importance */}
                {results.feature_importance && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-6">
                        <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2"><Brain className="w-4 h-4 text-primary-500" /> Neural Network Attention</h3>
                        <div className="space-y-3 mt-4">
                            {results.feature_importance.slice(0, 8).map((f, i) => (
                                <div key={f.feature} className="flex items-center gap-3">
                                    <span className="w-28 text-xs font-semibold text-surface-500 dark:text-surface-400 truncate text-right flex-shrink-0">{f.feature}</span>
                                    <div className="flex-1 h-3 rounded bg-surface-100 dark:bg-surface-800 overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${f.importance / (results.feature_importance[0]?.importance || 0.2) * 100}%` }} transition={{ delay: 0.2 + i * 0.05, duration: 0.6 }} className="h-full rounded bg-gradient-to-r from-purple-500 to-primary-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]" style={{ maxWidth: '100%' }} />
                                    </div>
                                    <span className="text-[10px] font-mono font-bold text-primary-600 dark:text-primary-400 w-10 text-right">{(f.importance * 100).toFixed(1)}%</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* GA Evolution + Fuzzy Suitability */}
                <div className="space-y-6">
                    {/* Why This Course */}
                    {top?.explanations && (
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
                            <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-amber-500" /> Why This Course ({top.code})</h3>
                            <div className="space-y-3">
                                {top.explanations.map((exp, i) => {
                                    const typeIcons = { strength: CheckCircle2, pattern: Shield, alignment: TrendingUp }
                                    const typeColors = { strength: 'text-emerald-500', pattern: 'text-blue-500', alignment: 'text-amber-500' }
                                    const typeBg = { strength: 'bg-emerald-50 dark:bg-emerald-500/10', pattern: 'bg-blue-50 dark:bg-blue-500/10', alignment: 'bg-amber-50 dark:bg-amber-500/10' }
                                    const Ic = typeIcons[exp.type] || CheckCircle2
                                    return (
                                        <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${typeBg[exp.type] || 'bg-surface-50'}`}>
                                            <Ic className={`w-4 h-4 mt-0.5 flex-shrink-0 ${typeColors[exp.type] || 'text-surface-500'}`} />
                                            <div>
                                                <p className="text-xs font-bold text-surface-900 dark:text-white mb-0.5">{exp.title}</p>
                                                <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">{exp.text}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    )}

                    {results.ga_evolution && (
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card p-6 border border-purple-200 dark:border-purple-500/20">
                            <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2"><FlaskConical className="w-4 h-4 text-purple-500" /> Genetic Algorithm Synthesis</h3>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={results.ga_evolution}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                                        <XAxis dataKey="generation" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} />
                                        <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} />
                                        <Tooltip content={<Tip />} />
                                        <Line type="monotone" dataKey="best_fitness" stroke="#22c55e" strokeWidth={2} dot={false} name="Best" />
                                        <Line type="monotone" dataKey="avg_fitness" stroke="#8b5cf6" strokeWidth={1.5} dot={false} name="Avg" />
                                        <Legend wrapperStyle={{ fontSize: 10 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <p className="text-xs text-surface-400 mt-2">Evolution converged on <strong className="text-purple-500">{results.ga_best?.code}</strong> with fitness {results.ga_best?.fitness}.</p>
                        </motion.div>
                    )}
                </div>

                {/* Radar + Fuzzy */}
                <div className="space-y-6">
                    {/* Overall Fuzzy Score */}
                    {top && (
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6">
                            <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-primary-500" /> Fuzzy Suitability</h3>
                            <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                                <p className="text-[10px] font-bold text-surface-400 uppercase mb-2">Overall Suitability Score</p>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-3 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
                                        <div className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all" style={{ width: `${(top.fuzzy_suitability || 0) * 100}%` }} />
                                    </div>
                                    <span className="text-sm font-bold text-surface-900 dark:text-white">{((top.fuzzy_suitability || 0) * 100).toFixed(0)}%</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Skill Profile Radar */}
                    {profile?.skill_profile && (
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card p-6">
                            <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2"><Target className="w-4 h-4 text-cyan-500" /> Student Skill Profile</h3>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart data={Object.entries(profile.skill_profile).map(([k, v]) => ({ skill: k.charAt(0).toUpperCase() + k.slice(1), value: v, fullMark: 4.0 }))} cx="50%" cy="50%" outerRadius="70%">
                                        <PolarGrid stroke="#e2e8f0" />
                                        <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 4]} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                                        <Radar name="Skills" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Subject Comparison Bar Chart */}
                {results.recommendations && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-6">
                        <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary-500" /> Subject Score Comparison</h3>
                        <div className="h-56">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={results.recommendations.slice(0, 7).map(r => ({ name: r.code, score: r.recommendation_score, gpa: r.expected_gpa }))} barCategoryGap="15%">
                                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<Tip />} />
                                    <Bar dataKey="score" name="Score" radius={[4, 4, 0, 0]}>
                                        {results.recommendations.slice(0, 7).map((r, i) => <Cell key={r.code} fill={i === 0 ? '#3b82f6' : '#cbd5e1'} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                )}

                {/* Mamdani Readiness Membership */}
                {readiness?.membership && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="card p-6 border border-cyan-200 dark:border-cyan-500/20">
                        <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-cyan-500" /> Mamdani Fuzzy Logic Readiness</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(readiness.membership).map(([varName, levels]) => (
                                <div key={varName} className="p-3 rounded-lg bg-cyan-50/50 dark:bg-cyan-500/5">
                                    <p className="text-[10px] font-bold text-cyan-800 dark:text-cyan-400 uppercase tracking-widest mb-2">{varName}</p>
                                    {Object.entries(levels).map(([level, val]) => (
                                        <div key={level} className="flex items-center gap-2 mb-1.5">
                                            <span className="text-[10px] text-surface-500 dark:text-surface-400 w-12 capitalize">{level}</span>
                                            <div className="flex-1 h-1.5 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden"><div className="h-full rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]" style={{ width: `${val * 100}%` }} /></div>
                                            <span className="text-[9px] font-mono text-cyan-600 dark:text-cyan-300 w-8 text-right">{(val * 100).toFixed(0)}%</span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-3 rounded-lg bg-white dark:bg-surface-900 border border-cyan-200 dark:border-cyan-500/20 flex justify-between items-center">
                            <span className="text-xs font-bold text-surface-900 dark:text-white">Readiness Score</span>
                            <span className="text-sm font-black text-cyan-600 dark:text-cyan-400">{(readiness.score * 100).toFixed(1)}% ({readiness.label})</span>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
