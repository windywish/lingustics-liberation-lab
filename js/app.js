/**
 * Main Application Script - Language Limitation Bypassing Tools
 * Controls core application functionality and UI interactions
 */

const LinguisticLab = {
    // Application state
    state: {
        currentSection: 'concept-lab',
        userConcepts: [],
        communityConcepts: [],
        activeTool: null,
        selectedConstraint: 'subject-object',
        canvasElements: [],
        selectedConcepts: [],
        activeSession: null,
        conceptCounter: 0,
        startDate: new Date()
    },
    
    // Initialize the application
    init: function() {
        console.log('Initializing Linguistic Liberation Lab...');
        this.bindUIEvents();
        this.loadInitialData();
        this.updateMetrics();
        this.setupWorkspace();
        
        // Set interval for concept rate calculation
        setInterval(() => this.updateMetrics(), 60000); // Update every minute
    },
    
    // Bind all UI event handlers
    bindUIEvents: function() {
        // Navigation buttons
        document.querySelectorAll('#main-nav .nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target.getAttribute('data-target');
                this.changeSection(target);
            });
        });
        
        // Concept Lab events
        document.getElementById('constraint-selector').addEventListener('change', (e) => {
            this.state.selectedConstraint = e.target.value;
            this.updateWorkspace();
        });
        
        document.getElementById('generate-btn').addEventListener('click', () => {
            this.generateConcepts();
        });
        
        document.querySelectorAll('.tool-item').forEach(tool => {
            tool.addEventListener('click', (e) => {
                this.selectTool(e.target.getAttribute('data-tool'));
            });
        });
        
        document.getElementById('save-concept').addEventListener('click', () => {
            this.showConceptModal();
        });
        
        document.getElementById('share-concept').addEventListener('click', () => {
            this.shareWithCommunity();
        });
        
        // Concept Modal events
        document.querySelector('.close-modal').addEventListener('click', () => {
            this.hideConceptModal();
        });
        
        document.querySelector('.cancel-btn').addEventListener('click', () => {
            this.hideConceptModal();
        });
        
        document.getElementById('concept-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveNewConcept();
        });
        
        // Setup workspace interactions
        const workspace = document.getElementById('concept-workspace');
        workspace.addEventListener('click', (e) => {
            if (e.target === workspace && this.state.activeTool) {
                this.addElementToWorkspace(e);
            }
        });
    },
    
    // Load initial application data
    loadInitialData: function() {
        // Load any saved user concepts from storage
        const savedConcepts = localStorage.getItem('userConcepts');
        if (savedConcepts) {
            this.state.userConcepts = JSON.parse(savedConcepts);
            this.state.conceptCounter = this.state.userConcepts.length;
            this.updateConceptList();
        }
        
        // Load seed community concepts
        if (window.seedConcepts && Array.isArray(window.seedConcepts)) {
            this.state.communityConcepts = window.seedConcepts;
            this.updateCommunityFeed();
        }
    },
    
    // Change active section
    changeSection: function(sectionId) {
        // Update navigation buttons
        document.querySelectorAll('#main-nav .nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`.nav-btn[data-target="${sectionId}"]`).classList.add('active');
        
        // Update visible section
        document.querySelectorAll('main section').forEach(section => {
            section.classList.remove('active-section');
        });
        document.getElementById(sectionId).classList.add('active-section');
        
        // Update application state
        this.state.currentSection = sectionId;
        
        // Run section-specific initialization if needed
        switch(sectionId) {
            case 'visualization':
                this.initVisualization();
                break;
            case 'community':
                this.updateCommunityFeed();
                break;
            case 'applications':
                this.updateApplicableConcepts();
                break;
        }
    },
    
    // Setup the concept workspace
    setupWorkspace: function() {
        const workspace = document.getElementById('concept-workspace');
        workspace.innerHTML = `
            <div class="workspace-instructions">
                <p>Select a tool from the palette below and click in this area to add elements</p>
                <p>Arrange elements to form concepts that transcend standard language limitations</p>
            </div>
        `;
    },
    
    // Update workspace based on selected constraint
    updateWorkspace: function() {
        // Clear workspace
        this.state.canvasElements = [];
        const workspace = document.getElementById('concept-workspace');
        
        // Add constraint-specific guidance
        let instructions = '';
        switch(this.state.selectedConstraint) {
            case 'subject-object':
                instructions = 'Create concepts that transcend the separation between subject and object';
                break;
            case 'linear-time':
                instructions = 'Design concepts that exist outside linear temporal progression';
                break;
            case 'causality':
                instructions = 'Form concepts that bypass simple cause-effect relationships';
                break;
            case 'binary-logic':
                instructions = 'Develop concepts that operate beyond binary true/false logic';
                break;
            case 'perspectives':
                instructions = 'Create concepts that transcend single-perspective limitations';
                break;
        }
        
        workspace.innerHTML = `
            <div class="workspace-instructions">
                <p>${instructions}</p>
            </div>
        `;
    },
    
    // Select a tool from the palette
    selectTool: function(toolType) {
        // Update UI
        document.querySelectorAll('.tool-item').forEach(tool => {
            tool.classList.remove('active');
        });
        
        if (this.state.activeTool === toolType) {
            // Deselect if clicking the same tool
            this.state.activeTool = null;
        } else {
            // Select the new tool
            document.querySelector(`.tool-item[data-tool="${toolType}"]`).classList.add('active');
            this.state.activeTool = toolType;
        }
    },
    
    // Add element to workspace when clicking
    addElementToWorkspace: function(e) {
        if (!this.state.activeTool) return;
        
        const workspace = document.getElementById('concept-workspace');
        const rect = workspace.getBoundingClientRect();
        
        // Calculate position relative to workspace
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Create unique ID for the element
        const elementId = `element-${Date.now()}`;
        
        // Get label based on the constraint and tool type
        const label = this.getElementLabel(this.state.activeTool, this.state.selectedConstraint);
        
        // Create element and add to workspace
        const element = document.createElement('div');
        element.id = elementId;
        element.className = `concept-element ${this.state.activeTool}-element`;
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        element.textContent = label;
        element.setAttribute('data-type', this.state.activeTool);
        
        // Make element draggable
        this.makeElementDraggable(element);
        
        // Add to workspace
        workspace.appendChild(element);
        
        // Add to state
        this.state.canvasElements.push({
            id: elementId,
            type: this.state.activeTool,
            label: label,
            x: x,
            y: y
        });
    },
    
    // Make an element draggable within the workspace
    makeElementDraggable: function(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        element.onmousedown = dragMouseDown;
        
        function dragMouseDown(e) {
            e.preventDefault();
            // Get the mouse cursor position at startup
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // Call a function whenever the cursor moves
            document.onmousemove = elementDrag;
        }
        
        function elementDrag(e) {
            e.preventDefault();
            // Calculate the new cursor position
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // Set the element's new position
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }
        
        function closeDragElement() {
            // Stop moving when mouse button is released
            document.onmouseup = null;
            document.onmousemove = null;
        }
    },
    
    // Get appropriate label for an element based on constraint and tool type
    getElementLabel: function(toolType, constraint) {
        const labels = {
            'subject-object': {
                'entity': 'Subject-Object',
                'relation': 'Non-dualistic Binding',
                'property': 'Shared Attribute',
                'process': 'Subject-Object Merger',
                'context': 'Unity Field'
            },
            'linear-time': {
                'entity': 'Time-Independent',
                'relation': 'Asynchronous Link',
                'property': 'Temporal Invariant',
                'process': 'Non-sequential Flow',
                'context': 'Time Field'
            },
            'causality': {
                'entity': 'Acausal Node',
                'relation': 'Mutual Emergence',
                'property': 'Uncaused Attribute',
                'process': 'Circular Causation',
                'context': 'Causality Field'
            },
            'binary-logic': {
                'entity': 'Multi-valued Object',
                'relation': 'Superposition Link',
                'property': 'Quantum Attribute',
                'process': 'State Fluidity',
                'context': 'Logic Field'
            },
            'perspectives': {
                'entity': 'Multi-perspective',
                'relation': 'Viewpoint Fusion',
                'property': 'Perspective-invariant',
                'process': 'Observer Merger',
                'context': 'Perspective Field'
            }
        };
        
        return labels[constraint][toolType] || `${toolType}`;
    },
    
    // Generate concepts based on workspace elements
    generateConcepts: function() {
        if (this.state.canvasElements.length < 2) {
            alert('Please add at least two elements to the workspace to generate concepts.');
            return;
        }
        
        // Generate concepts using the concept generator
        if (typeof ConceptGenerator !== 'undefined') {
            const concepts = ConceptGenerator.generateFromElements(
                this.state.canvasElements,
                this.state.selectedConstraint
            );
            
            // Add concepts to the list
            this.addGeneratedConcepts(concepts);
        } else {
            // Fallback if generator not loaded
            this.addGeneratedConcepts([{
                name: `New Concept ${this.state.conceptCounter + 1}`,
                description: `A concept that transcends ${this.state.selectedConstraint} limitations`,
                constraint: this.state.selectedConstraint,
                elements: [...this.state.canvasElements]
            }]);
        }
    },
    
    // Add generated concepts to the list
    addGeneratedConcepts: function(concepts) {
        if (!concepts || concepts.length === 0) return;
        
        const conceptList = document.getElementById('concept-list');
        
        concepts.forEach(concept => {
            // Increment counter
            this.state.conceptCounter++;
            
            // Add timestamp
            concept.created = new Date();
            
            // Add to state
            this.state.userConcepts.push(concept);
            
            // Add to UI
            const conceptItem = document.createElement('div');
            conceptItem.className = 'concept-item';
            conceptItem.innerHTML = `
                <div class="concept-name">${concept.name}</div>
                <div class="concept-description">${concept.description}</div>
                <div class="concept-tags">
                    <span class="concept-tag">${concept.constraint}</span>
                </div>
            `;
            
            conceptList.appendChild(conceptItem);
        });
        
        // Save to local storage
        this.saveConceptsToStorage();
        
        // Update metrics
        this.updateMetrics();
    },
    
    // Update the concept list UI
    updateConceptList: function() {
        const conceptList = document.getElementById('concept-list');
        conceptList.innerHTML = '';
        
        if (this.state.userConcepts.length === 0) {
            conceptList.innerHTML = '<div class="empty-message">No concepts discovered yet. Use the workspace to generate new concepts.</div>';
            return;
        }
        
        this.state.userConcepts.forEach(concept => {
            const conceptItem = document.createElement('div');
            conceptItem.className = 'concept-item';
            conceptItem.innerHTML = `
                <div class="concept-name">${concept.name}</div>
                <div class="concept-description">${concept.description}</div>
                <div class="concept-tags">
                    <span class="concept-tag">${concept.constraint}</span>
                </div>
            `;
            
            conceptList.appendChild(conceptItem);
        });
    },
    
    // Show modal to define a new concept
    showConceptModal: function() {
        if (this.state.canvasElements.length < 2) {
            alert('Please add at least two elements to the workspace to create a concept.');
            return;
        }
        
        // Populate component tags
        const componentsContainer = document.getElementById('concept-components');
        componentsContainer.innerHTML = '';
        
        this.state.canvasElements.forEach(element => {
            const componentTag = document.createElement('span');
            componentTag.className = 'component-tag';
            componentTag.textContent = element.label;
            componentsContainer.appendChild(componentTag);
        });
        
        // Set up limitation tags
        const limitationsContainer = document.getElementById('limitation-tags');
        limitationsContainer.innerHTML = '';
        
        const limitationTag = document.createElement('span');
        limitationTag.className = 'limitation-tag';
        
        const limitationLabel = {
            'subject-object': 'Subject-Object Separation',
            'linear-time': 'Linear Temporality',
            'causality': 'Direct Causality',
            'binary-logic': 'Binary Logic',
            'perspectives': 'Single Perspective'
        }[this.state.selectedConstraint] || this.state.selectedConstraint;
        
        limitationTag.textContent = limitationLabel;
        limitationsContainer.appendChild(limitationTag);
        
        // Auto-generate a name based on elements
        const conceptName = document.getElementById('concept-name');
        conceptName.value = this.generateConceptName();
        
        // Show modal
        document.getElementById('concept-modal').style.display = 'block';
    },
    
    // Hide the concept modal
    hideConceptModal: function() {
        document.getElementById('concept-modal').style.display = 'none';
    },
    
    // Generate a concept name based on workspace elements
    generateConceptName: function() {
        // Get the element types and counts
        const typeCounts = {};
        this.state.canvasElements.forEach(element => {
            typeCounts[element.type] = (typeCounts[element.type] || 0) + 1;
        });
        
        // Create prefix based on constraint
        const prefixMap = {
            'subject-object': 'Unified',
            'linear-time': 'Atemporal',
            'causality': 'Acausal',
            'binary-logic': 'Quantum',
            'perspectives': 'Omniperspective'
        };
        
        const prefix = prefixMap[this.state.selectedConstraint] || 'Trans';
        
        // Generate a name based on dominant elements
        let dominantType = Object.keys(typeCounts).reduce((a, b) => 
            typeCounts[a] > typeCounts[b] ? a : b);
        
        const suffixMap = {
            'entity': 'Being',
            'relation': 'Connection',
            'property': 'Attribute',
            'process': 'Flow',
            'context': 'Field'
        };
        
        const suffix = suffixMap[dominantType] || 'Concept';
        
        return `${prefix}-${suffix} ${this.state.conceptCounter + 1}`;
    },
    
    // Save a new concept from the modal form
    saveNewConcept: function() {
        const name = document.getElementById('concept-name').value;
        const description = document.getElementById('concept-description').value;
        
        if (!name || !description) {
            alert('Please provide both a name and description for the concept.');
            return;
        }
        
        // Create concept object
        const newConcept = {
            id: `concept-${Date.now()}`,
            name: name,
            description: description,
            constraint: this.state.selectedConstraint,
            elements: [...this.state.canvasElements],
            created: new Date()
        };
        
        // Add to state
        this.state.userConcepts.push(newConcept);
        this.state.conceptCounter++;
        
        // Update UI
        this.updateConceptList();
        
        // Save to storage
        this.saveConceptsToStorage();
        
        // Hide modal
        this.hideConceptModal();
        
        // Clear workspace for next concept
        this.clearWorkspace();
        
        // Update metrics
        this.updateMetrics();
    },
    
    // Clear the concept workspace
    clearWorkspace: function() {
        this.state.canvasElements = [];
        this.updateWorkspace();
    },
    
    // Share a concept with the community
    shareWithCommunity: function() {
        if (this.state.userConcepts.length === 0) {
            alert('You must save a concept before sharing it with the community.');
            return;
        }
        
        // Get the latest user concept
        const conceptToShare = this.state.userConcepts[this.state.userConcepts.length - 1];
        
        // Add user info
        const sharedConcept = {
            ...conceptToShare,
            author: 'Current User',
            shared: new Date()
        };
        
        // Add to community concepts
        this.state.communityConcepts.unshift(sharedConcept);
        
        // Limit community concepts to keep performance reasonable
        if (this.state.communityConcepts.length > 50) {
            this.state.communityConcepts = this.state.communityConcepts.slice(0, 50);
        }
        
        // Update community feed if visible
        if (this.state.currentSection === 'community') {
            this.updateCommunityFeed();
        }
        
        // Show feedback
        alert('Your concept has been shared with the community!');
    },
    
    // Update the community feed
    updateCommunityFeed: function() {
        const conceptFeed = document.getElementById('community-concepts');
        if (!conceptFeed) return;
        
        conceptFeed.innerHTML = '';
        
        if (this.state.communityConcepts.length === 0) {
            conceptFeed.innerHTML = '<div class="empty-message">No community concepts yet. Be the first to share!</div>';
            return;
        }
        
        this.state.communityConcepts.forEach(concept => {
            const feedItem = document.createElement('div');
            feedItem.className = 'feed-concept';
            
            // Format date
            const sharedDate = concept.shared ? new Date(concept.shared) : new Date();
            const dateStr = sharedDate.toLocaleDateString();
            
            feedItem.innerHTML = `
                <div class="concept-header">
                    <div class="concept-name">${concept.name}</div>
                    <div class="concept-author">${concept.author || 'Anonymous'} · ${dateStr}</div>
                </div>
                <div class="concept-description">${concept.description}</div>
                <div class="concept-tags">
                    <span class="concept-tag">${concept.constraint}</span>
                </div>
            `;
            
            conceptFeed.appendChild(feedItem);
        });
        
        // Update community stats
        document.getElementById('community-members').textContent = Math.floor(Math.random() * 100) + 50; // Simulated
        document.getElementById('shared-concepts').textContent = this.state.communityConcepts.length;
        document.getElementById('concept-adoption').textContent = Math.floor(Math.random() * 40) + 60 + '%'; // Simulated
    },
    
    // Initialize the visualization section
    initVisualization: function() {
        const visualizationConcepts = document.getElementById('visualization-concepts');
        if (!visualizationConcepts) return;
        
        visualizationConcepts.innerHTML = '';
        
        if (this.state.userConcepts.length === 0) {
            visualizationConcepts.innerHTML = '<div class="empty-message">No concepts available to visualize. Create concepts in the Concept Lab first.</div>';
            return;
        }
        
        this.state.userConcepts.forEach(concept => {
            const conceptItem = document.createElement('div');
            conceptItem.className = 'concept-check-item';
            conceptItem.innerHTML = `
                <input type="checkbox" id="viz-${concept.id}" value="${concept.id}">
                <label for="viz-${concept.id}">${concept.name}</label>
            `;
            
            visualizationConcepts.appendChild(conceptItem);
            
            // Add event listener for checkbox
            const checkbox = conceptItem.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.state.selectedConcepts.push(concept.id);
                } else {
                    this.state.selectedConcepts = this.state.selectedConcepts.filter(id => id !== concept.id);
                }
                
                this.updateVisualization();
            });
        });
    },
    
    // Update the visualization based on selected concepts
    updateVisualization: function() {
        const canvas = document.getElementById('visualization-canvas');
        if (!canvas) return;
        
        if (this.state.selectedConcepts.length === 0) {
            canvas.innerHTML = '<div class="placeholder-text">Select concepts to visualize</div>';
            return;
        }
        
        // Get selected visualization mode
        const mode = document.getElementById('visualization-mode').value;
        
        // Get the selected concepts
        const selectedConcepts = this.state.userConcepts.filter(concept => 
            this.state.selectedConcepts.includes(concept.id));
        
        // If Visualizer module exists, use it
        if (typeof Visualizer !== 'undefined') {
            Visualizer.renderVisualization(canvas, selectedConcepts, mode);
        } else {
            // Simple fallback visualization
            canvas.innerHTML = `
                <div class="visualization-placeholder">
                    <p>Visualizing ${selectedConcepts.length} concepts in ${mode} mode</p>
                    <p>Selected concepts: ${selectedConcepts.map(c => c.name).join(', ')}</p>
                </div>
            `;
        }
    },
    
    // Update application metrics
    updateMetrics: function() {
        // Days active
        const now = new Date();
        const diffTime = Math.abs(now - this.state.startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        document.getElementById('days-active').textContent = diffDays;
        
        // Concept count
        document.getElementById('concept-count').textContent = this.state.conceptCounter;
        
        // Concepts per month rate
        let conceptsPerMonth = 0;
        if (diffDays > 0) {
            conceptsPerMonth = Math.round(this.state.conceptCounter * (30 / diffDays));
        }
        document.getElementById('concepts-per-month').textContent = conceptsPerMonth;
    },
    
    // Update applicable concepts for problem solving
    updateApplicableConcepts: function() {
        const applicableConcepts = document.getElementById('applicable-concepts');
        if (!applicableConcepts) return;
        
        applicableConcepts.innerHTML = '';
        
        if (this.state.userConcepts.length === 0) {
            applicableConcepts.innerHTML = '<div class="empty-message">No concepts available. Create concepts in the Concept Lab first.</div>';
            return;
        }
        
        this.state.userConcepts.forEach(concept => {
            const conceptPill = document.createElement('div');
            conceptPill.className = 'concept-pill';
            conceptPill.textContent = concept.name;
            conceptPill.setAttribute('data-id', concept.id);
            
            conceptPill.addEventListener('click', () => {
                conceptPill.classList.toggle('selected');
                this.applyConceptToSolution(concept);
            });
            
            applicableConcepts.appendChild(conceptPill);
        });
        
        // Update application area counts (simulated for demo)
        document.querySelectorAll('.area-card .concept-count').forEach(count => {
            const randomCount = Math.floor(Math.random() * Math.min(5, this.state.conceptCounter));
            count.textContent = `${randomCount} concepts applied`;
        });
    },
    
    // Apply a concept to the solution space
    applyConceptToSolution: function(concept) {
        const solutionSpace = document.getElementById('solution-space');
        if (!solutionSpace) return;
        
        const problemText = document.querySelector('#problem-description textarea').value;
        
        if (!problemText) {
            solutionSpace.innerHTML = '<p class="placeholder-text">Enter a problem description to apply concepts</p>';
            return;
        }
        
        // Get all selected concepts
        const selectedPills = document.querySelectorAll('.concept-pill.selected');
        if (selectedPills.length === 0) {
            solutionSpace.innerHTML = '<p class="placeholder-text">Select concepts to apply to this problem</p>';
            return;
        }
        
        // Generate a solution based on problem and concepts
        const selectedIds = Array.from(selectedPills).map(pill => pill.getAttribute('data-id'));
        const selectedConcepts = this.state.userConcepts.filter(c => selectedIds.includes(c.id));
        
        // If we have the patterns module, use it for solution generation
        if (typeof PatternAnalyzer !== 'undefined') {
            const solution = PatternAnalyzer.generateSolution(problemText, selectedConcepts);
            solutionSpace.innerHTML = `
                <div class="solution-content">
                    <h4>Solution Approach</h4>
                    <p>${solution.approach}</p>
                    <h4>Novel Insights</h4>
                    <p>${solution.insights}</p>
                </div>
            `;
        } else {
            // Simple fallback
            solutionSpace.innerHTML = `
                <div class="solution-content">
                    <h4>Solution Approach</h4>
                    <p>Applying ${selectedConcepts.length} concepts to problem: "${problemText.substring(0, 50)}..."</p>
                    <h4>Concepts Applied</h4>
                    <ul>
                        ${selectedConcepts.map(c => `<li>${c.name}: ${c.description}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
    },
    
    // Save concepts to local storage
    saveConceptsToStorage: function() {
        try {
            localStorage.setItem('userConcepts', JSON.stringify(this.state.userConcepts));
        } catch (error) {
            console.error('Error saving concepts to storage:', error);
        }
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    LinguisticLab.init();
});