import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    User, Calendar, BookOpen, MousePointerClick,
    GraduationCap, Clock, ChevronDown, Sparkles, Loader2,
    Activity, Hash, Layers, Target,
} from 'lucide-react'

const COURSE_OPTIONS = [
    { code: 'AAA', name: 'Introductory Sociology' },
    { code: 'BBB', name: 'Introductory Programming' },
    { code: 'CCC', name: 'Data Structures' },
    { code: 'DDD', name: 'Foundation Mathematics' },
    { code: 'EEE', name: 'Machine Learning' },
    { code: 'FFF', name: 'Applied Statistics' },
    { code: 'GGG', name: 'Advanced Algorithms' },
    { code: 'HHH', name: 'Database Systems' },
    { code: 'III', name: 'Computer Networks' },
    { code: 'JJJ', name: 'Digital Signal Processing' },
    { code: 'KKK', name: 'Embedded Systems' },
]

const defaultForm = {
    code_module: 'CCC',
    gender: 'M',
    age_band: '0-35',
    highest_education: 'A Level or Equivalent',
    studied_credits: 60,
    num_of_prev_attempts: 0,
    avg_clicks: 100,
    avg_score: 60,
    active_days: 30,
    study_mode: 'Full-time',
    selected_electives: [],
}

function SelectField({ label, icon: Icon, value, onChange, options, id }) {
    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="text-xs font-semibold text-surface-600 dark:text-surface-400 flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5" />
                {label}
            </label>
            <div className="relative">
                <select
                    id={id} value={value} onChange={onChange}
                    className="w-full appearance-none px-3 py-2.5 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm font-medium text-surface-900 dark:text-surface-100 hover:border-primary-300 dark:hover:border-primary-500/30 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all cursor-pointer pr-9"
                >
                    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-400 pointer-events-none" />
            </div>
        </div>
    )
}

function NumberField({ label, icon: Icon, value, onChange, min, max, step = 1, id }) {
    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="text-xs font-semibold text-surface-600 dark:text-surface-400 flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5" />
                {label}
            </label>
            <input
                id={id} type="number" value={value} onChange={onChange} min={min} max={max} step={step}
                className="w-full px-3 py-2.5 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm font-medium text-surface-900 dark:text-surface-100 hover:border-primary-300 dark:hover:border-primary-500/30 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
            />
        </div>
    )
}

function SliderField({ label, icon: Icon, value, onChange, min, max, id, suffix = '' }) {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="flex items-center justify-between">
                <span className="text-xs font-semibold text-surface-600 dark:text-surface-400 flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                </span>
                <span className="text-sm font-bold text-surface-900 dark:text-white">{value}<span className="text-xs text-surface-400 font-medium ml-0.5">{suffix}</span></span>
            </label>
            <input
                id={id} type="range" min={min} max={max} value={value} onChange={onChange}
                className="w-full h-2 rounded-full bg-surface-200 dark:bg-surface-700 appearance-none cursor-pointer accent-primary-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-surface-400">
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    )
}

export default function StudentForm({ onSubmit, isLoading }) {
    const [form, setForm] = useState(defaultForm)
    const [electiveOpen, setElectiveOpen] = useState(false)

    const update = (key) => (e) => {
        const val = e.target.type === 'number' || e.target.type === 'range' ? Number(e.target.value) : e.target.value
        setForm(prev => ({ ...prev, [key]: val }))
    }

    const toggleElective = (code) => {
        setForm(prev => ({
            ...prev,
            selected_electives: prev.selected_electives.includes(code)
                ? prev.selected_electives.filter(c => c !== code)
                : [...prev.selected_electives, code],
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(form)
    }

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Step 1 — Target Course Selection */}
            <div className="card p-5 border-2 border-primary-200 dark:border-primary-500/30 bg-gradient-to-r from-primary-50/50 to-transparent dark:from-primary-500/5">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/15 flex items-center justify-center flex-shrink-0">
                        <Target className="w-5 h-5 text-primary-500" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-0.5 flex items-center gap-2">
                            Step 1 — Select Target Course
                            <span className="text-[10px] font-bold text-primary-500 bg-primary-50 dark:bg-primary-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Required</span>
                        </h3>
                        <p className="text-xs text-surface-500 dark:text-surface-400 mb-3">
                            Choose the course/module you want to predict outcomes for. All metrics below apply to this course.
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                            {COURSE_OPTIONS.map(c => (
                                <button
                                    key={c.code}
                                    type="button"
                                    onClick={() => setForm(prev => ({ ...prev, code_module: c.code }))}
                                    className={`px-3 py-2.5 rounded-lg text-xs font-semibold border transition-all text-center ${form.code_module === c.code
                                            ? 'bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/20'
                                            : 'bg-surface-50 dark:bg-surface-800 text-surface-600 dark:text-surface-300 border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-500/30'
                                        }`}
                                >
                                    <span className="block font-bold text-sm">{c.code}</span>
                                    <span className="block mt-0.5 opacity-75 leading-tight" style={{ fontSize: '10px' }}>{c.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Step 2 — Course-Specific Data */}
            <div className="flex items-center gap-2 mt-2">
                <div className="h-px flex-1 bg-surface-200 dark:bg-surface-700" />
                <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Step 2 — Enter Course Metrics for {COURSE_OPTIONS.find(c => c.code === form.code_module)?.name || form.code_module}</span>
                <div className="h-px flex-1 bg-surface-200 dark:bg-surface-700" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Academic */}
                <div className="card p-5">
                    <h3 className="text-xs font-bold text-surface-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-primary-500" />
                        Academic
                    </h3>
                    <div className="space-y-4">
                        <SliderField id="score" label="Assessment Score" icon={GraduationCap}
                            value={form.avg_score} onChange={update('avg_score')} min={0} max={100} suffix="%" />
                        <NumberField id="attempts" label="Previous Attempts" icon={Hash}
                            value={form.num_of_prev_attempts} onChange={update('num_of_prev_attempts')} min={0} max={10} />
                        <SelectField id="mode" label="Study Mode" icon={Clock}
                            value={form.study_mode} onChange={update('study_mode')}
                            options={[{ value: 'Full-time', label: 'Full-time' }, { value: 'Part-time', label: 'Part-time' }]} />
                    </div>
                </div>

                {/* Engagement */}
                <div className="card p-5">
                    <h3 className="text-xs font-bold text-surface-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary-500" />
                        Engagement
                    </h3>
                    <div className="space-y-4">
                        <SliderField id="clicks" label="Total Clicks (VLE)" icon={MousePointerClick}
                            value={form.avg_clicks} onChange={update('avg_clicks')} min={0} max={500} />
                        <SliderField id="days" label="Active Days" icon={Activity}
                            value={form.active_days} onChange={update('active_days')} min={0} max={365} suffix=" days" />
                        <SelectField id="credits" label="Studied Credits" icon={Layers}
                            value={form.studied_credits} onChange={update('studied_credits')}
                            options={[30, 60, 90, 120].map(v => ({ value: v, label: `${v} credits` }))} />
                    </div>
                </div>

                {/* Demographics */}
                <div className="card p-5">
                    <h3 className="text-xs font-bold text-surface-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                        <User className="w-4 h-4 text-primary-500" />
                        Demographics
                    </h3>
                    <div className="space-y-4">
                        <SelectField id="age" label="Age Band" icon={Calendar}
                            value={form.age_band} onChange={update('age_band')}
                            options={[
                                { value: '0-35', label: 'Under 35' },
                                { value: '35-55', label: '35 – 55' },
                                { value: '55+', label: 'Above 55' },
                            ]} />
                        <SelectField id="gender" label="Gender" icon={User}
                            value={form.gender} onChange={update('gender')}
                            options={[{ value: 'M', label: 'Male' }, { value: 'F', label: 'Female' }]} />
                        <SelectField id="edu" label="Education Background" icon={GraduationCap}
                            value={form.highest_education} onChange={update('highest_education')}
                            options={[
                                { value: 'Lower Than A Level', label: 'Below A-Level' },
                                { value: 'A Level or Equivalent', label: 'A-Level / Diploma' },
                                { value: 'HE Qualification', label: 'University Degree' },
                            ]} />
                    </div>
                </div>
            </div>

            {/* Elective Selection */}
            <div className="card p-5">
                <h3 className="text-xs font-bold text-surface-900 dark:text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary-500" />
                    Filter Elective Comparison <span className="text-[10px] font-normal text-surface-400 ml-1">(optional)</span>
                </h3>
                <p className="text-[11px] text-surface-400 dark:text-surface-500 mb-3">
                    By default, all electives are compared. Optionally filter to compare only specific courses.
                </p>
                <div className="relative">
                    <button
                        type="button" onClick={() => setElectiveOpen(!electiveOpen)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm hover:border-primary-300 dark:hover:border-primary-500/30 transition-all"
                    >
                        <span className={form.selected_electives.length ? 'text-surface-900 dark:text-surface-100 font-medium' : 'text-surface-400'}>
                            {form.selected_electives.length
                                ? `${form.selected_electives.length} course${form.selected_electives.length > 1 ? 's' : ''} selected`
                                : 'All available courses (default)'}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-surface-400 transition-transform ${electiveOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                        {electiveOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                                className="absolute z-20 top-full mt-1.5 w-full rounded-lg bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 shadow-elevated p-1.5 max-h-52 overflow-y-auto"
                            >
                                {COURSE_OPTIONS.map(e => (
                                    <label key={e.code} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-surface-50 dark:hover:bg-surface-800 cursor-pointer transition-colors text-sm">
                                        <input type="checkbox" checked={form.selected_electives.includes(e.code)} onChange={() => toggleElective(e.code)}
                                            className="w-3.5 h-3.5 rounded border-surface-300 text-primary-500 focus:ring-primary-500/20" />
                                        <span className="text-surface-700 dark:text-surface-200">
                                            <span className="font-semibold text-primary-500">{e.code}</span> — {e.name}
                                        </span>
                                    </label>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Submit */}
            <button
                type="submit" disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold shadow-lg shadow-primary-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
                <Sparkles className="w-4 h-4" />
                Analyze & Recommend
            </button>
        </motion.form>
    )
}
