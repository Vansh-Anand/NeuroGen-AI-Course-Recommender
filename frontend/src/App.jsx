import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { ResultsProvider } from './context/ResultsContext'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ModelInsights from './pages/ModelInsights'
import Analysis from './pages/Analysis'
import About from './pages/About'

export default function App() {
    return (
        <ThemeProvider>
            <ResultsProvider>
                <Router>
                    <Routes>
                        {/* Public pages — no sidebar */}
                        <Route path="/" element={<Landing />} />
                        <Route path="/login" element={<Login />} />

                        {/* Authenticated pages — with sidebar */}
                        <Route element={<Layout />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/insights" element={<ModelInsights />} />
                            <Route path="/analysis" element={<Analysis />} />
                            <Route path="/about" element={<About />} />
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Route>
                    </Routes>
                </Router>
            </ResultsProvider>
        </ThemeProvider>
    )
}
