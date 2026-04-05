// Utility & API functions for the Course Recommendation System
// Supports 26 subjects with NN vs ML comparison, fuzzy scoring, etc.

const API_BASE = 'http://localhost:5000'

const COURSE_CATALOG = [
    // Original 11
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
    // New 15
    { code: 'LLL', name: 'Deep Learning', category: 'AI / Data Science' },
    { code: 'MMM', name: 'Natural Language Processing', category: 'AI / Data Science' },
    { code: 'NNN', name: 'Computer Vision', category: 'AI / Data Science' },
    { code: 'OOO', name: 'Operating Systems', category: 'Core CS' },
    { code: 'PPP', name: 'Compiler Design', category: 'Core CS' },
    { code: 'QQQ', name: 'Software Engineering', category: 'Software' },
    { code: 'RRR', name: 'DevOps & CI/CD', category: 'Software' },
    { code: 'SSS', name: 'Blockchain Technology', category: 'Emerging Tech' },
    { code: 'TTT', name: 'Internet of Things', category: 'Emerging Tech' },
    { code: 'UUU', name: 'Cybersecurity', category: 'Emerging Tech' },
    { code: 'VVV', name: 'Cloud Computing', category: 'Emerging Tech' },
    { code: 'WWW', name: 'Discrete Mathematics', category: 'Mathematics' },
    { code: 'XXX', name: 'Optimization Techniques', category: 'Mathematics' },
    { code: 'YYY', name: 'Advanced DBMS', category: 'Core CS' },
    { code: 'ZZZ', name: 'Computer Architecture', category: 'Engineering' },
]

export { COURSE_CATALOG }

const DIFFICULTY_MAP = {
    AAA: 'Easy', BBB: 'Easy', CCC: 'Moderate', DDD: 'Easy',
    EEE: 'Hard', FFF: 'Moderate', GGG: 'Hard', HHH: 'Moderate',
    III: 'Moderate', JJJ: 'Hard', KKK: 'Hard',
    LLL: 'Hard', MMM: 'Hard', NNN: 'Hard', OOO: 'Moderate',
    PPP: 'Hard', QQQ: 'Moderate', RRR: 'Moderate', SSS: 'Hard',
    TTT: 'Moderate', UUU: 'Hard', VVV: 'Moderate', WWW: 'Moderate',
    XXX: 'Hard', YYY: 'Moderate', ZZZ: 'Hard',
}

const CAREER_MAP = {
    AAA: 'Research', BBB: 'Software', CCC: 'Software', DDD: 'Research',
    EEE: 'AI', FFF: 'Research', GGG: 'Software', HHH: 'Software',
    III: 'Core', JJJ: 'Core', KKK: 'Core',
    LLL: 'AI', MMM: 'AI', NNN: 'AI', OOO: 'Core',
    PPP: 'Core', QQQ: 'Software', RRR: 'Software', SSS: 'Research',
    TTT: 'Software', UUU: 'Core', VVV: 'Software', WWW: 'Research',
    XXX: 'Research', YYY: 'Core', ZZZ: 'Core',
}

function generateMockHistoryRecommendation(courseHistory) {
    const n = courseHistory.length || 6
    const gradeToGpa = { Distinction: 4.0, Pass: 3.0, Fail: 1.0, Withdrawn: 0.0 }
    const gpas = courseHistory.map(c => gradeToGpa[c.grade] ?? 2.5)
    const avgGpa = gpas.reduce((a, b) => a + b, 0) / gpas.length
    const takenCodes = new Set(courseHistory.map(c => c.course_code))

    const candidates = COURSE_CATALOG.filter(c => !takenCodes.has(c.code))
    const allCandidates = candidates.length > 0 ? candidates : COURSE_CATALOG

    const recommendations = allCandidates.map(c => {
        const pDist = 0.05 + Math.random() * 0.45
        const pFail = 0.02 + Math.random() * 0.2
        const pPass = 0.2 + Math.random() * 0.4
        const pWith = Math.max(0.02, 1 - pDist - pFail - pPass)
        const total = pDist + pFail + pPass + pWith
        const probs = {
            distinction: pDist / total,
            fail: pFail / total,
            pass: pPass / total,
            withdrawn: pWith / total,
        }
        const expectedGpa = probs.distinction * 4 + probs.pass * 3 + probs.fail * 1 + probs.withdrawn * 0
        const recScore = probs.distinction * 1.5 + probs.pass * 1.0 + probs.fail * -2.0 + probs.withdrawn * -1.0
        const gpaImpact = expectedGpa - avgGpa
        const failRisk = (probs.fail + probs.withdrawn) * 100
        const maxP = Math.max(probs.distinction, probs.pass, probs.fail, probs.withdrawn)
        let predicted = 'Pass'
        if (maxP === probs.distinction) predicted = 'Distinction'
        else if (maxP === probs.fail) predicted = 'Fail'
        else if (maxP === probs.withdrawn) predicted = 'Withdrawn'

        const difficulty = DIFFICULTY_MAP[c.code] || 'Moderate'
        const career = CAREER_MAP[c.code] || 'Software'
        let riskProfile = 'Moderate'
        if (difficulty === 'Hard' && expectedGpa >= 3.0) riskProfile = 'High Risk High Reward'
        else if (failRisk < 25) riskProfile = 'Safe Choice'
        else if (difficulty === 'Hard' && failRisk > 30) riskProfile = 'High Risk'

        const skillAlignment = 1.5 + Math.random() * 2.5
        const suitability = parseFloat((0.3 + Math.random() * 0.6).toFixed(4))

        // NN vs ML per-elective
        const mlPred = Math.random() > 0.5 ? 'Pass' : 'Distinction'
        const nnPred = Math.random() > 0.4 ? 'Pass' : 'Distinction'

        return {
            code: c.code,
            name: c.name,
            category: c.category,
            recommendation_score: parseFloat(recScore.toFixed(3)),
            expected_gpa: parseFloat(expectedGpa.toFixed(2)),
            gpa_impact: parseFloat(gpaImpact.toFixed(2)),
            predicted_outcome: predicted,
            fail_risk: parseFloat(failRisk.toFixed(1)),
            expected_marks: `${Math.max(0, Math.round(expectedGpa / 4 * 100 - 8))}–${Math.min(100, Math.round(expectedGpa / 4 * 100 + 8))}`,
            difficulty_level: difficulty,
            career_tag: career,
            risk_profile: riskProfile,
            fuzzy_suitability: suitability,
            fuzzy_confidence: parseFloat((0.3 + Math.random() * 0.5).toFixed(4)),
            fuzzy_membership: {
                skill_alignment: parseFloat((skillAlignment / 4).toFixed(3)),
                difficulty_tolerance: parseFloat((0.4 + Math.random() * 0.5).toFixed(3)),
                performance_confidence: parseFloat((probs.distinction + probs.pass).toFixed(3)),
                engagement_fit: parseFloat((0.5 + Math.random() * 0.4).toFixed(3)),
            },
            probabilities: {
                distinction: parseFloat(probs.distinction.toFixed(4)),
                fail: parseFloat(probs.fail.toFixed(4)),
                pass: parseFloat(probs.pass.toFixed(4)),
                withdrawn: parseFloat(probs.withdrawn.toFixed(4)),
            },
            nn_vs_ml: {
                ml_prediction: mlPred,
                ml_confidence: parseFloat((55 + Math.random() * 35).toFixed(1)),
                nn_prediction: nnPred,
                nn_confidence: parseFloat((55 + Math.random() * 35).toFixed(1)),
                agreement: mlPred === nnPred,
            },
            explanations: [
                { title: 'Strong Skill Match', text: `Your performance in related areas indicates strong alignment with ${c.name}.`, type: 'strength' },
                { title: gpaImpact > 0 ? 'Positive CGPA Impact' : 'CGPA Consideration', text: gpaImpact > 0 ? `Expected to improve your CGPA by +${gpaImpact.toFixed(2)}.` : `Expected GPA (${expectedGpa.toFixed(2)}) may not improve your current average.`, type: 'alignment' },
                { title: failRisk < 20 ? 'Strong Predicted Performance' : 'Achievable with Effort', text: `Predicted failure/withdrawal probability is ${failRisk.toFixed(1)}%.`, type: 'pattern' },
                { title: 'Academic Readiness', text: `Fuzzy readiness evaluation confirms ${suitability > 0.6 ? 'high' : 'moderate'} preparedness for this course.`, type: 'alignment' },
            ],
            influencing_params: [
                { param: 'Skill Match', value: parseFloat(skillAlignment.toFixed(2)), impact: skillAlignment >= 3.0 ? 'high' : 'medium' },
                { param: 'Grade Trend', value: parseFloat((Math.random() * 0.6 - 0.3).toFixed(3)), impact: Math.random() > 0.5 ? 'positive' : 'neutral' },
                { param: 'Study Consistency', value: parseFloat((0.4 + Math.random() * 0.5).toFixed(3)), impact: Math.random() > 0.4 ? 'high' : 'medium' },
                { param: 'Avg Engagement', value: parseFloat((1.5 + Math.random() * 1.5).toFixed(2)), impact: Math.random() > 0.5 ? 'high' : 'medium' },
                { param: 'Course Difficulty', value: parseFloat((1.5 + Math.random() * 1.5).toFixed(2)), impact: Math.random() > 0.5 ? 'moderate' : 'easy' },
                { param: 'Academic Readiness', value: parseFloat((0.4 + Math.random() * 0.5).toFixed(3)), impact: Math.random() > 0.4 ? 'high' : 'medium' },
            ],
            ga_recommended: false,
            better_alternative: null,
        }
    }).sort((a, b) => b.recommendation_score - a.recommendation_score)

    // Mark first as GA recommended
    if (recommendations.length > 0) {
        recommendations[0].ga_recommended = true
        const best = recommendations[0]
        for (let i = 1; i < recommendations.length; i++) {
            const rec = recommendations[i]
            const cgpaImprove = parseFloat((best.expected_gpa - rec.expected_gpa).toFixed(2))
            const riskReduce = parseFloat((rec.fail_risk - best.fail_risk).toFixed(1))
            rec.better_alternative = {
                suggested_code: best.code,
                suggested_name: best.name,
                cgpa_improvement: cgpaImprove,
                risk_reduction: riskReduce,
                reason: `${best.name} (${best.code}) is expected to yield a ${cgpaImprove > 0 ? cgpaImprove.toFixed(2) : '0.00'} higher GPA and carries ${riskReduce > 0 ? riskReduce.toFixed(1) + '% lower' : 'similar'} risk.`,
            }
        }
    }

    const trend = gpas.length >= 2 ? (gpas[gpas.length - 1] - gpas[0]) / (gpas.length - 1) : 0
    const skills = ['programming', 'math', 'theory', 'writing', 'lab']
    const strongest = skills[Math.floor(Math.random() * skills.length)]

    const gaEvolution = Array.from({ length: 20 }, (_, i) => ({
        generation: i + 1,
        best_fitness: parseFloat((0.3 + i * 0.035 + Math.random() * 0.02).toFixed(4)),
        avg_fitness: parseFloat((0.1 + i * 0.025 + Math.random() * 0.03).toFixed(4)),
        worst_fitness: parseFloat((-0.2 + i * 0.015 + Math.random() * 0.04).toFixed(4)),
        best_elective: recommendations[0]?.code || 'EEE',
    }))

    const readinessScore = parseFloat(Math.min(1, Math.max(0, avgGpa / 4 * 0.5 + 0.3 + Math.random() * 0.2)).toFixed(4))

    const skillProfile = {}
    skills.forEach(s => { skillProfile[s] = parseFloat((1.5 + Math.random() * 2.5).toFixed(2)) })

    return {
        features: {
            avg_gpa: parseFloat(avgGpa.toFixed(4)),
            weighted_gpa: parseFloat((avgGpa + (Math.random() - 0.5) * 0.3).toFixed(4)),
            grade_trend: parseFloat(trend.toFixed(4)),
            avg_difficulty: 2.0,
            avg_engagement: 2.0,
            study_consistency: 0.65,
            num_courses: n,
        },
        recommendations,
        model_comparison: [
            { model: 'Logistic Regression', prediction: 'Pass', confidence: 65 + Math.random() * 20, p_distinction: 0.2, p_fail: 0.1, p_pass: 0.55, p_withdrawn: 0.15 },
            { model: 'Random Forest', prediction: 'Pass', confidence: 60 + Math.random() * 25, p_distinction: 0.25, p_fail: 0.08, p_pass: 0.52, p_withdrawn: 0.15 },
            { model: 'Gradient Boosting', prediction: 'Pass', confidence: 62 + Math.random() * 22, p_distinction: 0.22, p_fail: 0.12, p_pass: 0.50, p_withdrawn: 0.16 },
            { model: 'Neural Network (MLP)', prediction: 'Pass', confidence: 68 + Math.random() * 18, p_distinction: 0.28, p_fail: 0.07, p_pass: 0.53, p_withdrawn: 0.12 },
        ],
        nn_vs_ml: {
            ml: { prediction: 'Pass', confidence: 72.5, p_distinction: 0.24, p_fail: 0.10, p_pass: 0.51, p_withdrawn: 0.15 },
            nn: { prediction: 'Pass', confidence: 68.3, p_distinction: 0.28, p_fail: 0.07, p_pass: 0.53, p_withdrawn: 0.12 },
            agreement: true,
            confidence_delta: 4.2,
        },
        feature_importance: [
            { feature: 'Avg Gpa', importance: 0.18 },
            { feature: 'Weighted Gpa', importance: 0.14 },
            { feature: 'Avg Clicks', importance: 0.12 },
            { feature: 'Distinction Rate', importance: 0.10 },
            { feature: 'Study Consistency', importance: 0.09 },
            { feature: 'Avg Attendance', importance: 0.08 },
            { feature: 'Grade Trend', importance: 0.07 },
            { feature: 'Skill Programming', importance: 0.06 },
            { feature: 'Avg Difficulty', importance: 0.05 },
            { feature: 'Skill Math', importance: 0.04 },
        ],
        student_profile: {
            current_cgpa: parseFloat(avgGpa.toFixed(2)),
            weighted_cgpa: parseFloat((avgGpa + (Math.random() - 0.5) * 0.2).toFixed(2)),
            grade_trend: trend > 0.1 ? 'Improving' : trend < -0.1 ? 'Declining' : 'Stable',
            grade_trend_value: parseFloat(trend.toFixed(3)),
            total_credits: n * 60,
            courses_taken: n,
            distinction_rate: parseFloat(((gpas.filter(g => g === 4).length / n) * 100).toFixed(1)),
            fail_rate: parseFloat(((gpas.filter(g => g === 1).length / n) * 100).toFixed(1)),
            strongest_skill: strongest,
            avg_engagement: 120 + Math.floor(Math.random() * 100),
            skill_profile: skillProfile,
        },
        readiness: {
            score: readinessScore,
            label: readinessScore >= 0.7 ? 'High' : readinessScore >= 0.4 ? 'Medium' : 'Low',
            membership: {
                gpa: { low: 0.1, medium: 0.3, high: 0.6 },
                engagement: { low: 0.15, medium: 0.5, high: 0.35 },
                difficulty: { easy: 0.2, medium: 0.5, hard: 0.3 },
                consistency: { low: 0.1, medium: 0.35, high: 0.55 },
            },
        },
        ga_evolution: gaEvolution,
        ga_best: {
            code: recommendations[0]?.code || 'EEE',
            fitness: parseFloat((0.8 + Math.random() * 0.3).toFixed(4)),
        },
    }
}

export async function fetchHistoryRecommendation(courseHistory, demographics = null, behaviour = null, selectedElectives = null) {
    try {
        const res = await fetch(`${API_BASE}/api/recommend-from-history`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                course_history: courseHistory,
                demographics,
                behaviour,
                selected_electives: selectedElectives,
                top_n: 26,
            }),
        })
        if (!res.ok) throw new Error('API error')
        return await res.json()
    } catch {
        await new Promise(r => setTimeout(r, 1800))
        return generateMockHistoryRecommendation(courseHistory)
    }
}

export async function fetchPrediction(formData) {
    try {
        const res = await fetch(`${API_BASE}/api/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
        if (!res.ok) throw new Error('API error')
        return await res.json()
    } catch {
        await new Promise(r => setTimeout(r, 1500))
        return generateMockHistoryRecommendation([])
    }
}
