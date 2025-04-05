/**
 * Visualizer Script - Language Limitation Bypassing Tools
 * Handles visualization of concepts in different modes
 */

const Visualizer = {
    // Configuration for visualizations
    config: {
        colors: {
            entity: '#4299e1',
            relation: '#9f7aea',
            property: '#38b2ac', 
            process: '#ed8936',
            context: '#48bb78'
        },
        
        // Layout parameters
        spacing: 80,
        radius: 40,
        lineWidth: 2
    },
    
    // Render visualization based on mode and concepts
    renderVisualization: function(canvas, concepts, mode) {
        // Clear canvas
        canvas.innerHTML = '';
        
        // Check if we have concepts to visualize
        if (!concepts || concepts.length === 0) {
            canvas.innerHTML = '<div class="placeholder-text">Select concepts to visualize</div>';
            return;
        }
        
        // Create visualization based on mode
        switch(mode) {
            case 'spatial':
                this.renderSpatialVisualization(canvas, concepts);
                break;
            case 'temporal':
                this.renderTemporalVisualization(canvas, concepts);
                break;
            case 'relational':
                this.renderRelationalVisualization(canvas, concepts);
                break;
            case 'dimensional':
                this.renderDimensionalVisualization(canvas, concepts);
                break;
            default:
                this.renderSpatialVisualization(canvas, concepts);
        }
    },
    
    // Render spatial visualization (element positions)
    renderSpatialVisualization: function(canvas, concepts) {
        // Create container
        const vizContainer = document.createElement('div');
        vizContainer.className = 'spatial-visualization';
        vizContainer.style.position = 'relative';
        vizContainer.style.width = '100%';
        vizContainer.style.height = '100%';
        
        // Combine all elements from all concepts
        const allElements = [];
        concepts.forEach(concept => {
            if (concept.elements && Array.isArray(concept.elements)) {
                concept.elements.forEach(element => {
                    allElements.push({
                        ...element,
                        concept: concept.name
                    });
                });
            }
        });
        
        // Limit to 10 elements for performance
        const elementsToRender = allElements.slice(0, 10);
        
        // Create elements
        elementsToRender.forEach((element, index) => {
            const elementNode = document.createElement('div');
            elementNode.className = 'viz-element';
            elementNode.style.position = 'absolute';
            
            // Calculate position in a circle
            const angle = (index / elementsToRender.length) * Math.PI * 2;
            const radius = Math.min(canvas.clientWidth, canvas.clientHeight) * 0.4;
            const x = Math.cos(angle) * radius + canvas.clientWidth / 2 - 50;
            const y = Math.sin(angle) * radius + canvas.clientHeight / 2 - 50;
            
            elementNode.style.left = `${x}px`;
            elementNode.style.top = `${y}px`;
            elementNode.style.width = '100px';
            elementNode.style.height = '100px';
            elementNode.style.display = 'flex';
            elementNode.style.flexDirection = 'column';
            elementNode.style.alignItems = 'center';
            elementNode.style.justifyContent = 'center';
            elementNode.style.borderRadius = '50%';
            elementNode.style.backgroundColor = this.getColorForType(element.type);
            elementNode.style.color = 'white';
            elementNode.style.padding = '5px';
            elementNode.style.textAlign = 'center';
            elementNode.style.fontSize = '12px';
            elementNode.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            
            // Add label
            elementNode.innerHTML = `
                <div>${element.label}</div>
                <div style="font-size: 10px; opacity: 0.8">${element.concept}</div>
            `;
            
            vizContainer.appendChild(elementNode);
        });
        
        // Add container to canvas
        canvas.appendChild(vizContainer);
    },
    
    // Render temporal visualization (concept evolution)
    renderTemporalVisualization: function(canvas, concepts) {
        // Sort concepts by creation date
        const sortedConcepts = [...concepts].sort((a, b) => {
            return new Date(a.created) - new Date(b.created);
        });
        
        // Create timeline container
        const timeline = document.createElement('div');
        timeline.className = 'temporal-visualization';
        timeline.style.position = 'relative';
        timeline.style.width = '100%';
        timeline.style.height = '100%';
        timeline.style.padding = '20px';
        timeline.style.overflowX = 'auto';
        timeline.style.overflowY = 'hidden';
        timeline.style.whiteSpace = 'nowrap';
        
        // Create timeline axis
        const axis = document.createElement('div');
        axis.className = 'timeline-axis';
        axis.style.position = 'absolute';
        axis.style.left = '0';
        axis.style.right = '0';
        axis.style.top = '50%';
        axis.style.height = '2px';
        axis.style.backgroundColor = '#e2e8f0';
        
        timeline.appendChild(axis);
        
        // Add concept nodes to timeline
        const nodeWidth = 150;
        const spaceBetween = 50;
        const totalWidth = (nodeWidth + spaceBetween) * sortedConcepts.length;
        
        // Set minimum width to ensure scrolling works properly
        timeline.style.minWidth = `${totalWidth}px`;
        
        sortedConcepts.forEach((concept, index) => {
            const node = document.createElement('div');
            node.className = 'concept-node';
            
            // Position alternating above/below the line
            const isAbove = index % 2 === 0;
            const yPos = isAbove ? '0' : '50%';
            
            node.style.position = 'absolute';
            node.style.left = `${index * (nodeWidth + spaceBetween)}px`;
            node.style.top = yPos;
            node.style.width = `${nodeWidth}px`;
            node.style.padding = '10px';
            node.style.backgroundColor = 'white';
            node.style.border = '1px solid #e2e8f0';
            node.style.borderRadius = '5px';
            node.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
            
            // Format date
            const date = new Date(concept.created);
            const dateStr = date.toLocaleDateString();
            
            node.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 5px;">${concept.name}</div>
                <div style="font-size: 11px; color: #718096; margin-bottom: 8px;">${dateStr}</div>
                <div style="font-size: 12px; white-space: normal; max-height: 80px; overflow-y: auto;">
                    ${concept.description.substring(0, 100)}...
                </div>
            `;
            
            // Add connecting line to axis
            const connector = document.createElement('div');
            connector.className = 'connector';
            connector.style.position = 'absolute';
            connector.style.width = '2px';
            connector.style.backgroundColor = '#e2e8f0';
            
            if (isAbove) {
                connector.style.top = '100%';
                connector.style.height = `${canvas.clientHeight / 2 - node.clientHeight}px`;
                connector.style.left = `${nodeWidth / 2}px`;
            } else {
                connector.style.bottom = '100%';
                connector.style.height = `${canvas.clientHeight / 2 - node.clientHeight}px`;
                connector.style.left = `${nodeWidth / 2}px`;
            }
            
            node.appendChild(connector);
            timeline.appendChild(node);
        });
        
        // Add container to canvas
        canvas.appendChild(timeline);
    },
    
    // Render relational visualization (concept relationships)
    renderRelationalVisualization: function(canvas, concepts) {
        // Create network container
        const network = document.createElement('div');
        network.className = 'relational-visualization';
        network.style.position = 'relative';
        network.style.width = '100%';
        network.style.height = '100%';
        
        // Create center node (hub)
        const centerNode = document.createElement('div');
        centerNode.className = 'center-node';
        centerNode.style.position = 'absolute';
        centerNode.style.left = `${canvas.clientWidth / 2 - 50}px`;
        centerNode.style.top = `${canvas.clientHeight / 2 - 50}px`;
        centerNode.style.width = '100px';
        centerNode.style.height = '100px';
        centerNode.style.borderRadius = '50%';
        centerNode.style.backgroundColor = '#3a7ca5';
        centerNode.style.color = 'white';
        centerNode.style.display = 'flex';
        centerNode.style.alignItems = 'center';
        centerNode.style.justifyContent = 'center';
        centerNode.style.textAlign = 'center';
        centerNode.style.fontWeight = 'bold';
        centerNode.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        centerNode.textContent = 'Concept Hub';
        
        network.appendChild(centerNode);
        
        // Add concept nodes around center
        concepts.forEach((concept, index) => {
            const node = document.createElement('div');
            node.className = 'concept-node';
            
            // Calculate position in a circle
            const angle = (index / concepts.length) * Math.PI * 2;
            const radius = Math.min(canvas.clientWidth, canvas.clientHeight) * 0.35;
            const x = Math.cos(angle) * radius + canvas.clientWidth / 2 - 40;
            const y = Math.sin(angle) * radius + canvas.clientHeight / 2 - 40;
            
            node.style.position = 'absolute';
            node.style.left = `${x}px`;
            node.style.top = `${y}px`;
            node.style.width = '80px';
            node.style.height = '80px';
            node.style.borderRadius = '50%';
            node.style.backgroundColor = this.getColorForConstraint(concept.constraint);
            node.style.color = 'white';
            node.style.display = 'flex';
            node.style.alignItems = 'center';
            node.style.justifyContent = 'center';
            node.style.textAlign = 'center';
            node.style.fontSize = '12px';
            node.style.fontWeight = 'bold';
            node.style.padding = '5px';
            node.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            node.style.zIndex = '2';
            
            // Add shortened name
            const shortName = concept.name.split(' ').slice(0, 2).join(' ');
            node.textContent = shortName;
            
            // Add line connecting to center
            const line = document.createElement('div');
            line.className = 'connecting-line';
            
            // Calculate line position and dimensions
            const centerX = canvas.clientWidth / 2;
            const centerY = canvas.clientHeight / 2;
            const nodeX = x + 40; // Node center
            const nodeY = y + 40; // Node center
            
            // Calculate length and angle
            const deltaX = nodeX - centerX;
            const deltaY = nodeY - centerY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const angle2 = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
            
            // Style line
            line.style.position = 'absolute';
            line.style.left = `${centerX}px`;
            line.style.top = `${centerY}px`;
            line.style.width = `${distance}px`;
            line.style.height = '2px';
            line.style.backgroundColor = 'rgba(0,0,0,0.2)';
            line.style.transformOrigin = '0 0';
            line.style.transform = `rotate(${angle2}deg)`;
            line.style.zIndex = '1';
            
            network.appendChild(line);
            network.appendChild(node);
        });
        
        // Add container to canvas
        canvas.appendChild(network);
    },
    
    // Render dimensional visualization (concept layers)
    renderDimensionalVisualization: function(canvas, concepts) {
        // Create 3D-like layered visualization
        const dimensionalViz = document.createElement('div');
        dimensionalViz.className = 'dimensional-visualization';
        dimensionalViz.style.position = 'relative';
        dimensionalViz.style.width = '100%';
        dimensionalViz.style.height = '100%';
        dimensionalViz.style.perspective = '1000px';
        
        // Group concepts by constraint type
        const constraintGroups = {};
        concepts.forEach(concept => {
            if (!constraintGroups[concept.constraint]) {
                constraintGroups[concept.constraint] = [];
            }
            constraintGroups[concept.constraint].push(concept);
        });
        
        // Create layers for each constraint type
        const constraints = Object.keys(constraintGroups);
        constraints.forEach((constraint, index) => {
            const layer = document.createElement('div');
            layer.className = 'dimensional-layer';
            layer.style.position = 'absolute';
            layer.style.left = '10%';
            layer.style.right = '10%';
            layer.style.top = '10%';
            layer.style.bottom = '10%';
            layer.style.backgroundColor = 'rgba(255,255,255,0.9)';
            layer.style.border = `2px solid ${this.getColorForConstraint(constraint)}`;
            layer.style.borderRadius = '8px';
            layer.style.transform = `translateZ(${-index * 60}px)`;
            layer.style.transformStyle = 'preserve-3d';
            layer.style.padding = '15px';
            layer.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            layer.style.zIndex = `${100 - index}`;
            
            // Add header for this constraint type
            const header = document.createElement('div');
            header.className = 'layer-header';
            header.style.marginBottom = '10px';
            header.style.color = this.getColorForConstraint(constraint);
            header.style.fontWeight = 'bold';
            header.style.borderBottom = `1px solid ${this.getColorForConstraint(constraint)}`;
            header.style.paddingBottom = '5px';
            
            const constraintLabel = {
                'subject-object': 'Subject-Object Concepts',
                'linear-time': 'Non-linear Time Concepts',
                'causality': 'Non-causal Concepts',
                'binary-logic': 'Multi-valued Logic Concepts',
                'perspectives': 'Multi-perspective Concepts'
            }[constraint] || constraint;
            
            header.textContent = constraintLabel;
            layer.appendChild(header);
            
            // Add concepts for this layer
            const conceptsList = document.createElement('div');
            conceptsList.className = 'layer-concepts';
            conceptsList.style.overflowY = 'auto';
            conceptsList.style.maxHeight = '80%';
            
            constraintGroups[constraint].forEach(concept => {
                const conceptItem = document.createElement('div');
                conceptItem.className = 'layer-concept-item';
                conceptItem.style.marginBottom = '8px';
                conceptItem.style.padding = '8px';
                conceptItem.style.backgroundColor = 'rgba(255,255,255,0.7)';
                conceptItem.style.borderRadius = '4px';
                conceptItem.style.border = `1px solid ${this.getColorForConstraint(constraint)}`;
                
                conceptItem.innerHTML = `
                    <div style="font-weight: bold; margin-bottom: 3px;">${concept.name}</div>
                    <div style="font-size: 11px;">${concept.description.substring(0, 60)}...</div>
                `;
                
                conceptsList.appendChild(conceptItem);
            });
            
            layer.appendChild(conceptsList);
            dimensionalViz.appendChild(layer);
        });
        
        // Add container to canvas
        canvas.appendChild(dimensionalViz);
    },
    
    // Get color for element type
    getColorForType: function(type) {
        return this.config.colors[type] || '#718096';
    },
    
    // Get color for constraint type
    getColorForConstraint: function(constraint) {
        const colorMap = {
            'subject-object': '#3182ce',
            'linear-time': '#805ad5',
            'causality': '#dd6b20',
            'binary-logic': '#38a169',
            'perspectives': '#e53e3e'
        };
        
        return colorMap[constraint] || '#718096';
    }
};