import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    History, Plus, Trash2, Sparkles, Loader2, ChevronDown,
    GraduationCap, TrendingUp, TrendingDown, Minus, Award,
    BookOpen, Shield, BarChart3, Brain, Lightbulb, Star,
    CheckCircle2, AlertTriangle, XCircle, Target, Zap,
    ArrowUpRight, ArrowDownRight, Activity, Layers,
    User, Calendar,
} from 'lucide-react'
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    PieChart, Pie,
} from 'recharts'
import { fetchHistoryRecommendation } from '../utils/api'

// ── Constants ───────────────────────────────────────────
const COURSES = [
    { code: 'AAA', name: 'Introductory Sociology', category: 'Social Sciences' },
    { code: 'BBB', name: 'Introductory Programming', category: 'Programming' },
    { code: 'CCC', name: 'Data Structures', category: 'Programming' },
    { code: 'DDD', name: 'Foundation Mathematics', category: 'Mathematics' },
    { code: 'EEE', name: 'Machine Learning', category: 'AI / Data Science' },
    { code: 'FFF', name: 'Applied Statistics', category: 'Mathematics' },
    { code: 'GGG', name: 'Advanced Algorithms', category: 'Programming' },
    { code: 'HHH', name: 'Database Systems', category: 'Programming' },
    { code: 'III', name: 'Computer Networks', category: 'Engineering' },
    { code: 'JJJ', name: 'Digital Signal Processing', category: 'Engineering' },
    { code: 'KKK', name: 'Embedded Systems', category: 'Engineering' },
]

const GRADES = ['Distinction', 'Pass', 'Fail', 'Withdrawn']
const DIFFICULTIES = ['Easy', 'Medium', 'Hard']
const CREDITS = [30, 60, 90, 120]

const categoryColors = {
    'Social Sciences': '#8b5cf6',
    'Programming': '#3b82f6',
    'Mathematics': '#f59e0b',
    'AI / Data Science': '#10b981',
    'Engineering': '#f43f5e',
    'General': '#6b7280',
}

const outcomeColors = {
    Distinction: '#22c55e',
    Pass: '#3b82f6',
    Fail: '#ef4444',
    Withdrawn: '#f59e0b',
}

const emptyCourse = {
    course_code: '',
    grade: 'Pass',
    credits: 60,
    difficulty: 'Medium',
    clicks: 100,
    active_days: 30,
    attendance: 75,
}

// ── Tiny Shared Components ──────────────────────────────
function GradeBadge({ grade }) {
    const cls = {
        Distinction: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
        Pass: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
        Fail: 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400',
        Withdrawn: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
    }
    return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${cls[grade] || 'bg-surface-100 text-surface-600'}`}>
            {grade}
        </span>
    )
}

function StatCard({ icon: Icon, label, value, sub, color = 'text-primary-500', delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="card p-4"
        >
            <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-2xl font-extrabold text-surface-900 dark:text-white">{value}</p>
            {sub && <p className="text-xs text-surface-400 mt-0.5">{sub}</p>}
        </motion.div>
    )
}

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white dark:bg-surface-800 rounded-lg shadow-elevated px-3 py-2 border border-surface-200 dark:border-surface-700 text-xs">
            <p className="font-bold text-surface-900 dark:text-white">{label}</p>
            <p className="text-surface-500">{typeof payload[0].value === 'number' && payload[0].value < 1
                ? `${(payload[0].value * 100).toFixed(1)}%`
                : payload[0].value}</p>
        </div>
    )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN PAGE COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function CourseHistoryRecommender() {
    const [courses, setCourses] = useState([
        { ...emptyCourse, course_code: 'BBB', grade: 'Pass', clicks: 150, active_days: 35 },
        { ...emptyCourse, course_code: 'CCC', grade: 'Distinction', difficulty: 'Hard', clicks: 200, active_days: 40 },
        { ...emptyCourse, course_code: 'DDD', grade: 'Pass', credits: 30, difficulty: 'Easy', clicks: 80, active_days: 20 },
        { ...emptyCourse, course_code: 'AAA', grade: 'Pass', credits: 30, clicks: 120, active_days: 30 },
        { ...emptyCourse, course_code: 'FFF', grade: 'Pass', difficulty: 'Hard', clicks: 90, active_days: 25 },
        { ...emptyCourse, course_code: 'EEE', grade: 'Distinction', difficulty: 'Hard', clicks: 210, active_days: 42 },
    ])
    const [demographics, setDemographics] = useState({
        gender: 'M', age_band: '0-35', highest_education: 'A Level or Equivalent',
    })
    const [showDemographics, setShowDemographics] = useState(false)
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState(null)
    const [expandedRec, setExpandedRec] = useState(null)

    // ── handlers ─────────────────────────────────────────
    const addCourse = () => {
        if (courses.length >= 11) return
        setCourses(prev => [...prev, { ...emptyCourse }])
    }
    const removeCourse = (idx) => setCourses(prev => prev.filter((_, i) => i !== idx))
    const updateCourse = (idx, key, val) => {
        setCourses(prev => {
            const copy = [...prev]
            copy[idx] = { ...copy[idx], [key]: val }
            return copy
        })
    }

    const handleSubmit = useCallback(async () => {
        if (courses.filter(c => c.course_code).length < 1) return
        setLoading(true)
        setResults(null)
        try {
            const data = await fetchHistoryRecommendation(
                courses.filter(c => c.course_code),
                demographics,
            )
            setResults(data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [courses, demographics])

    const top = results?.recommendations?.[0]
    const profile = results?.student_profile

    // ━━━━━━━━━━━━━━━━━ RENDER ━━━━━━━━━━━━━━━━━━━━━━━━━
    return (
        <div className="space-y-6 pb-12">
            {/* ── Header ──────────────────────────────── */}
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-xl font-bold text-surface-900 dark:text-white flex items-center gap-2.5">
                    <History className="w-5 h-5 text-primary-500" />
                    Course History Recommender
                </h1>
                <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                    Enter your course history (up to 11 courses) to get AI-powered elective recommendations that optimize your CGPA.
                </p>
            </motion.div>

            {/* ━━━━ INPUT SECTION ━━━━━━━━━━━━━━━━━━━━━━ */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                {/* Course History Entries */}
                <div className="card p-5 mb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold text-surface-900 dark:text-white flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-primary-500" />
                            Course History
                            <span className="text-[10px] font-bold text-primary-500 bg-primary-50 dark:bg-primary-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                {courses.length}/11 courses
                            </span>
                        </h2>
                        <button
                            type="button"
                            onClick={addCourse}
                            disabled={courses.length >= 11}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Add Course
                        </button>
                    </div>

                    <div className="space-y-3">
                        <AnimatePresence>
                            {courses.map((c, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="grid grid-cols-12 gap-2 items-end p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-800"
                                >
                                    {/* Course */}
                                    <div className="col-span-12 sm:col-span-3">
                                        <label className="text-[10px] font-bold text-surface-400 uppercase mb-1 block">Course</label>
                                        <div className="relative">
                                            <select
                                                value={c.course_code}
                                                onChange={e => updateCourse(idx, 'course_code', e.target.value)}
                                                className="w-full appearance-none px-2.5 py-2 rounded-md bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 pr-7 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20"
                                            >
                                                <option value="">Select...</option>
                                                {COURSES.map(co => (
                                                    <option key={co.code} value={co.code}>{co.code} — {co.name}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    {/* Grade */}
                                    <div className="col-span-6 sm:col-span-2">
                                        <label className="text-[10px] font-bold text-surface-400 uppercase mb-1 block">Grade</label>
                                        <select
                                            value={c.grade}
                                            onChange={e => updateCourse(idx, 'grade', e.target.value)}
                                            className="w-full appearance-none px-2.5 py-2 rounded-md bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 outline-none focus:border-primary-500"
                                        >
                                            {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                                        </select>
                                    </div>
                                    {/* Credits */}
                                    <div className="col-span-6 sm:col-span-1">
                                        <label className="text-[10px] font-bold text-surface-400 uppercase mb-1 block">Credits</label>
                                        <select
                                            value={c.credits}
                                            onChange={e => updateCourse(idx, 'credits', Number(e.target.value))}
                                            className="w-full appearance-none px-2.5 py-2 rounded-md bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 outline-none focus:border-primary-500"
                                        >
                                            {CREDITS.map(cr => <option key={cr} value={cr}>{cr}</option>)}
                                        </select>
                                    </div>
                                    {/* Difficulty */}
                                    <div className="col-span-6 sm:col-span-2">
                                        <label className="text-[10px] font-bold text-surface-400 uppercase mb-1 block">Difficulty</label>
                                        <select
                                            value={c.difficulty}
                                            onChange={e => updateCourse(idx, 'difficulty', e.target.value)}
                                            className="w-full appearance-none px-2.5 py-2 rounded-md bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 outline-none focus:border-primary-500"
                                        >
                                            {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    {/* Clicks */}
                                    <div className="col-span-4 sm:col-span-1">
                                        <label className="text-[10px] font-bold text-surface-400 uppercase mb-1 block">Clicks</label>
                                        <input
                                            type="number" min={0} max={999}
                                            value={c.clicks}
                                            onChange={e => updateCourse(idx, 'clicks', Number(e.target.value))}
                                            className="w-full px-2 py-2 rounded-md bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 outline-none focus:border-primary-500"
                                        />
                                    </div>
                                    {/* Active Days */}
                                    <div className="col-span-4 sm:col-span-1">
                                        <label className="text-[10px] font-bold text-surface-400 uppercase mb-1 block">Days</label>
                                        <input
                                            type="number" min={0} max={365}
                                            value={c.active_days}
                                            onChange={e => updateCourse(idx, 'active_days', Number(e.target.value))}
                                            className="w-full px-2 py-2 rounded-md bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 outline-none focus:border-primary-500"
                                        />
                                    </div>
                                    {/* Attendance */}
                                    <div className="col-span-3 sm:col-span-1">
                                        <label className="text-[10px] font-bold text-surface-400 uppercase mb-1 block">Attend%</label>
                                        <input
                                            type="number" min={0} max={100}
                                            value={c.attendance}
                                            onChange={e => updateCourse(idx, 'attendance', Number(e.target.value))}
                                            className="w-full px-2 py-2 rounded-md bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 outline-none focus:border-primary-500"
                                        />
                                    </div>
                                    {/* Delete */}
                                    <div className="col-span-1 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => removeCourse(idx)}
                                            disabled={courses.length <= 1}
                                            className="p-2 rounded-md text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Demographics (optional) */}
                <div className="card p-5 mb-4">
                    <button
                        type="button"
                        onClick={() => setShowDemographics(!showDemographics)}
                        className="w-full flex items-center justify-between"
                    >
                        <h2 className="text-sm font-bold text-surface-900 dark:text-white flex items-center gap-2">
                            <User className="w-4 h-4 text-primary-500" />
                            Demographics & Context
                            <span className="text-[10px] font-normal text-surface-400 ml-1">(optional)</span>
                        </h2>
                        <ChevronDown className={`w-4 h-4 text-surface-400 transition-transform ${showDemographics ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                        {showDemographics && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4"
                            >
                                <div>
                                    <label className="text-[10px] font-bold text-surface-400 uppercase mb-1 block">Gender</label>
                                    <select
                                        value={demographics.gender}
                                        onChange={e => setDemographics(p => ({ ...p, gender: e.target.value }))}
                                        className="w-full appearance-none px-3 py-2.5 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm outline-none focus:border-primary-500"
                                    >
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-surface-400 uppercase mb-1 block">Age Band</label>
                                    <select
                                        value={demographics.age_band}
                                        onChange={e => setDemographics(p => ({ ...p, age_band: e.target.value }))}
                                        className="w-full appearance-none px-3 py-2.5 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm outline-none focus:border-primary-500"
                                    >
                                        <option value="0-35">Under 35</option>
                                        <option value="35-55">35 – 55</option>
                                        <option value="55+">Above 55</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-surface-400 uppercase mb-1 block">Education Background</label>
                                    <select
                                        value={demographics.highest_education}
                                        onChange={e => setDemographics(p => ({ ...p, highest_education: e.target.value }))}
                                        className="w-full appearance-none px-3 py-2.5 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm outline-none focus:border-primary-500"
                                    >
                                        <option value="Lower Than A Level">Below A-Level</option>
                                        <option value="A Level or Equivalent">A-Level / Diploma</option>
                                        <option value="HE Qualification">University Degree</option>
                                    </select>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Submit Button */}
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading || courses.filter(c => c.course_code).length < 1}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-sm font-semibold shadow-lg shadow-primary-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Analyzing Course History…
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4" />
                            Analyze & Recommend Best Elective
                        </>
                    )}
                </button>
            </motion.div>

            {/* ━━━━ RESULTS SECTION ━━━━━━━━━━━━━━━━━━━ */}
            <AnimatePresence>
                {results && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        {/* Divider */}
                        <div className="flex items-center gap-3">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary-300 dark:via-primary-700 to-transparent" />
                            <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest flex items-center gap-1.5">
                                <Zap className="w-3 h-3" /> Analysis Results
                            </span>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary-300 dark:via-primary-700 to-transparent" />
                        </div>

                        {/* ── Student Profile Summary Cards ──── */}
                        {profile && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <StatCard icon={GraduationCap} label="Current CGPA" value={profile.current_cgpa?.toFixed(2)} sub={`Weighted: ${profile.weighted_cgpa?.toFixed(2)}`} delay={0.05} />
                                <StatCard
                                    icon={profile.grade_trend === 'Improving' ? TrendingUp : profile.grade_trend === 'Declining' ? TrendingDown : Minus}
                                    label="Grade Trend"
                                    value={profile.grade_trend}
                                    sub={`Slope: ${profile.grade_trend_value}`}
                                    color={profile.grade_trend === 'Improving' ? 'text-emerald-500' : profile.grade_trend === 'Declining' ? 'text-red-500' : 'text-amber-500'}
                                    delay={0.1}
                                />
                                <StatCard icon={Award} label="Distinction Rate" value={`${profile.distinction_rate}%`} sub={`Fail rate: ${profile.fail_rate}%`} color="text-emerald-500" delay={0.15} />
                                <StatCard icon={Activity} label="Avg Engagement" value={profile.avg_engagement} sub={`Strongest: ${profile.strongest_skill}`} color="text-blue-500" delay={0.2} />
                            </div>
                        )}

                        {/* ── Top Recommended Elective (Improved Card) ─────── */}
                        {top && profile && (
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                className="card p-6 border-2 border-primary-500 bg-gradient-to-br from-primary-50/60 via-transparent to-transparent dark:from-primary-500/10"
                            >
                                <div className="flex flex-col md:flex-row gap-6 items-start">
                                    <div className="flex-1 w-full">
                                        <div className="flex items-center gap-3 flex-wrap mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/30">
                                                <Star className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-sm font-bold text-surface-400 uppercase tracking-widest mb-0.5">Recommended Elective</h2>
                                                <h3 className="text-2xl font-black text-surface-900 dark:text-white leading-tight">{top.name}</h3>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                            <div className="p-3 rounded-lg bg-white/80 dark:bg-surface-800 border border-surface-100 dark:border-surface-700">
                                                <p className="text-[10px] text-surface-500 font-bold uppercase mb-1">Expected Grade</p>
                                                <div className="flex items-center gap-2">
                                                    <GradeBadge grade={top.predicted_outcome} />
                                                </div>
                                            </div>
                                            <div className="p-3 rounded-lg bg-white/80 dark:bg-surface-800 border border-surface-100 dark:border-surface-700">
                                                <p className="text-[10px] text-surface-500 font-bold uppercase mb-1">NN Confidence</p>
                                                <p className="text-lg font-extrabold text-surface-900 dark:text-white">
                                                    {(Math.max(...Object.values(top.probabilities)) * 100).toFixed(0)}%
                                                </p>
                                            </div>
                                            <div className="p-3 rounded-lg bg-white/80 dark:bg-surface-800 border border-surface-100 dark:border-surface-700">
                                                <p className="text-[10px] text-surface-500 font-bold uppercase mb-1">Expected GPA</p>
                                                <p className="text-lg font-extrabold text-surface-900 dark:text-white">{top.expected_gpa}</p>
                                            </div>
                                            <div className="p-3 rounded-lg bg-primary-50/80 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30">
                                                <p className="text-[10px] text-primary-600 dark:text-primary-400 font-bold uppercase mb-1 flex items-center gap-1">
                                                    CGPA Impact
                                                </p>
                                                <p className={`text-lg font-extrabold flex items-center gap-1.5 ${top.gpa_impact >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                                    {top.gpa_impact >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                                                    {top.gpa_impact >= 0 ? '+' : ''}{top.gpa_impact}
                                                </p>
                                            </div>
                                        </div>

                                        {/* CGPA Projection */}
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-surface-100 dark:bg-surface-800/80">
                                            <div className="text-center">
                                                <p className="text-xs text-surface-500 font-bold uppercase mb-1">Current CGPA</p>
                                                <p className="text-xl font-bold text-surface-900 dark:text-white">{profile.current_cgpa.toFixed(2)}</p>
                                            </div>
                                            <div className="flex flex-col items-center px-4">
                                                <div className="h-px w-16 bg-gradient-to-r from-transparent via-surface-400 to-transparent mb-2" />
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${top.gpa_impact >= 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}>
                                                    {top.gpa_impact >= 0 ? '+' : ''}{top.gpa_impact}
                                                </span>
                                                <div className="h-px w-16 bg-gradient-to-r from-transparent via-surface-400 to-transparent mt-2" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs text-surface-500 font-bold uppercase mb-1">Projected CGPA</p>
                                                <p className="text-xl font-bold text-surface-900 dark:text-white">
                                                    {(profile.current_cgpa + top.gpa_impact).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                        {top.gpa_impact < 0 && (
                                            <div className="mt-3 flex items-center gap-2 text-xs text-red-600 dark:text-red-400 font-medium">
                                                <AlertTriangle className="w-4 h-4" />
                                                Warning: This elective is projected to decrease your CGPA.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* ── Explanation for Top Recommendation ────── */}
                            {top?.explanations && (
                                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6 flex flex-col">
                                    <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                                        <Lightbulb className="w-5 h-5 text-amber-500" />
                                        Why This Course Is Recommended
                                    </h3>
                                    <div className="flex-1 space-y-4">
                                        {top.explanations.map((exp, i) => {
                                            const icons = [CheckCircle2, Shield, TrendingUp, Brain]
                                            const colors = ['text-emerald-500', 'text-blue-500', 'text-amber-500', 'text-purple-500']
                                            const bgColors = ['bg-emerald-50 dark:bg-emerald-500/10', 'bg-blue-50 dark:bg-blue-500/10', 'bg-amber-50 dark:bg-amber-500/10', 'bg-purple-50 dark:bg-purple-500/10']
                                            const Ic = icons[i % icons.length]
                                            const mappingTitle = ['Academic Strength Match', 'Predicted Academic Success', 'CGPA Optimization', 'Academic Readiness']
                                            return (
                                                <div key={i} className={`flex items-start gap-4 p-4 rounded-xl ${bgColors[i % bgColors.length]}`}>
                                                    <div className="mt-0.5">
                                                        <Ic className={`w-5 h-5 ${colors[i % colors.length]}`} />
                                                    </div>
                                                    <div>
                                                        <p className={`text-sm font-bold mb-1 text-surface-900 dark:text-white`}>
                                                            {mappingTitle[i] || exp.title}
                                                        </p>
                                                        <p className="text-xs text-surface-600 dark:text-surface-400 leading-relaxed">
                                                            {exp.text}
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            <div className="space-y-6 flex flex-col">
                                {/* ── Neural Network Prediction Panel ──── */}
                                {top?.probabilities && (
                                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-6 flex-1 flex flex-col">
                                        <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                                            <Brain className="w-5 h-5 text-purple-500" />
                                            Neural Network Prediction Results
                                        </h3>
                                        <div className="h-40 mb-4">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={[
                                                    { name: 'Distinction', value: top.probabilities.distinction },
                                                    { name: 'Pass', value: top.probabilities.pass },
                                                    { name: 'Fail', value: top.probabilities.fail },
                                                    { name: 'Withdraw', value: top.probabilities.withdrawn },
                                                ]} barCategoryGap="20%">
                                                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                                    <YAxis hide domain={[0, 1]} />
                                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                                        {['Distinction', 'Pass', 'Fail', 'Withdraw'].map((name, i) => (
                                                            <Cell key={name} fill={Object.values(outcomeColors)[i]} opacity={0.9} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="mt-auto bg-surface-50 dark:bg-surface-800/50 p-4 rounded-xl">
                                            <p className="text-xs text-surface-600 dark:text-surface-300 leading-relaxed mb-3">
                                                The neural network analyzed the student's past course performance patterns and predicts the highest probability of achieving a <strong>{top.predicted_outcome}</strong> in this elective.
                                            </p>
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-700 shadow-sm">
                                                <Target className="w-4 h-4 text-primary-500" />
                                                <span className="text-xs font-bold text-surface-600 dark:text-surface-400 uppercase">Confidence Score:</span>
                                                <span className="text-sm font-black text-primary-600 dark:text-primary-400">
                                                    {(Math.max(...Object.values(top.probabilities)) * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* ── Neural Network Visualization ──── */}
                                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="card p-5">
                                    <h3 className="text-xs font-bold text-surface-900 dark:text-white mb-3 text-center">Neural Network Decision Model</h3>
                                    <div className="flex items-center justify-between px-2 mb-3">
                                        <div className="flex flex-col gap-1.5 items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center relative">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center relative">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                            </div>
                                            <span className="text-[10px] font-bold text-surface-500 mt-1">Input Features</span>
                                        </div>

                                        <div className="flex-1 flex flex-col justify-center px-2">
                                            <div className="h-px w-full border-t-2 border-dashed border-primary-200 dark:border-primary-700 relative">
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-surface-800 px-2 text-[10px] text-primary-400 font-bold tracking-widest uppercase">Learns</div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1 items-center">
                                            <div className="w-8 h-8 rounded-md bg-purple-100 dark:bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center">
                                                <Layers className="w-4 h-4 text-purple-600" />
                                            </div>
                                            <div className="w-8 h-8 rounded-md bg-purple-100 dark:bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center">
                                                <Brain className="w-4 h-4 text-purple-600" />
                                            </div>
                                            <span className="text-[10px] font-bold text-surface-500 mt-1">Hidden Layers</span>
                                        </div>

                                        <div className="flex-1 flex flex-col justify-center px-2">
                                            <div className="h-px w-full border-t-2 border-dashed border-primary-200 dark:border-primary-700 relative">
                                                <div className="absolute right-0 top-1/2 translate-x-1 -translate-y-1/2 w-2 h-2 rotate-45 border-t-2 border-r-2 border-primary-200 dark:border-primary-700" />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1.5 items-center">
                                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center relative">
                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-500/20 border-2 border-red-500 flex items-center justify-center relative">
                                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                            </div>
                                            <span className="text-[10px] font-bold text-surface-500 mt-1">Output Prob.</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-center text-surface-500 leading-snug">
                                        The neural network learns complex relationships between previous course performance and predicted success in new electives.
                                    </p>
                                </motion.div>
                            </div>
                        </div>

                        {/* ── Ranked Elective Comparison Table ─────────────── */}
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card p-6">
                            <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                                <Layers className="w-4 h-4 text-primary-500" />
                                Ranked Elective Comparison
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-[10px] font-bold text-surface-400 uppercase tracking-wider border-b border-surface-100 dark:border-surface-800">
                                            <th className="pb-3 pr-3">Course</th>
                                            <th className="pb-3 pr-3">Predicted Grade</th>
                                            <th className="pb-3 pr-3 text-center">Expected GPA</th>
                                            <th className="pb-3 pr-3 text-center">CGPA Impact</th>
                                            <th className="pb-3 pr-3 text-center">Risk</th>
                                            <th className="pb-3 w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.recommendations?.map((rec, i) => (
                                            <tr
                                                key={rec.code}
                                                className={`border-b border-surface-50 dark:border-surface-800/50 hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors cursor-pointer ${i === 0 ? 'bg-primary-50/40 dark:bg-primary-500/5' : ''}`}
                                                onClick={() => setExpandedRec(expandedRec === rec.code ? null : rec.code)}
                                            >
                                                <td className="py-3 pr-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-5 h-5 flex-shrink-0 rounded-full inline-flex items-center justify-center text-[10px] font-bold ${i === 0 ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/40' : 'bg-surface-100 dark:bg-surface-800 text-surface-500'}`}>
                                                            {i + 1}
                                                        </span>
                                                        <span className="font-bold text-surface-900 dark:text-white">{rec.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 pr-3"><GradeBadge grade={rec.predicted_outcome} /></td>
                                                <td className="py-3 pr-3 text-center font-bold text-surface-900 dark:text-white">{rec.expected_gpa}</td>
                                                <td className="py-3 pr-3 text-center">
                                                    <span className={`inline-flex items-center justify-center gap-0.5 px-2 py-0.5 rounded text-xs font-bold ${rec.gpa_impact >= 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400'}`}>
                                                        {rec.gpa_impact >= 0 ? '+' : ''}{rec.gpa_impact}
                                                    </span>
                                                </td>
                                                <td className="py-3 pr-3 text-center">
                                                    <span className={`text-xs font-bold ${rec.fail_risk < 20 ? 'text-emerald-600 dark:text-emerald-400' : rec.fail_risk < 40 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500 dark:text-red-400'}`}>
                                                        {rec.fail_risk < 20 ? 'Low' : rec.fail_risk < 40 ? 'Medium' : 'High'}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-right">
                                                    <ChevronDown className={`w-3.5 h-3.5 ml-auto text-surface-400 transition-transform ${expandedRec === rec.code ? 'rotate-180' : ''}`} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Expanded detail for selected elective (keeps mini charts) */}
                            <AnimatePresence>
                                {expandedRec && (() => {
                                    const rec = results.recommendations?.find(r => r.code === expandedRec)
                                    if (!rec) return null
                                    const probData = [
                                        { name: 'Distinction', value: rec.probabilities?.distinction || 0 },
                                        { name: 'Pass', value: rec.probabilities?.pass || 0 },
                                        { name: 'Fail', value: rec.probabilities?.fail || 0 },
                                        { name: 'Withdrawn', value: rec.probabilities?.withdrawn || 0 },
                                    ]
                                    return (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-4 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/30 border border-surface-100 dark:border-surface-800"
                                        >
                                            <h4 className="text-xs font-bold text-surface-900 dark:text-white mb-3 flex items-center gap-2">
                                                <BarChart3 className="w-3.5 h-3.5 text-primary-500" />
                                                Probability Distribution
                                            </h4>
                                            <div className="h-44">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={probData} barCategoryGap="25%">
                                                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                                        <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                                            {probData.map(d => <Cell key={d.name} fill={outcomeColors[d.name]} opacity={0.85} />)}
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </motion.div>
                                    )
                                })()}
                            </AnimatePresence>
                        </motion.div>



                        {/* ── Model Comparison ─────────────────────── */}
                        {results.model_comparison && (
                            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="card p-6">
                                <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Brain className="w-4 h-4 text-primary-500" />
                                    Model Comparison
                                </h3>
                                <p className="text-xs text-surface-400 mb-4">
                                    Individual model predictions based on your engineered feature vector. The ensemble average drives the final recommendation.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                    {results.model_comparison.map((mc, i) => {
                                        const modelColors = ['#8b5cf6', '#3b82f6', '#f59e0b', '#10b981']
                                        return (
                                            <div key={mc.model} className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-800">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-2 h-2 rounded-full" style={{ background: modelColors[i] }} />
                                                    <p className="text-xs font-bold text-surface-900 dark:text-white">{mc.model}</p>
                                                </div>
                                                <div className="flex items-baseline gap-2 mb-2">
                                                    <GradeBadge grade={mc.prediction} />
                                                    <span className="text-xs text-surface-400">{typeof mc.confidence === 'number' ? mc.confidence.toFixed(1) : mc.confidence}%</span>
                                                </div>
                                                <div className="space-y-1.5 mt-3">
                                                    {[
                                                        { label: 'Dist', val: mc.p_distinction, color: outcomeColors.Distinction },
                                                        { label: 'Pass', val: mc.p_pass, color: outcomeColors.Pass },
                                                        { label: 'Fail', val: mc.p_fail, color: outcomeColors.Fail },
                                                        { label: 'With', val: mc.p_withdrawn, color: outcomeColors.Withdrawn },
                                                    ].map(b => (
                                                        <div key={b.label} className="flex items-center gap-2">
                                                            <span className="text-[10px] text-surface-400 w-6">{b.label}</span>
                                                            <div className="flex-1 h-1.5 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
                                                                <div className="h-full rounded-full" style={{ width: `${(b.val || 0) * 100}%`, background: b.color }} />
                                                            </div>
                                                            <span className="text-[10px] text-surface-400 w-9 text-right">{((b.val || 0) * 100).toFixed(0)}%</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* ── Feature Engineering Summary ─────────── */}
                        {results.features && (
                            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-6">
                                <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Target className="w-4 h-4 text-primary-500" />
                                    Engineered Feature Summary
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                                    {Object.entries(results.features).slice(0, 18).map(([key, val]) => (
                                        <div key={key} className="p-2.5 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                                            <p className="text-[10px] text-surface-400 font-bold uppercase truncate" title={key}>{key.replace(/_/g, ' ')}</p>
                                            <p className="text-sm font-bold text-surface-900 dark:text-white mt-0.5">{typeof val === 'number' ? val.toFixed ? val.toFixed(2) : val : val}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* ── Final Recommendation Summary ──────── */}
                        {top && (
                            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="card p-6 border-l-4 border-l-primary-500 bg-gradient-to-r from-primary-50 dark:from-primary-900/10 to-transparent">
                                <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-3 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-primary-500" />
                                    Final Recommendation
                                </h3>
                                <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-4 leading-relaxed">
                                    The system recommends <strong>{top.name}</strong> because it maximizes predicted academic performance while minimizing failure risk and improving the student's CGPA.
                                </p>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-surface-500 uppercase">Expected CGPA improvement:</span>
                                        <span className={`text-sm font-black ${top.gpa_impact >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                            {top.gpa_impact >= 0 ? '+' : ''}{top.gpa_impact}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-surface-500 uppercase">Confidence level:</span>
                                        <span className="text-sm font-black text-primary-600 dark:text-primary-400">
                                            {Math.max(...Object.values(top.probabilities)) >= 0.70 ? 'High' : Math.max(...Object.values(top.probabilities)) >= 0.50 ? 'Medium' : 'Low'}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
