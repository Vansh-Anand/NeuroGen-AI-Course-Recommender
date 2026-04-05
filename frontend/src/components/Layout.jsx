import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import {
    LayoutDashboard, BookOpen, BarChart3, ClipboardList,
    Info, LogOut, Menu, X, Sun, Moon, GraduationCap, History, Zap,
} from 'lucide-react'

const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/analysis', icon: Zap, label: 'Deep Analysis' },
    { to: '/insights', icon: BarChart3, label: 'Model Insights' },
    { to: '/about', icon: Info, label: 'About System' },
]

export default function Layout() {
    const { darkMode, toggleDarkMode } = useTheme()
    const [mobileOpen, setMobileOpen] = useState(false)
    const navigate = useNavigate()

    const handleLogout = () => navigate('/')

    const NavContent = () => (
        <>
            {/* Logo */}
            <div className="px-5 py-5 border-b border-surface-200 dark:border-surface-800">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-surface-900 dark:text-white leading-tight">AcademIQ</h1>
                        <p className="text-[10px] text-surface-400 uppercase tracking-wider">Intelligence Suite</p>
                    </div>
                </div>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400'
                                : 'text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-700 dark:hover:text-surface-200'
                            }`
                        }
                    >
                        <item.icon className="w-4 h-4 flex-shrink-0" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom controls */}
            <div className="px-3 py-4 border-t border-surface-200 dark:border-surface-800 space-y-1">
                <button
                    onClick={toggleDarkMode}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                    {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        </>
    )

    return (
        <div className="flex min-h-screen bg-surface-50 dark:bg-surface-950">
            {/* Desktop sidebar */}
            <aside className="hidden lg:flex flex-col w-60 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800 fixed inset-y-0 left-0 z-30">
                <NavContent />
            </aside>

            {/* Mobile header */}
            <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-white/90 dark:bg-surface-900/90 backdrop-blur-sm border-b border-surface-200 dark:border-surface-800">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-primary-500 flex items-center justify-center">
                            <GraduationCap className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-sm font-bold text-surface-900 dark:text-white">AcademIQ</span>
                    </div>
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile sidebar overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="lg:hidden fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="lg:hidden fixed inset-y-0 left-0 w-60 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800 z-50 flex flex-col"
                        >
                            <NavContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main content */}
            <main className="flex-1 lg:ml-60 pt-14 lg:pt-0">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 page-transition">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
