import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GraduationCap, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react'

export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!email || !password) {
            setError('Please fill in all fields')
            return
        }
        setError('')
        setLoading(true)
        // Mock login — 1.2s delay then navigate
        setTimeout(() => {
            setLoading(false)
            navigate('/dashboard')
        }, 1200)
    }

    return (
        <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex flex-col">
            {/* Back link */}
            <div className="p-6">
                <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-sm text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to home
                </Link>
            </div>

            {/* Login card */}
            <div className="flex-1 flex items-center justify-center px-6 -mt-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center mx-auto mb-4">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-surface-900 dark:text-white">Sign in to AcademIQ</h1>
                        <p className="text-sm text-surface-400 mt-1">Enter your university credentials</p>
                    </div>

                    {/* Form card */}
                    <div className="card p-6">
                        <div className="mb-6">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault()
                                    setLoading(true)
                                    // Simulated Google Auth Callback
                                    setTimeout(() => { setLoading(false); navigate('/dashboard'); }, 1500)
                                }}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700 text-surface-900 dark:text-white text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                            >
                                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Continue with Google
                            </button>
                        </div>

                        <div className="relative flex items-center gap-4 mb-6">
                            <div className="flex-1 h-px bg-surface-200 dark:bg-surface-800"></div>
                            <span className="text-xs font-bold text-surface-400 uppercase tracking-wider">Or email</span>
                            <div className="flex-1 h-px bg-surface-200 dark:bg-surface-800"></div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email */}
                            <div className="space-y-1.5">
                                <label htmlFor="email" className="text-xs font-semibold text-surface-600 dark:text-surface-400">
                                    University Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="student@university.ac.uk"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-white placeholder:text-surface-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <label htmlFor="password" className="text-xs font-semibold text-surface-600 dark:text-surface-400">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-white placeholder:text-surface-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <p className="text-xs text-red-500 font-medium">{error}</p>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>
                    </div>

                    <p className="text-center text-xs text-surface-400 mt-4">
                        Demo system — enter any credentials to continue
                    </p>
                </motion.div>
            </div>
        </div>
    )
}
