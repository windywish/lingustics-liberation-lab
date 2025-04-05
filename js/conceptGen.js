/**
 * Concept Generator Script - Language Limitation Bypassing Tools
 * Handles the generation of new concepts based on workspace elements
 */

const ConceptGenerator = {
    // Configuration for concept generation
    config: {
        // Patterns for each constraint type
        patterns: {
            'subject-object': [
                { name: 'Unifier', template: 'A state where {0} and {1} become indistinguishable' },
                { name: 'Non-dual Perceiver', template: 'An awareness that experiences {0} without separation from {1}' },
                { name: 'Subject-Object Merger', template: 'A process where {0} and {1} continuously flow into each other' }
            ],
            'linear-time': [
                { name: 'Temporal Field', template: 'A domain where {0} and {1} exist simultaneously across all timeframes' },
                { name: 'Chronos Loop', template: 'A process where {0} precedes {1} which precedes {0}' },
                { name: 'Atemporal Node', template: 'A point where {0} and {1} interact outside sequential time' }
            ],
            'causality': [
                { name: 'Mutual Emergence', template: 'A phenomenon where {0} and {1} simultaneously cause each other' },
                { name: 'Causal Mesh', template: 'A network where {0} and {1} have non-directional causal relationships' },
                { name: 'Acausal Sync', template: 'A meaningful connection between {0} and {1} without causal linkage' }
            ],
            'binary-logic': [
                { name: 'Quantum State', template: 'A condition where {0} and {1} are simultaneously true and false' },
                { name: 'Paradox Field', template: 'A domain where {0} and {1} maintain contradictory truth values' },
                { name: 'Multi-value Logic', template: 'A system where {0} and {1} exist across a spectrum of truth values' }
            ],
            'perspectives': [
                { name: 'Omniperspective', template: 'A viewpoint that simultaneously experiences {0} from all possible perspectives' },
                { name: 'Perspective Fusion', template: 'A merging of all possible viewpoints on {0} and {1}' },
                { name: 'Observer Network', template: 'A system where multiple observers of {0} and {1} form a unified awareness' }
            ]
        },
        
        // Descriptions for each pattern type
        descriptions: {
            'subject-object': [
                'A concept that eliminates the boundary between perceiver and perceived',
                'An experience where the observer and observed become a unified field',
                'A state of awareness where inside and outside are recognized as the same'
            ],
            'linear-time': [
                'A concept that exists across past, present, and future simultaneously',
                'A phenomenon where sequence gives way to simultaneous existence',
                'A state where time becomes a dimension that can be navigated non-linearly'
            ],
            'causality': [
                'A system where effects can precede causes without paradox',
                'A network of relationships where causation flows in multiple directions',
                'A field where meaningful connections replace cause-effect relationships'
            ],
            'binary-logic': [
                'A concept that maintains contradictory properties simultaneously',
                'A state where multiple truth values can coexist without resolution',
                'A system that operates beyond the constraints of true/false distinctions'
            ],
            'perspectives': [
                'A viewpoint that encompasses all possible perspectives simultaneously',
                'A mode of perception that integrates subjective and objective completely',
                'A form of awareness that transcends the limitations of single-point observation'
            ]
        }
    },
    
    // Generate concepts from workspace elements
    generateFromElements: function(elements, constraintType) {
        if (elements.length < 2) return [];
        
        // Determine how many concepts to generate (1-3)
        const conceptCount = Math.floor(Math.random() * 3) + 1;
        const concepts = [];
        
        // Get patterns for the selected constraint type
        const patterns = this.config.patterns[constraintType] || this.config.patterns['subject-object'];
        const descriptions = this.config.descriptions[constraintType] || this.config.descriptions['subject-object'];
        
        // Generate concepts
        for (let i = 0; i < conceptCount; i++) {
            // Select random pattern
            const patternIndex = Math.floor(Math.random() * patterns.length);
            const pattern = patterns[patternIndex];
            
            // Select random description
            const descIndex = Math.floor(Math.random() * descriptions.length);
            const description = descriptions[descIndex];
            
            // Select random elements to fill pattern template
            const elementIndices = this.getRandomIndices(elements.length, 2);
            const element1 = elements[elementIndices[0]];
            const element2 = elements[elementIndices[1]];
            
            // Fill template
            const name = pattern.name + ' ' + this.getRandomSuffix();
            const filledTemplate = pattern.template
                .replace('{0}', element1.label)
                .replace('{1}', element2.label);
            
            // Create concept
            const concept = {
                id: `concept-${Date.now()}-${i}`,
                name: name,
                description: description + ': ' + filledTemplate,
                constraint: constraintType,
                elements: [...elements],
                pattern: pattern.name,
                created: new Date()
            };
            
            concepts.push(concept);
        }
        
        return concepts;
    },
    
    // Get random unique indices from array
    getRandomIndices: function(max, count) {
        const indices = [];
        const available = Array.from({length: max}, (_, i) => i);
        
        for (let i = 0; i < count && available.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * available.length);
            indices.push(available[randomIndex]);
            available.splice(randomIndex, 1);
        }
        
        return indices;
    },
    
    // Get random suffix to make concept names unique
    getRandomSuffix: function() {
        const suffixes = [
            'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon',
            'Prime', 'Nexus', 'Node', 'Field', 'Wave',
            'Omega', 'Zero', 'One', 'All', 'Void'
        ];
        
        return suffixes[Math.floor(Math.random() * suffixes.length)];
    }
};