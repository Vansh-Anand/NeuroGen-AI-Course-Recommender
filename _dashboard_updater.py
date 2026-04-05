import os
import re

path = r"c:\Users\VANSH ANAND\Desktop\COURSE REC\frontend\src\pages\Dashboard.jsx"

with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add import
if 'NeuralNetworkViz' not in text:
    text = text.replace(
        "import ProcessingModal from '../components/ProcessingModal'",
        "import ProcessingModal from '../components/ProcessingModal'\nimport NeuralNetworkViz from '../components/NeuralNetworkViz'"
    )

# 2. Update Tabs
text = text.replace(
    "{[{ id: 'results', label: 'Recommendations', icon: Star }, { id: 'insights', label: 'Model Insights', icon: Brain }].map(tab => (",
    "{[{ id: 'results', label: 'Recommendations', icon: Star }, { id: 'analysis', label: 'Analysis', icon: BarChart3 }, { id: 'network', label: 'Neural Network', icon: Zap }].map(tab => ("
)

# 3. We are going to replace everything starting from `                            {/* Two-column: Why + NN vs ML */}` 
# all the way down to the closing of the results block, and insert our new tabs.
# It's easier to find the index and manipulate.

part1_marker = "                            {/* Two-column: Why + NN vs ML */}"
idx1 = text.find(part1_marker)

# Find the end of activeTab === 'insights'
part2_marker = "                    )}</AnimatePresence>"
idx2 = text.find(part2_marker)

if idx1 != -1 and idx2 != -1:
    before = text[:idx1]
    after = text[idx2:]

    # We need to preserve the Ranked Recommendations Table in the 'results' tab
    # It starts at: {/* Ranked Recommendations Table */}
    table_idx = text.find("                            {/* Ranked Recommendations Table */}", idx1)
    
    # And we find where activeTab === 'results' ends, which is just before {/* ═══ INSIGHTS TAB ═══ */}
    insights_idx = text.find("                    {/* ═══ INSIGHTS TAB ═══ */}", table_idx)
    
    # Also find where the Skill Profile Radar started, to exclude it from results tab code we keep
    radar_idx = text.find("                            {/* Skill Profile Radar */}", table_idx)
    
    if radar_idx != -1 and radar_idx < insights_idx:
        results_table_code = text[table_idx:radar_idx]
    else:
        results_table_code = text[table_idx:insights_idx]

    # Now we inject our new Layout
    new_tabs = f"""{results_table_code}                        </div>
                    )}

                    {{/* ═══ ANALYSIS TAB ═══ */}}
                    {{activeTab === 'analysis' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {{/* Why This Course */}}
                                {{top?.explanations && (
                                    <motion.div initial={{{{ opacity: 0, y: 12 }}}} animate={{{{ opacity: 1, y: 0 }}}} transition={{{{ delay: 0.1 }}}} className="card p-6">
                                        <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-amber-500" /> Why This Course</h3>
                                        <div className="space-y-3">
                                            {{top.explanations.map((exp, i) => {{
                                                const typeIcons = {{ strength: CheckCircle2, pattern: Shield, alignment: TrendingUp }}
                                                const typeColors = {{ strength: 'text-emerald-500', pattern: 'text-blue-500', alignment: 'text-amber-500' }}
                                                const typeBg = {{ strength: 'bg-emerald-50 dark:bg-emerald-500/10', pattern: 'bg-blue-50 dark:bg-blue-500/10', alignment: 'bg-amber-50 dark:bg-amber-500/10' }}
                                                const Ic = typeIcons[exp.type] || CheckCircle2
                                                return (
                                                    <div key={{i}} className={{`flex items-start gap-3 p-3 rounded-lg ${{typeBg[exp.type] || 'bg-surface-50'}}`}}>
                                                        <Ic className={{`w-4 h-4 mt-0.5 flex-shrink-0 ${{typeColors[exp.type] || 'text-surface-500'}}`}} />
                                                        <div><p className="text-xs font-bold text-surface-900 dark:text-white mb-0.5">{{exp.title}}</p><p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">{{exp.text}}</p></div>
                                                    </div>
                                                )
                                            }})}}
                                        </div>
                                    </motion.div>
                                )}}

                                <motion.div initial={{{{ opacity: 0, y: 12 }}}} animate={{{{ opacity: 1, y: 0 }}}} transition={{{{ delay: 0.15 }}}} className="flex flex-col gap-6">
                                    {{/* Fuzzy Suitability */}}
                                    {{top && (
                                        <div className="card p-6">
                                            <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-primary-500" /> Fuzzy Suitability</h3>
                                            <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                                                <p className="text-[10px] font-bold text-surface-400 uppercase mb-2">Overall Suitability Score</p>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-3 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
                                                        <div className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all" style={{{{ width: `${{(top.fuzzy_suitability || 0) * 100}}%` }}}} />
                                                    </div>
                                                    <span className="text-sm font-bold text-surface-900 dark:text-white">{{((top.fuzzy_suitability || 0) * 100).toFixed(0)}}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}}

                                    {{/* Skill Profile Radar */}}
                                    {{profile?.skill_profile && (
                                        <div className="card p-6 flex-1">
                                            <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2"><Target className="w-4 h-4 text-cyan-500" /> Student Skill Profile</h3>
                                            <div className="h-48">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <RadarChart data={{Object.entries(profile.skill_profile).map(([k, v]) => ({{ skill: k.charAt(0).toUpperCase() + k.slice(1), value: v, fullMark: 4.0 }}))}} cx="50%" cy="50%" outerRadius="70%">
                                                        <PolarGrid stroke="#e2e8f0" />
                                                        <PolarAngleAxis dataKey="skill" tick={{{{ fontSize: 11, fill: '#94a3b8' }}}} />
                                                        <PolarRadiusAxis angle={{30}} domain={{[0, 4]}} tick={{{{ fontSize: 9, fill: '#94a3b8' }}}} />
                                                        <Radar name="Skills" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={{0.2}} strokeWidth={{2}} />
                                                    </RadarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    )}}
                                </motion.div>
                            </div>

                            {{/* Subject Comparison Bar Chart */}}
                            {{results.recommendations && (
                                <motion.div initial={{{{ opacity: 0, y: 12 }}}} animate={{{{ opacity: 1, y: 0 }}}} transition={{{{ delay: 0.2 }}}} className="card p-6">
                                    <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary-500" /> Subject Score Comparison</h3>
                                    <div className="h-56">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={{results.recommendations.slice(0, 7).map(r => ({{ name: r.code, score: r.recommendation_score, gpa: r.expected_gpa }}))}} barCategoryGap="15%">
                                                <XAxis dataKey="name" tick={{{{ fontSize: 10, fill: '#94a3b8' }}}} axisLine={{false}} tickLine={{false}} />
                                                <YAxis tick={{{{ fontSize: 10, fill: '#94a3b8' }}}} axisLine={{false}} tickLine={{false}} />
                                                <Tooltip content={{<Tip />}} />
                                                <Bar dataKey="score" name="Score" radius={{[4, 4, 0, 0]}}>
                                                    {{results.recommendations.slice(0, 7).map((r, i) => <Cell key={{r.code}} fill={{i === 0 ? '#3b82f6' : '#cbd5e1'}} />)}}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </motion.div>
                            )}}
                        </div>
                    )}}

                    {{/* ═══ NEURAL NETWORK TAB ═══ */}}
                    {{activeTab === 'network' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {{/* Our custom Neural Network Visualisation */}}
                                <motion.div initial={{{{ opacity: 0, y: 12 }}}} animate={{{{ opacity: 1, y: 0 }}}} transition={{{{ delay: 0.1 }}}}>
                                    <NeuralNetworkViz probabilities={{top?.probabilities}} isActive={{true}} />
                                </motion.div>

                                {{/* Network Feature Importance */}}
                                {{results.feature_importance && (
                                    <motion.div initial={{{{ opacity: 0, y: 12 }}}} animate={{{{ opacity: 1, y: 0 }}}} transition={{{{ delay: 0.15 }}}} className="card p-6">
                                        <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-primary-500" /> Neural Network Attention</h3>
                                        <div className="space-y-3 mt-4">
                                            {{results.feature_importance.slice(0, 8).map((f, i) => (
                                                <div key={{f.feature}} className="flex items-center gap-3">
                                                    <span className="w-28 text-xs font-semibold text-surface-500 dark:text-surface-400 truncate text-right flex-shrink-0">{{f.feature}}</span>
                                                    <div className="flex-1 h-3 rounded bg-surface-100 dark:bg-surface-800 overflow-hidden">
                                                        <motion.div initial={{{{ width: 0 }}}} animate={{{{ width: `${{f.importance / (results.feature_importance[0]?.importance || 0.2) * 100}}%` }}}} transition={{{{ delay: 0.2 + i * 0.05, duration: 0.6 }}}} className="h-full rounded bg-gradient-to-r from-purple-500 to-primary-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]" style={{{{ maxWidth: '100%' }}}} />
                                                    </div>
                                                    <span className="text-[10px] font-mono font-bold text-primary-600 dark:text-primary-400 w-10 text-right">{{(f.importance * 100).toFixed(1)}}%</span>
                                                </div>
                                            ))}}
                                        </div>
                                    </motion.div>
                                )}}
                            </div>

                            {{/* Soft Computing Bottom Row */}}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {{results.ga_evolution && (
                                    <motion.div initial={{{{ opacity: 0, y: 12 }}}} animate={{{{ opacity: 1, y: 0 }}}} transition={{{{ delay: 0.2 }}}} className="card p-6 border border-purple-200 dark:border-purple-500/20">
                                        <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2"><FlaskConical className="w-4 h-4 text-purple-500" /> Genetic Algorithm Synthesis</h3>
                                        <div className="h-48"><ResponsiveContainer width="100%" height="100%"><LineChart data={{results.ga_evolution}}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={{0.2}} />
                                            <XAxis dataKey="generation" tick={{{{ fontSize: 10, fill: '#94a3b8' }}}} axisLine={{false}} />
                                            <YAxis tick={{{{ fontSize: 10, fill: '#94a3b8' }}}} axisLine={{false}} />
                                            <Tooltip content={{<Tip />}} />
                                            <Line type="monotone" dataKey="best_fitness" stroke="#22c55e" strokeWidth={{2}} dot={{false}} name="Best" />
                                            <Line type="monotone" dataKey="avg_fitness" stroke="#8b5cf6" strokeWidth={{1.5}} dot={{false}} name="Avg" />
                                            <Legend wrapperStyle={{{{ fontSize: 10 }}}} />
                                        </LineChart></ResponsiveContainer></div>
                                        <p className="text-xs text-surface-400 mt-2">Evolution converged on <strong className="text-purple-500">{{results.ga_best?.code}}</strong> with fitness {{results.ga_best?.fitness}}.</p>
                                    </motion.div>
                                )}}

                                {{readiness?.membership && (
                                    <motion.div initial={{{{ opacity: 0, y: 12 }}}} animate={{{{ opacity: 1, y: 0 }}}} transition={{{{ delay: 0.25 }}}} className="card p-6 border border-cyan-200 dark:border-cyan-500/20">
                                        <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-cyan-500" /> Fuzzy Readiness</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {{Object.entries(readiness.membership).map(([varName, levels]) => (
                                                <div key={{varName}} className="p-3 rounded-lg bg-cyan-50/50 dark:bg-cyan-500/5">
                                                    <p className="text-[10px] font-bold text-cyan-800 dark:text-cyan-400 uppercase tracking-widest mb-2">{{varName}}</p>
                                                    {{Object.entries(levels).map(([level, val]) => (
                                                        <div key={{level}} className="flex items-center gap-2 mb-1.5">
                                                            <span className="text-[10px] text-surface-500 dark:text-surface-400 w-12 capitalize">{{level}}</span>
                                                            <div className="flex-1 h-1.5 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden"><div className="h-full rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]" style={{{{ width: `${{val * 100}}%` }}}} /></div>
                                                            <span className="text-[9px] font-mono text-cyan-600 dark:text-cyan-300 w-8 text-right">{{(val * 100).toFixed(0)}}%</span>
                                                        </div>
                                                    ))}}
                                                </div>
                                            ))}}
                                        </div>
                                    </motion.div>
                                )}}
                            </div>
                        </div>
                    )}}
"""
    new_text = before + new_tabs + after

    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_text)
    
    print("Dashboard Update Complete!")
else:
    print("Could not find markers to replace.")
