/**
 * Metrics Tracking Script - Language Limitation Bypassing Tools
 * Tracks and analyzes concept generation metrics
 */

const MetricsTracker = {
    // Configuration
    config: {
        targetConceptsPerMonth: 47,
        targetProblemSolvingImprovement: 83,
        analysisWindows: [7, 30, 90] // Days
    },
    
    // State storage
    state: {
        startDate: null,
        conceptHistory: [],
        problemSolvingTests: []
    },
    
    // Initialize the metrics tracker
    init: function() {
        console.log('Initializing Metrics Tracker...');
        
        // Load saved metrics data if available
        this.loadMetricsData();
        
        // If no start date, set to now
        if (!this.state.startDate) {
            this.state.startDate = new Date();
        }
        
        // Schedule regular metrics updates
        setInterval(() => this.updateMetricsDisplay(), 60000); // Every minute
    },
    
    // Load metrics data from storage
    loadMetricsData: function() {
        try {
            const savedData = localStorage.getItem('linguisticLabMetrics');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                
                // Parse dates properly
                if (parsedData.startDate) {
                    parsedData.startDate = new Date(parsedData.startDate);
                }
                
                if (parsedData.conceptHistory) {
                    parsedData.conceptHistory.forEach(entry => {
                        entry.date = new Date(entry.date);
                    });
                }
                
                if (parsedData.problemSolvingTests) {
                    parsedData.problemSolvingTests.forEach(test => {
                        test.date = new Date(test.date);
                    });
                }
                
                this.state = parsedData;
            }
        } catch (error) {
            console.error('Error loading metrics data:', error);
        }
    },
    
    // Save metrics data to storage
    saveMetricsData: function() {
        try {
            localStorage.setItem('linguisticLabMetrics', JSON.stringify(this.state));
        } catch (error) {
            console.error('Error saving metrics data:', error);
        }
    },
    
    // Record a new concept creation
    recordConceptCreation: function(concept) {
        if (!concept) return;
        
        // Add to concept history
        this.state.conceptHistory.push({
            id: concept.id || `concept-${Date.now()}`,
            name: concept.name,
            constraint: concept.constraint,
            date: new Date()
        });
        
        // Save updated metrics
        this.saveMetricsData();
        
        // Update display
        this.updateMetricsDisplay();
    },
    
    // Record a problem solving test result
    recordProblemSolvingTest: function(problemData) {
        if (!problemData || typeof problemData.improvement !== 'number') return;
        
        // Add to problem solving tests
        this.state.problemSolvingTests.push({
            id: `test-${Date.now()}`,
            problem: problemData.problem,
            improvement: problemData.improvement,
            concepts: problemData.concepts || [],
            date: new Date()
        });
        
        // Save updated metrics
        this.saveMetricsData();
        
        // Update display
        this.updateMetricsDisplay();
        // Calculate metrics for a given time window
    calculateMetrics: function(days) {
        const now = new Date();
        const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
        
        // Filter concepts created within the time window
        const recentConcepts = this.state.conceptHistory.filter(concept => 
            concept.date >= startDate
        );
        
        // Calculate concepts per month rate
        const daysInPeriod = days;
        const conceptsCreated = recentConcepts.length;
        const conceptsPerMonth = (conceptsCreated / daysInPeriod) * 30;
        
        // Calculate progress toward target
        const progressPercent = Math.min(100, (conceptsPerMonth / this.config.targetConceptsPerMonth) * 100);
        
        // Calculate concept distribution by constraint type
        const constraintDistribution = {};
        recentConcepts.forEach(concept => {
            constraintDistribution[concept.constraint] = (constraintDistribution[concept.constraint] || 0) + 1;
        });
        
        // Calculate average concepts per day
        const conceptsPerDay = conceptsCreated / daysInPeriod;
        
        // Calculate problem solving improvement if tests are available
        const recentTests = this.state.problemSolvingTests.filter(test => 
            test.date >= startDate
        );
        
        let avgImprovement = 0;
        let improvementProgress = 0;
        
        if (recentTests.length > 0) {
            avgImprovement = recentTests.reduce((sum, test) => sum + test.improvement, 0) / recentTests.length;
            improvementProgress = Math.min(100, (avgImprovement / this.config.targetProblemSolvingImprovement) * 100);
        }
        
        return {
            period: days,
            conceptsCreated: conceptsCreated,
            conceptsPerDay: conceptsPerDay,
            conceptsPerMonth: conceptsPerMonth,
            progressPercent: progressPercent,
            constraintDistribution: constraintDistribution,
            problemSolvingTests: recentTests.length,
            averageImprovement: avgImprovement,
            improvementProgress: improvementProgress
        };
    },
    
    // Update the metrics display
    updateMetricsDisplay: function() {
        // Calculate days active
        const now = new Date();
        const diffTime = Math.abs(now - this.state.startDate);
        const daysActive = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Update days active
        const daysActiveElement = document.getElementById('days-active');
        if (daysActiveElement) {
            daysActiveElement.textContent = daysActive;
        }
        
        // Update concept count
        const conceptCountElement = document.getElementById('concept-count');
        if (conceptCountElement) {
            conceptCountElement.textContent = this.state.conceptHistory.length;
        }
        
        // Calculate concepts per month
        let conceptsPerMonth = 0;
        if (daysActive > 0) {
            conceptsPerMonth = Math.round((this.state.conceptHistory.length / daysActive) * 30);
        }
        
        // Update concepts per month
        const conceptsPerMonthElement = document.getElementById('concepts-per-month');
        if (conceptsPerMonthElement) {
            conceptsPerMonthElement.textContent = conceptsPerMonth;
        }
        
        // If we have a detailed metrics section, update it
        const detailedMetrics = document.getElementById('detailed-metrics');
        if (detailedMetrics) {
            this.updateDetailedMetrics(detailedMetrics);
        }
    },
    
    // Update detailed metrics display
    updateDetailedMetrics: function(container) {
        // Calculate metrics for each analysis window
        const metricSets = this.config.analysisWindows.map(days => this.calculateMetrics(days));
        
        // Create metrics display
        let html = '<div class="metrics-container">';
        
        // Add summary metrics
        html += '<div class="metrics-section">';
        html += '<h3>Summary Metrics</h3>';
        
        // Add total concepts
        html += `
            <div class="metric-item">
                <div class="metric-label">Total Concepts Created</div>
                <div class="metric-value">${this.state.conceptHistory.length}</div>
            </div>
        `;
        
        // Add days active
        const now = new Date();
        const diffTime = Math.abs(now - this.state.startDate);
        const daysActive = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        html += `
            <div class="metric-item">
                <div class="metric-label">Days Active</div>
                <div class="metric-value">${daysActive}</div>
            </div>
        `;
        
        // Add lifetime concepts per month
        let lifetimeConceptsPerMonth = 0;
        if (daysActive > 0) {
            lifetimeConceptsPerMonth = Math.round((this.state.conceptHistory.length / daysActive) * 30);
        }
        
        html += `
            <div class="metric-item">
                <div class="metric-label">Lifetime Concepts/Month</div>
                <div class="metric-value">${lifetimeConceptsPerMonth}</div>
                <div class="metric-progress">
                    <div class="progress-bar" style="width: ${Math.min(100, (lifetimeConceptsPerMonth / this.config.targetConceptsPerMonth) * 100)}%"></div>
                </div>
                <div class="metric-target">Target: ${this.config.targetConceptsPerMonth}/month</div>
            </div>
        `;
        
        html += '</div>'; // Close summary section
        
        // Add period metrics
        metricSets.forEach(metrics => {
            html += '<div class="metrics-section">';
            html += `<h3>Last ${metrics.period} Days</h3>`;
            
            // Concepts created
            html += `
                <div class="metric-item">
                    <div class="metric-label">Concepts Created</div>
                    <div class="metric-value">${metrics.conceptsCreated}</div>
                </div>
            `;
            
            // Concepts per month
            html += `
                <div class="metric-item">
                    <div class="metric-label">Concepts/Month Rate</div>
                    <div class="metric-value">${metrics.conceptsPerMonth.toFixed(1)}</div>
                    <div class="metric-progress">
                        <div class="progress-bar" style="width: ${metrics.progressPercent}%"></div>
                    </div>
                    <div class="metric-target">Target: ${this.config.targetConceptsPerMonth}/month</div>
                </div>
            `;
            
            // Problem solving improvement
            if (metrics.problemSolvingTests > 0) {
                html += `
                    <div class="metric-item">
                        <div class="metric-label">Problem Solving Improvement</div>
                        <div class="metric-value">${metrics.averageImprovement.toFixed(1)}%</div>
                        <div class="metric-progress">
                            <div class="progress-bar" style="width: ${metrics.improvementProgress}%"></div>
                        </div>
                        <div class="metric-target">Target: ${this.config.targetProblemSolvingImprovement}% improvement</div>
                    </div>
                `;
            }
            
            html += '</div>'; // Close period section
        });
        
        html += '</div>'; // Close metrics container
        
        container.innerHTML = html;
    },
    
    // Generate metrics report
    generateReport: function() {
        const metrics = {
            summary: {
                startDate: this.state.startDate,
                daysActive: Math.ceil(Math.abs(new Date() - this.state.startDate) / (1000 * 60 * 60 * 24)),
                totalConcepts: this.state.conceptHistory.length,
                problemSolvingTests: this.state.problemSolvingTests.length
            },
            periods: {}
        };
        
        // Add metrics for each analysis window
        this.config.analysisWindows.forEach(days => {
            metrics.periods[days] = this.calculateMetrics(days);
        });
        
        return metrics;
    },
    
    // Export metrics data
    exportMetrics: function() {
        const report = this.generateReport();
        const jsonString = JSON.stringify(report, null, 2);
        
        // Create download link
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `linguistic-lab-metrics-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    },
    
    // Reset metrics (for testing)
    resetMetrics: function() {
        if (confirm('Are you sure you want to reset all metrics data? This cannot be undone.')) {
            this.state = {
                startDate: new Date(),
                conceptHistory: [],
                problemSolvingTests: []
            };
            
            this.saveMetricsData();
            this.updateMetricsDisplay();
            
            return true;
        }
        
        return false;
    }
};

// Initialize when document loads
document.addEventListener('DOMContentLoaded', function() {
    MetricsTracker.init();
});