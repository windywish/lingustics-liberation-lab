/**
 * Community Interaction Script - Language Limitation Bypassing Tools
 * Handles community features and collaborative concept development
 */

const CommunityManager = {
    // Configuration
    config: {
        maxSessions: 5,
        sessionTimeout: 30 * 60 * 1000, // 30 minutes
        maxSessionMembers: 8
    },
    
    // Active state
    state: {
        activeSessions: [],
        currentSession: null,
        sessionMembers: [],
        sessionMessages: []
    },
    
    // Initialize community features
    init: function() {
        console.log('Initializing Community Manager...');
        this.loadSampleData();
        this.bindEvents();
        
        // Start polling for updates
        setInterval(() => this.pollSessionUpdates(), 5000);
    },
    
    // Load sample community data for demonstration
    loadSampleData: function() {
        // Sample active sessions
        this.state.activeSessions = [
            {
                id: 'session-1',
                name: 'Temporal Paradox Exploration',
                members: 3,
                concepts: 2,
                created: new Date(Date.now() - 45 * 60 * 1000)
            },
            {
                id: 'session-2',
                name: 'Subject-Object Fusion Workshop',
                members: 5,
                concepts: 7,
                created: new Date(Date.now() - 20 * 60 * 1000)
            },
            {
                id: 'session-3',
                name: 'Multi-value Logic Applications',
                members: 2,
                concepts: 3,
                created: new Date(Date.now() - 5 * 60 * 1000)
            }
        ];
    },
    
    // Bind event handlers
    bindEvents: function() {
        // Join session button
        const joinButton = document.getElementById('join-session');
        if (joinButton) {
            joinButton.addEventListener('click', () => this.showJoinDialog());
        }
        
        // Create session button
        const createButton = document.getElementById('create-session');
        if (createButton) {
            createButton.addEventListener('click', () => this.showCreateDialog());
        }
    },
    
    // Show dialog to join an existing session
    showJoinDialog: function() {
        // Create modal for joining a session
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        
        let sessionsHTML = '';
        if (this.state.activeSessions.length === 0) {
            sessionsHTML = '<p>No active sessions found. Create a new session instead.</p>';
        } else {
            sessionsHTML = `
                <div class="session-list">
                    ${this.state.activeSessions.map(session => `
                        <div class="session-item" data-id="${session.id}">
                            <div class="session-info">
                                <div class="session-name">${session.name}</div>
                                <div class="session-stats">
                                    <span>${session.members} members</span>
                                    <span>•</span>
                                    <span>${session.concepts} concepts</span>
                                </div>
                            </div>
                            <button class="join-btn" data-id="${session.id}">Join</button>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Join Collaborative Session</h2>
                <div class="modal-body">
                    <p>Join an active collaborative session to develop concepts with other users.</p>
                    ${sessionsHTML}
                </div>
                <div class="modal-footer">
                    <button class="secondary-btn cancel-btn">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            modal.remove();
        });
        
        const joinButtons = modal.querySelectorAll('.join-btn');
        joinButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const sessionId = e.target.getAttribute('data-id');
                this.joinSession(sessionId);
                modal.remove();
            });
        });
    },
    
    // Show dialog to create a new session
    showCreateDialog: function() {
        // Create modal for creating a session
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Create Collaborative Session</h2>
                <form id="create-session-form">
                    <div class="form-group">
                        <label for="session-name">Session Name</label>
                        <input type="text" id="session-name" placeholder="Give your session a descriptive name">
                    </div>
                    <div class="form-group">
                        <label for="session-type">Concept Type Focus</label>
                        <select id="session-type">
                            <option value="subject-object">Subject-Object Integration</option>
                            <option value="linear-time">Non-linear Temporality</option>
                            <option value="causality">Non-causal Relationships</option>
                            <option value="binary-logic">Multi-valued Logic</option>
                            <option value="perspectives">Multi-perspective Concepts</option>
                            <option value="mixed">Mixed Constraints</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="session-description">Session Description</label>
                        <textarea id="session-description" placeholder="Describe what you hope to explore in this session..."></textarea>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="session-public" checked>
                            Make this session publicly joinable
                        </label>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="secondary-btn cancel-btn">Cancel</button>
                        <button type="submit" class="primary-btn">Create Session</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            modal.remove();
        });
        
        const form = modal.querySelector('#create-session-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('session-name').value;
            const type = document.getElementById('session-type').value;
            const description = document.getElementById('session-description').value;
            const isPublic = document.getElementById('session-public').checked;
            
            if (!name) {
                alert('Please provide a session name.');
                return;
            }
            
            this.createSession(name, type, description, isPublic);
            modal.remove();
        });
    },
    
    // Join an existing collaborative session
    joinSession: function(sessionId) {
        const session = this.state.activeSessions.find(s => s.id === sessionId);
        if (!session) {
            alert('Session not found or no longer active.');
            return;
        }
        
        console.log(`Joining session: ${session.name}`);
        
        // Set current session
        this.state.currentSession = session;
        
        // Update UI to show session interface
        this.showSessionInterface(session);
        
        // Simulate joining process
        this.simulateJoiningSession(session);
    },
    
    // Create a new collaborative session
    createSession: function(name, type, description, isPublic) {
        console.log(`Creating session: ${name}, Type: ${type}, Public: ${isPublic}`);
        
        // Create new session object
        const newSession = {
            id: `session-${Date.now()}`,
            name: name,
            type: type,
            description: description || 'No description provided.',
            isPublic: isPublic,
            members: 1, // Creator is first member
            concepts: 0,
            created: new Date()
        };
        
        // Add to active sessions
        this.state.activeSessions.push(newSession);
        
        // Set as current session
        this.state.currentSession = newSession;
        
        // Update UI to show session interface
        this.showSessionInterface(newSession);
        
        // Start a new session with just the creator
        this.state.sessionMembers = [
            { id: 'user-self', name: 'You (Host)', isHost: true }
        ];
        
        this.state.sessionMessages = [
            {
                type: 'system',
                text: `Session "${name}" created. You are the host.`,
                timestamp: new Date()
            }
        ];
        
        // Update collaboration area
        this.updateCollaborationArea();
    },
    
    // Show the session interface
    showSessionInterface: function(session) {
        const collaborationArea = document.getElementById('collaborative-session');
        if (!collaborationArea) return;
        
        // Update interface to show active session
        collaborationArea.innerHTML = `
            <div class="active-session">
                <div class="session-header">
                    <h4>${session.name}</h4>
                    <div class="session-actions">
                        <button id="leave-session" class="action-btn">Leave Session</button>
                    </div>
                </div>
                <div class="session-content">
                    <div class="session-members-area">
                        <h5>Members <span id="member-count">Loading...</span></h5>
                        <div id="session-members" class="members-list">
                            <!-- Members will be listed here -->
                        </div>
                    </div>
                    <div class="collaboration-area">
                        <div id="session-messages" class="message-area">
                            <!-- Messages will appear here -->
                        </div>
                        <div class="message-input">
                            <input type="text" id="message-text" placeholder="Share your thoughts...">
                            <button id="send-message" class="action-btn">Send</button>
                        </div>
                    </div>
                    <div class="concept-building-area">
                        <h5>Collaborative Concepts</h5>
                        <div id="collaborative-concepts" class="collab-concepts">
                            <!-- Collaborative concepts will appear here -->
                        </div>
                        <button id="propose-concept" class="action-btn">Propose New Concept</button>
                    </div>
                </div>
            </div>
        `;
        
        // Bind events for session interface
        document.getElementById('leave-session').addEventListener('click', () => {
            this.leaveSession();
        });
        
        document.getElementById('send-message').addEventListener('click', () => {
            const messageInput = document.getElementById('message-text');
            if (messageInput && messageInput.value.trim()) {
                this.sendMessage(messageInput.value);
                messageInput.value = '';
            }
        });
        
        document.getElementById('message-text').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const messageInput = document.getElementById('message-text');
                if (messageInput.value.trim()) {
                    this.sendMessage(messageInput.value);
                    messageInput.value = '';
                }
            }
        });
        
        document.getElementById('propose-concept').addEventListener('click', () => {
            this.proposeNewConcept();
        });
        
        // Update session controls
        document.getElementById('create-session').style.display = 'none';
        document.getElementById('join-session').style.display = 'none';
    },
    
    // Leave the current session
    leaveSession: function() {
        if (!this.state.currentSession) return;
        
        console.log(`Leaving session: ${this.state.currentSession.name}`);
        
        // Reset session state
        this.state.currentSession = null;
        this.state.sessionMembers = [];
        this.state.sessionMessages = [];
        
        // Update UI
        const collaborationArea = document.getElementById('collaborative-session');
        collaborationArea.innerHTML = `
            <p class="placeholder-text">Join or create a session to collaborate in real-time</p>
        `;
        
        // Show session buttons again
        document.getElementById('create-session').style.display = 'inline-block';
        document.getElementById('join-session').style.display = 'inline-block';
    },
    
    // Send a message in the current session
    sendMessage: function(text) {
        if (!this.state.currentSession) return;
        
        // Add message to list
        this.state.sessionMessages.push({
            type: 'user',
            sender: 'You',
            text: text,
            timestamp: new Date()
        });
        
        // Update message area
        this.updateMessageArea();
        
        // Simulate response (for demo purposes)
        setTimeout(() => {
            this.simulateResponse(text);
        }, 1000 + Math.random() * 2000);
    },
    
    // Propose a new collaborative concept
    proposeNewConcept: function() {
        if (!this.state.currentSession) return;
        
        // Show proposal dialog
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Propose New Concept</h2>
                <form id="propose-concept-form">
                    <div class="form-group">
                        <label for="concept-name">Concept Name</label>
                        <input type="text" id="concept-name" placeholder="Name for the new concept">
                    </div>
                    <div class="form-group">
                        <label for="concept-constraint">Language Constraint to Bypass</label>
                        <select id="concept-constraint">
                            <option value="subject-object">Subject-Object Separation</option>
                            <option value="linear-time">Linear Temporality</option>
                            <option value="causality">Direct Causality</option>
                            <option value="binary-logic">Binary Logic</option>
                            <option value="perspectives">Perspective Limitations</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="concept-description">Initial Description</label>
                        <textarea id="concept-description" placeholder="Provide an initial description for this concept..."></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="secondary-btn cancel-btn">Cancel</button>
                        <button type="submit" class="primary-btn">Propose to Group</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            modal.remove();
        });
        
        const form = modal.querySelector('#propose-concept-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('concept-name').value;
            const constraint = document.getElementById('concept-constraint').value;
            const description = document.getElementById('concept-description').value;
            
            if (!name || !description) {
                alert('Please provide both a name and description for the concept.');
                return;
            }
            
            this.submitConceptProposal(name, constraint, description);
            modal.remove();
        });
    },
    
    // Submit a concept proposal to the group
    submitConceptProposal: function(name, constraint, description) {
        if (!this.state.currentSession) return;
        
        console.log(`Proposing concept: ${name}, Constraint: ${constraint}`);
        
        // Add system message
        this.state.sessionMessages.push({
            type: 'system',
            text: `You proposed a new concept: "${name}"`,
            timestamp: new Date()
        });
        
        // Update message area
        this.updateMessageArea();
        
        // Add to collaborative concepts
        const collaborativeConcepts = document.getElementById('collaborative-concepts');
        
        const conceptElement = document.createElement('div');
        conceptElement.className = 'collab-concept';
        conceptElement.innerHTML = `
            <div class="concept-header">
                <div class="concept-name">${name}</div>
                <div class="concept-meta">
                    <span class="concept-status">Proposed by You</span>
                </div>
            </div>
            <div class="concept-description">${description}</div>
            <div class="concept-controls">
                <div class="approval-status">
                    <span class="approval-count">1/1 approvals</span>
                    <span class="approval-needed">(${Math.ceil(this.state.sessionMembers.length / 2)} needed)</span>
                </div>
                <button class="collab-btn approved" disabled>Approved by You</button>
            </div>
        `;
        
        if (collaborativeConcepts) {
            // Remove placeholder if present
            const placeholder = collaborativeConcepts.querySelector('.empty-concepts');
            if (placeholder) placeholder.remove();
            
            collaborativeConcepts.appendChild(conceptElement);
        }
        
        // Simulate other members' reactions
        setTimeout(() => {
            this.simulateConceptReactions(name);
        }, 2000 + Math.random() * 3000);
    },
    
    // Update the message area with current messages
    updateMessageArea: function() {
        const messageArea = document.getElementById('session-messages');
        if (!messageArea) return;
        
        // Keep only the last 20 messages to avoid performance issues
        const messages = this.state.sessionMessages.slice(-20);
        
        messageArea.innerHTML = '';
        
        messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.className = `message ${message.type}-message`;
            
            // Format timestamp
            const time = new Date(message.timestamp);
            const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            if (message.type === 'system') {
                messageElement.innerHTML = `
                    <div class="message-content system-content">
                        <div class="message-text">${message.text}</div>
                        <div class="message-time">${timeStr}</div>
                    </div>
                `;
            } else {
                messageElement.innerHTML = `
                    <div class="message-sender">${message.sender}</div>
                    <div class="message-content">
                        <div class="message-text">${message.text}</div>
                        <div class="message-time">${timeStr}</div>
                    </div>
                `;
            }
            
            messageArea.appendChild(messageElement);
        });
        
        // Scroll to bottom
        messageArea.scrollTop = messageArea.scrollHeight;
    },
    
    // Update the collaboration area with current members
    updateCollaborationArea: function() {
        // Update member list
        const membersList = document.getElementById('session-members');
        const memberCount = document.getElementById('member-count');
        
        if (membersList) {
            membersList.innerHTML = '';
            
            this.state.sessionMembers.forEach(member => {
                const memberElement = document.createElement('div');
                memberElement.className = 'member-item';
                
                memberElement.innerHTML = `
                    <div class="member-name">${member.name}</div>
                    ${member.isHost ? '<span class="host-badge">Host</span>' : ''}
                `;
                
                membersList.appendChild(memberElement);
            });
        }
        
        if (memberCount) {
            memberCount.textContent = `(${this.state.sessionMembers.length})`;
        }
        
        // Update message area
        this.updateMessageArea();
        
        // Update concept area if empty
        const conceptArea = document.getElementById('collaborative-concepts');
        if (conceptArea && conceptArea.children.length === 0) {
            conceptArea.innerHTML = '<div class="empty-concepts">No concepts have been proposed yet.</div>';
        }
    },
    
    // Poll for session updates
    pollSessionUpdates: function() {
        // This would normally fetch updates from a server
        // For the demo, we'll just check if we need to simulate anything
    },
    
    // Simulate joining a session
    simulateJoiningSession: function(session) {
        // Simulate members
        this.state.sessionMembers = [
            { id: 'user-host', name: 'Nicole (Host)', isHost: true },
            { id: 'user-1', name: 'Alex', isHost: false },
            { id: 'user-2', name: 'Jordan', isHost: false },
            { id: 'user-self', name: 'You', isHost: false }
        ];
        
        // Simulate previous messages
        this.state.sessionMessages = [
            {
                type: 'system',
                text: 'Session started by Nicole.',
                timestamp: new Date(Date.now() - 15 * 60 * 1000)
            },
            {
                type: 'user',
                sender: 'Nicole',
                text: 'Welcome everyone! In this session we\'ll be exploring concepts that transcend the limitations of ' + session.type + '.',
                timestamp: new Date(Date.now() - 14 * 60 * 1000)
            },
            {
                type: 'user',
                sender: 'Alex',
                text: 'I\'ve been thinking about how our language forces us to separate experiencer from experienced, and how that limits our ability to express certain states of consciousness.',
                timestamp: new Date(Date.now() - 12 * 60 * 1000)
            },
            {
                type: 'user',
                sender: 'Jordan',
                text: 'Has anyone tried using spatial metaphors instead of temporal ones to describe experiences?',
                timestamp: new Date(Date.now() - 10 * 60 * 1000)
            },
            {
                type: 'system',
                text: 'You joined the session.',
                timestamp: new Date()
            }
        ];
        
        // Update collaboration area
        this.updateCollaborationArea();
        
        // Simulate welcome message
        setTimeout(() => {
            this.state.sessionMessages.push({
                type: 'user',
                sender: 'Nicole',
                text: 'Welcome to the session! We were just discussing how to create concepts that bypass language limitations.',
                timestamp: new Date()
            });
            this.updateMessageArea();
        }, 2000);
    },
    
    // Simulate response to a message
    simulateResponse: function(userMessage) {
        // Choose a random member to respond
        const members = this.state.sessionMembers.filter(m => m.id !== 'user-self');
        const randomMember = members[Math.floor(Math.random() * members.length)];
        
        // Generate a contextual response based on user message
        let response = '';
        
        if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
            response = 'Hello! Great to collaborate with you on these new concepts.';
        } else if (userMessage.toLowerCase().includes('concept')) {
            response = 'That\'s an interesting concept idea. How would you define it more precisely?';
        } else if (userMessage.toLowerCase().includes('language') || userMessage.toLowerCase().includes('limitation')) {
            response = 'Language limitations are fascinating to explore. Do you think we can truly express concepts beyond our linguistic constraints?';
        } else if (userMessage.toLowerCase().includes('question')) {
            response = 'Good question. Let\'s think about that in the context of our conceptual framework.';
        } else {
            // Generic responses
            const genericResponses = [
                'Interesting perspective. I hadn\'t thought about it that way.',
                'That connects well with what we were discussing earlier about linguistic constraints.',
                'I see your point, but I wonder how we could formalize that into a proper concept?',
                'That reminds me of some work on linguistic relativism. Do you think that applies here?',
                'Let\'s try to integrate that idea into our conceptual framework.'
            ];
            
            response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
        }
        
        // Add response to messages
        this.state.sessionMessages.push({
            type: 'user',
            sender: randomMember.name,
            text: response,
            timestamp: new Date()
        });
        
        // Update message area
        this.updateMessageArea();
    },
    
    // Simulate reactions to a concept proposal
    simulateConceptReactions: function(conceptName) {
        // Get all members except self
        const otherMembers = this.state.sessionMembers.filter(m => m.id !== 'user-self');
        
        // Simulate approvals one by one
        let approvalCount = 1; // User already approved
        let requiredApprovals = Math.ceil(this.state.sessionMembers.length / 2);
        
        // Update concept element
        const conceptElement = document.querySelector('.collab-concept .concept-name');
        if (!conceptElement) return;
        
        const conceptContainer = conceptElement.closest('.collab-concept');
        if (!conceptContainer) return;
        
        const sendApproval = (member, index) => {
            // Add system message about approval
            this.state.sessionMessages.push({
                type: 'system',
                text: `${member.name} approved the concept "${conceptName}"`,
                timestamp: new Date()
            });
            
            // Update message area
            this.updateMessageArea();
            
            // Update approval count
            approvalCount++;
            
            const approvalCountElement = conceptContainer.querySelector('.approval-count');
            if (approvalCountElement) {
                approvalCountElement.textContent = `${approvalCount}/${this.state.sessionMembers.length} approvals`;
            }
            
            // If we have enough approvals, mark as adopted
            if (approvalCount >= requiredApprovals) {
                // Add system message about adoption
                this.state.sessionMessages.push({
                    type: 'system',
                    text: `The concept "${conceptName}" has been officially adopted by the group!`,
                    timestamp: new Date()
                });
                
                // Update message area
                this.updateMessageArea();
                
                // Update concept status
                const statusElement = conceptContainer.querySelector('.concept-status');
                if (statusElement) {
                    statusElement.textContent = 'Adopted by Group';
                    statusElement.classList.add('adopted');
                }
                
                // Update session concept count
                if (this.state.currentSession) {
                    this.state.currentSession.concepts++;
                }
            }
        };
        
        // Schedule approvals
        otherMembers.forEach((member, index) => {
            // 80% chance of approval
            if (Math.random() < 0.8) {
                setTimeout(() => {
                    sendApproval(member, index);
                }, (index + 1) * 2000 + Math.random() * 1000);
            }
        });
    }
};

// Initialize when document loads
document.addEventListener('DOMContentLoaded', function() {
    CommunityManager.init();
});