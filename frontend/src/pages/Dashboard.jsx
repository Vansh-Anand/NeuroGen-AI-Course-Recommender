import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
    LayoutDashboard, Plus, Trash2, Sparkles, Loader2, ChevronDown,
    GraduationCap, TrendingUp, TrendingDown, Minus, Award, BookOpen,
    Shield, BarChart3, Brain, Lightbulb, Star, CheckCircle2,
    AlertTriangle, Target, Zap, ArrowUpRight, ArrowDownRight,
    Activity, Layers, User, FlaskConical, Shuffle, Sigma,
    Cpu, Lock, Cloud, Database, Code, Hammer, Atom,
} from 'lucide-react'
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
    PieChart, Pie, LineChart, Line, CartesianGrid, Legend,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts'
import ProcessingModal from '../components/ProcessingModal'
import NeuralNetworkViz from '../components/NeuralNetworkViz'
import { fetchHistoryRecommendation, COURSE_CATALOG } from '../utils/api'
import { useResults } from '../context/ResultsContext'

// ── Constants ──────────────────────────────────
const COURSES = COURSE_CATALOG
const GRADES = ['Distinction', 'Pass', 'Fail', 'Withdrawn']
const DIFFICULTIES = ['Easy', 'Medium', 'Hard']
const ENGAGEMENTS = ['Low', 'Medium', 'High']
const CREDITS = [30, 60, 90, 120]
const outcomeColors = { Distinction: '#22c55e', Pass: '#3b82f6', Fail: '#ef4444', Withdrawn: '#f59e0b' }
const categoryColors = {
    'Social Sciences': '#8b5cf6', Programming: '#3b82f6', Mathematics: '#f59e0b',
    'AI / Data Science': '#10b981', Engineering: '#f43f5e', 'Core CS': '#06b6d4',
    Software: '#8b5cf6', 'Emerging Tech': '#f97316',
}
const careerIcons = { AI: Brain, Software: Code, Core: Cpu, Research: Atom }
const careerColors = { AI: '#10b981', Software: '#8b5cf6', Core: '#3b82f6', Research: '#f59e0b' }
const difficultyColors = { Easy: '#22c55e', Moderate: '#f59e0b', Hard: '#ef4444' }
const impactColors = { high: '#22c55e', medium: '#f59e0b', low: '#ef4444', positive: '#22c55e', negative: '#ef4444', neutral: '#94a3b8', easy: '#22c55e', moderate: '#f59e0b', hard: '#ef4444' }

const emptyCourse = { course_code: '', grade: 'Pass', credits: 60, difficulty: 'Medium', engagement: 'Medium', clicks: 100, active_days: 30, attendance: 75 }

// ── Micro Components ──────────────────────────
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN DASHBOARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function Dashboard() {
    const [courses, setCourses] = useState([
        { ...emptyCourse, course_code: 'BBB', grade: 'Pass', clicks: 150, active_days: 35 },
        { ...emptyCourse, course_code: 'CCC', grade: 'Distinction', difficulty: 'Hard', engagement: 'High', clicks: 200, active_days: 40 },
        { ...emptyCourse, course_code: 'DDD', grade: 'Pass', credits: 30, difficulty: 'Easy', engagement: 'Low', clicks: 80, active_days: 20 },
        { ...emptyCourse, course_code: 'AAA', grade: 'Pass', credits: 30, clicks: 120, active_days: 30 },
        { ...emptyCourse, course_code: 'FFF', grade: 'Pass', difficulty: 'Hard', clicks: 90, active_days: 25 },
        { ...emptyCourse, course_code: 'EEE', grade: 'Distinction', difficulty: 'Hard', engagement: 'High', clicks: 210, active_days: 42 },
    ])
    const [demographics, setDemographics] = useState({ gender: 'M', age_band: '0-35', highest_education: 'A Level or Equivalent' })
    const [showDemographics, setShowDemographics] = useState(false)
    const [processing, setProcessing] = useState(false)
    const { results, setResults } = useResults()
    const [expandedRec, setExpandedRec] = useState(null)

    const addCourse = () => { if (courses.length < 11) setCourses(p => [...p, { ...emptyCourse }]) }
    const removeCourse = i => setCourses(p => p.filter((_, j) => j !== i))
    const updateCourse = (i, k, v) => setCourses(p => { const c = [...p]; c[i] = { ...c[i], [k]: v }; return c })

    const handleSubmit = useCallback(() => {
        if (courses.filter(c => c.course_code).length < 1) return
        setProcessing(true)
        setResults(null)
    }, [courses])

    const handleComplete = useCallback(() => {
        fetchHistoryRecommendation(
            courses.filter(c => c.course_code),
            demographics,
        ).then(data => {
            setResults(data)
        }).catch(e => {
            console.error('Recommendation error:', e)
        }).finally(() => {
            setProcessing(false)
        })
    }, [courses, demographics])

    const top = results?.recommendations?.[0]
    const profile = results?.student_profile
    const readiness = results?.readiness

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-xl font-bold text-surface-900 dark:text-white flex items-center gap-2.5">
                    <LayoutDashboard className="w-5 h-5 text-primary-500" /> Intelligent Course Recommendation System
                </h1>
                <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Enter your course history and get AI-powered elective recommendations with ML + Neural Network analysis.</p>
            </motion.div>

            {/* ═══ INPUT SECTION ═══ */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-surface-900 dark:text-white flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary-500" /> Course History
                        <span className="text-[10px] font-bold text-primary-500 bg-primary-50 dark:bg-primary-500/10 px-2 py-0.5 rounded-full">{courses.length}/11</span>
                    </h2>
                    <button type="button" onClick={addCourse} disabled={courses.length >= 11}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 hover:bg-primary-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                        <Plus className="w-3.5 h-3.5" /> Add Course
                    </button>
                </div>
                <div className="space-y-2">
                    {courses.map((c, i) => (
                        <div key={i} className="grid grid-cols-12 gap-2 items-end p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-800">
                            <div className="col-span-12 sm:col-span-3">
                                <label className="text-[10px] font-bold text-surface-400 uppercase mb-1 block">Course</label>
                                <select value={c.course_code} onChange={e => updateCourse(i, 'course_code', e.target.value)}
                                    className="w-full appearance-none px-2.5 py-2 rounded-md bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-sm outline-none focus:border-primary-500">
                                    <option value="">Select...</option>
                                    {COURSES.map(co => <option key={co.code} value={co.code}>{co.code} — {co.name}</option>)}
                                </select>
                            </div>
                            <div className="col-span-6 sm:col-span-2">
                                <label className="text-[10px] font-bold text-surface-400 uppercase mb-1 block">Grade</label>
                                <select value={c.grade} onChange={e => updateCourse(i, 'grade', e.target.value)}
                                    className="w-full appearance-none px-2.5 py-2 rounded-md bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-sm outline-none focus:border-primary-500">
                                    {GRADES.map(g => <option key={g}>{g}</option>)}
                                </select>
                            </div>
                            <div className="col-span-3 sm:col-span-1">
                                <label className="text-[10px] font-bold text-surface-400 uppercase mb-1 block">Credits</label>
                                <select value={c.credits} onChange={e => updateCourse(i, 'credits', +e.target.value)}
                                    className="w-full appearance-none px-2 py-2 rounded-md bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-sm outline-none focus:border-primary-500">
                                    {CREDITS.map(cr => <option key={cr} value={cr}>{cr}</option>)}
                                </select>
                            </div>
                            <div className="col-span-3 sm:col-span-2">
                                <label className="text-[10px] font-bold text-surface-400 uppercase mb-1 block">Difficulty</label>
                                <select value={c.difficulty} onChange={e => updateCourse(i, 'difficulty', e.target.value)}
                                    className="w-full appearance-none px-2 py-2 rounded-md bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-sm outline-none focus:border-primary-500">
                                    {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="col-span-4 sm:col-span-2">
                                <label className="text-[10px] font-bold text-surface-400 uppercase mb-1 block">Engagement</label>
                                <select value={c.engagement} onChange={e => updateCourse(i, 'engagement', e.target.value)}
                                    className="w-full appearance-none px-2 py-2 rounded-md bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-sm outline-none focus:border-primary-500">
                                    {ENGAGEMENTS.map(e => <option key={e}>{e}</option>)}
                                </select>
                            </div>
                            <div className="col-span-4 sm:col-span-1">
                                <label className="text-[10px] font-bold text-surface-400 uppercase mb-1 block">Clicks</label>
                                <input type="number" min={0} max={999} value={c.clicks} onChange={e => updateCourse(i, 'clicks', +e.target.value)}
                                    className="w-full px-2 py-2 rounded-md bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-sm outline-none focus:border-primary-500" />
                            </div>
                            <div className="col-span-3 sm:col-span-1 flex items-end justify-end">
                                <button type="button" onClick={() => removeCourse(i)} disabled={courses.length <= 1}
                                    className="p-2 rounded-md text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-30">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Demographics toggle */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
                <button type="button" onClick={() => setShowDemographics(!showDemographics)} className="w-full flex items-center justify-between">
                    <h2 className="text-sm font-bold text-surface-900 dark:text-white flex items-center gap-2"><User className="w-4 h-4 text-primary-500" /> Demographics <span className="text-[10px] font-normal text-surface-400 ml-1">(optional)</span></h2>
                    <ChevronDown className={`w-4 h-4 text-surface-400 transition-transform ${showDemographics ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>{showDemographics && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                        {[{ l: 'Gender', k: 'gender', opts: [['M', 'Male'], ['F', 'Female']] }, { l: 'Age Band', k: 'age_band', opts: [['0-35', 'Under 35'], ['35-55', '35–55'], ['55+', 'Above 55']] }, { l: 'Education', k: 'highest_education', opts: [['Lower Than A Level', 'Below A-Level'], ['A Level or Equivalent', 'A-Level'], ['HE Qualification', 'Degree']] }].map(f => (
                            <div key={f.k}><label className="text-[10px] font-bold text-surface-400 uppercase mb-1 block">{f.l}</label>
                                <select value={demographics[f.k]} onChange={e => setDemographics(p => ({ ...p, [f.k]: e.target.value }))}
                                    className="w-full appearance-none px-3 py-2.5 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm outline-none focus:border-primary-500">
                                    {f.opts.map(o => <option key={o[0]} value={o[0]}>{o[1]}</option>)}</select></div>
                        ))}
                    </motion.div>
                )}</AnimatePresence>
            </motion.div>

            {/* Analyze Button */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <button type="button" onClick={handleSubmit} disabled={processing || courses.filter(c => c.course_code).length < 1}
                    className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl bg-gradient-to-r from-primary-500 via-primary-600 to-purple-600 hover:from-primary-600 hover:via-primary-700 hover:to-purple-700 text-white text-sm font-bold shadow-xl shadow-primary-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed group">
                    <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                    Analyze & Recommend Best Elective
                </button>
            </motion.div>

            <AnimatePresence>{processing && <ProcessingModal isOpen={processing} onComplete={handleComplete} />}</AnimatePresence>

            {/* ═══ RESULTS HERO ═══ */}
            <AnimatePresence>{results && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 text-center bg-gradient-to-br from-primary-500/10 to-purple-600/10 border-2 border-primary-500/30 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-500/20 blur-3xl rounded-full pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full pointer-events-none" />
                    
                    <Sparkles className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                    <h3 className="text-surface-500 dark:text-surface-400 font-bold uppercase tracking-widest text-xs mb-2">Analysis Complete</h3>
                    <h2 className="text-3xl md:text-5xl font-black text-surface-900 dark:text-white mb-4 tracking-tight">Recommendation Ready</h2>
                    <p className="text-surface-500 mb-8 max-w-md mx-auto">The Neural Network has synthesized your academic profile. View your ranked electives and deep analysis.</p>
                    
                    <Link to="/analysis" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary-500 text-white font-bold hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/30 hover:scale-105">
                        View Deep Analysis Dashboard
                        <ArrowUpRight className="w-5 h-5" />
                    </Link>
                </motion.div>
            )}</AnimatePresence>
        </div>
    )
}
