/* ============================================================
   WebBuilder — Component Library
   ============================================================ */
window.WebBuilder = window.WebBuilder || {};

(function(WB) {
    'use strict';

    var _idCounter = 0;
    WB.generateId = function() {
        _idCounter++;
        return 'n_' + Date.now().toString(36) + '_' + _idCounter + '_' + Math.random().toString(36).substr(2, 4);
    };

    WB.ComponentLibrary = {

        categories: [
            {
                name: 'Layout',
                icon: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="1" width="12" height="12" rx="1.5"/><path d="M1 5h12M5 5v8"/></svg>',
                components: ['navbar', 'hero-section', 'section', 'footer', 'divider', 'spacer']
            },
            {
                name: 'Content',
                icon: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 3h10M2 6h7M2 9h9M2 12h5"/></svg>',
                components: ['heading', 'paragraph', 'image', 'list']
            },
            {
                name: 'Interactive',
                icon: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="10" height="6" rx="3"/><circle cx="9" cy="7" r="1.5" fill="currentColor"/></svg>',
                components: ['button', 'link', 'form', 'input-field']
            },
            {
                name: 'Composite',
                icon: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="1" width="5" height="5" rx="1"/><rect x="8" y="1" width="5" height="5" rx="1"/><rect x="1" y="8" width="5" height="5" rx="1"/><rect x="8" y="8" width="5" height="5" rx="1"/></svg>',
                components: ['card', 'two-column', 'three-column', 'card-grid']
            }
        ],

        definitions: {

            /* ===================== LAYOUT ===================== */

            'navbar': {
                label: 'Navigation Bar',
                icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="1" y="4" width="14" height="8" rx="1.5"/><path d="M4 8h2M7 8h2M10 8h2"/></svg>',
                createNode: function() {
                    return {
                        id: WB.generateId(), type: 'navbar', tagName: 'nav',
                        attributes: {},
                        styles: {
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '16px 32px', backgroundColor: '#1e1e2e', color: '#ffffff'
                        },
                        children: [
                            {
                                id: WB.generateId(), type: 'text-inline', tagName: 'div',
                                content: 'MySite', styles: { fontSize: '20px', fontWeight: 'bold' },
                                children: [], attributes: {}
                            },
                            {
                                id: WB.generateId(), type: 'nav-links', tagName: 'div',
                                content: '', styles: { display: 'flex', gap: '24px' },
                                children: [
                                    { id: WB.generateId(), type: 'text-inline', tagName: 'a', content: 'Home', attributes: { href: '#' }, styles: { color: '#ffffff', textDecoration: 'none' }, children: [] },
                                    { id: WB.generateId(), type: 'text-inline', tagName: 'a', content: 'About', attributes: { href: '#' }, styles: { color: '#ffffff', textDecoration: 'none' }, children: [] },
                                    { id: WB.generateId(), type: 'text-inline', tagName: 'a', content: 'Contact', attributes: { href: '#' }, styles: { color: '#ffffff', textDecoration: 'none' }, children: [] }
                                ],
                                attributes: {}
                            }
                        ]
                    };
                },
                editableProperties: ['backgroundColor', 'color', 'padding', 'justifyContent', 'alignItems', 'gap', 'position']
            },

            'hero-section': {
                label: 'Hero Section',
                icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="1" y="2" width="14" height="12" rx="1.5"/><path d="M5 6h6M6 9h4M7 11.5h2"/></svg>',
                createNode: function() {
                    return {
                        id: WB.generateId(), type: 'hero-section', tagName: 'section',
                        attributes: {},
                        styles: {
                            padding: '100px 40px', textAlign: 'center',
                            backgroundColor: '#0f0f23', color: '#ffffff',
                            backgroundImage: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)'
                        },
                        children: [
                            {
                                id: WB.generateId(), type: 'heading', tagName: 'h1',
                                content: 'Welcome to Your Website',
                                styles: { fontSize: '48px', marginBottom: '16px', fontWeight: '700' },
                                children: [], attributes: {}
                            },
                            {
                                id: WB.generateId(), type: 'paragraph', tagName: 'p',
                                content: 'Build something amazing with our powerful platform.',
                                styles: { fontSize: '20px', opacity: '0.8', maxWidth: '600px', margin: '0 auto 32px auto' },
                                children: [], attributes: {}
                            },
                            {
                                id: WB.generateId(), type: 'button', tagName: 'a',
                                content: 'Get Started',
                                attributes: { href: '#' },
                                styles: {
                                    display: 'inline-block', padding: '14px 32px',
                                    backgroundColor: '#6c5ce7', color: '#ffffff',
                                    borderRadius: '8px', textDecoration: 'none',
                                    fontSize: '16px', fontWeight: '600'
                                },
                                children: []
                            }
                        ]
                    };
                },
                editableProperties: ['backgroundColor', 'backgroundImage', 'color', 'padding', 'textAlign', 'minHeight']
            },

            'section': {
                label: 'Section',
                icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="1" y="3" width="14" height="10" rx="1.5"/></svg>',
                createNode: function() {
                    return {
                        id: WB.generateId(), type: 'section', tagName: 'section',
                        attributes: {},
                        styles: { padding: '60px 40px', backgroundColor: '#ffffff', color: '#333333' },
                        children: [
                            {
                                id: WB.generateId(), type: 'heading', tagName: 'h2',
                                content: 'Section Title',
                                styles: { fontSize: '32px', marginBottom: '16px', fontWeight: '700', textAlign: 'center' },
                                children: [], attributes: {}
                            },
                            {
                                id: WB.generateId(), type: 'paragraph', tagName: 'p',
                                content: 'This is a content section. Double-click to edit text.',
                                styles: { fontSize: '16px', lineHeight: '1.6', maxWidth: '700px', margin: '0 auto', textAlign: 'center', color: '#666666' },
                                children: [], attributes: {}
                            }
                        ]
                    };
                },
                editableProperties: [
                    'display', 'flexDirection', 'justifyContent', 'alignItems', 'gap',
                    'backgroundColor', 'backgroundImage', 'color', 'padding',
                    'textAlign', 'minHeight', 'maxWidth', 'border', 'borderRadius', 'boxShadow'
                ]
            },

            'footer': {
                label: 'Footer',
                icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="1" y="10" width="14" height="4" rx="1"/><path d="M4 12h8"/></svg>',
                createNode: function() {
                    return {
                        id: WB.generateId(), type: 'footer', tagName: 'footer',
                        attributes: {},
                        styles: {
                            padding: '32px 40px', backgroundColor: '#1e1e2e', color: '#a0a0a0',
                            textAlign: 'center', fontSize: '14px'
                        },
                        children: [
                            {
                                id: WB.generateId(), type: 'paragraph', tagName: 'p',
                                content: '\u00a9 2026 Your Company. All rights reserved.',
                                styles: {},
                                children: [], attributes: {}
                            }
                        ]
                    };
                },
                editableProperties: [
                    'backgroundColor', 'color', 'padding', 'textAlign',
                    'fontSize', 'display', 'flexDirection', 'alignItems', 'gap'
                ]
            },

            'divider': {
                label: 'Divider',
                icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M2 8h12"/></svg>',
                createNode: function() {
                    return {
                        id: WB.generateId(), type: 'divider', tagName: 'hr',
                        attributes: {},
                        styles: { border: 'none', borderTop: '1px solid #e0e0e0', margin: '24px 40px' },
                        children: [], content: null
                    };
                },
                editableProperties: ['borderTop', 'margin', 'opacity']
            },

            'spacer': {
                label: 'Spacer',
                icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M3 4h10M3 12h10M8 5v6" stroke-dasharray="2 1.5"/></svg>',
                createNode: function() {
                    return {
                        id: WB.generateId(), type: 'spacer', tagName: 'div',
                        attributes: {},
                        styles: { height: '60px' },
                        children: [], content: null
                    };
                },
                editableProperties: ['height', 'backgroundColor']
            },

            /* ===================== CONTENT ===================== */

            'heading': {
                label: 'Heading',
                icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><text x="2" y="13" font-size="13" font-weight="bold" font-family="serif">H</text></svg>',
                createNode: function() {
                    return {
                        id: WB.generateId(), type: 'heading', tagName: 'h2',
                        attributes: {},
                        styles: { fontSize: '32px', fontWeight: '700', marginBottom: '16px', color: '#1a1a1a' },
                        children: [], content: 'Heading Text'
                    };
                },
                editableProperties: ['tagName', 'fontSize', 'fontWeight', 'color', 'textAlign', 'margin', 'fontFamily', 'lineHeight', 'letterSpacing']
            },

            'paragraph': {
                label: 'Paragraph',
                icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M2 3h12M2 6h10M2 9h12M2 12h7"/></svg>',
                createNode: function() {
                    return {
                        id: WB.generateId(), type: 'paragraph', tagName: 'p',
                        attributes: {},
                        styles: { fontSize: '16px', lineHeight: '1.6', color: '#444444', marginBottom: '16px' },
                        children: [], content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                    };
                },
                editableProperties: ['fontSize', 'fontWeight', 'color', 'textAlign', 'lineHeight', 'margin', 'fontFamily', 'maxWidth']
            },

            'image': {
                label: 'Image',
                icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="1" y="2" width="14" height="12" rx="1.5"/><circle cx="5" cy="6" r="1.5"/><path d="M1 11l4-4 3 3 2-2 5 4"/></svg>',
                createNode: function() {
                    return {
                        id: WB.generateId(), type: 'image', tagName: 'img',
                        attributes: { src: 'https://placehold.co/800x400/e2e2e2/666?text=Your+Image', alt: 'Placeholder image' },
                        styles: { maxWidth: '100%', height: 'auto', borderRadius: '8px', display: 'block', margin: '0 auto' },
                        children: [], content: null
                    };
                },
                editableProperties: ['width', 'maxWidth', 'height', 'borderRadius', 'margin', 'opacity', 'objectFit']
            },

            'list': {
                label: 'List',
                icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="3" cy="4" r="1" fill="currentColor"/><path d="M6 4h8"/><circle cx="3" cy="8" r="1" fill="currentColor"/><path d="M6 8h8"/><circle cx="3" cy="12" r="1" fill="currentColor"/><path d="M6 12h8"/></svg>',
                createNode: function() {
                    return {
                        id: WB.generateId(), type: 'list', tagName: 'ul',
                        attributes: {},
                        styles: { fontSize: '16px', lineHeight: '1.8', color: '#444444', paddingLeft: '24px', marginBottom: '16px' },
                        children: [
                            { id: WB.generateId(), type: 'list-item', tagName: 'li', content: 'First list item', styles: {}, children: [], attributes: {} },
                            { id: WB.generateId(), type: 'list-item', tagName: 'li', content: 'Second list item', styles: {}, children: [], attributes: {} },
                            { id: WB.generateId(), type: 'list-item', tagName: 'li', content: 'Third list item', styles: {}, children: [], attributes: {} }
                        ]
                    };
                },
                editableProperties: ['fontSize', 'color', 'lineHeight', 'margin', 'listStyleType']
            },

            /* ===================== INTERACTIVE ===================== */

            'button': {
                label: 'Button',
                icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="2" y="4.5" width="12" height="7" rx="3.5"/><path d="M5 8h6"/></svg>',
                createNode: function() {
                    return {
                        id: WB.generateId(), type: 'button', tagName: 'a',
                        attributes: { href: '#' },
                        styles: {
                            display: 'inline-block', padding: '12px 28px',
                            backgroundColor: '#6c5ce7', color: '#ffffff',
                            borderRadius: '6px', textDecoration: 'none',
                            fontSize: '15px', fontWeight: '600', textAlign: 'center'
                        },
                        children: [], content: 'Click Me'
                    };
                },
                editableProperties: ['backgroundColor', 'color', 'padding', 'borderRadius', 'fontSize', 'fontWeight', 'border', 'width']
            },

            'link': {
                label: 'Text Link',
                icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M6.5 9.5l3-3M5 11l-1.5 1.5a2 2 0 002.8 0L8 11M8 5l1.5-1.5a2 2 0 012.8 0L11 5"/></svg>',
                createNode: function() {
                    return {
                        id: WB.generateId(), type: 'link', tagName: 'a',
                        attributes: { href: '#' },
                        styles: { color: '#6c5ce7', fontSize: '16px', textDecoration: 'underline' },
                        children: [], content: 'Link Text'
                    };
                },
                editableProperties: ['color', 'fontSize', 'fontWeight', 'textDecoration']
            },

            'form': {
                label: 'Contact Form',
                icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="2" y="1" width="12" height="14" rx="1.5"/><path d="M5 5h6M5 8h6"/><rect x="5" y="11" width="6" height="2" rx="1"/></svg>',
                createNode: function() {
                    return {
                        id: WB.generateId(), type: 'form', tagName: 'form',
                        attributes: {},
                        styles: {
                            padding: '32px', maxWidth: '500px', margin: '0 auto',
                            backgroundColor: '#f8f9fa', borderRadius: '12px'
                        },
                        children: [
                            {
                                id: WB.generateId(), type: 'heading', tagName: 'h3',
                                content: 'Contact Us', styles: { fontSize: '24px', fontWeight: '600', marginBottom: '20px', color: '#1a1a1a' },
                                children: [], attributes: {}
                            },
                            {
                                id: WB.generateId(), type: 'input-field', tagName: 'div',
                                content: null,
                                styles: { marginBottom: '16px' },
                                children: [
                                    { id: WB.generateId(), type: 'text-inline', tagName: 'label', content: 'Name', styles: { display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#333' }, children: [], attributes: {} },
                                    { id: WB.generateId(), type: 'form-input', tagName: 'input', content: null, styles: { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }, children: [], attributes: { type: 'text', placeholder: 'Your name' } }
                                ],
                                attributes: {}
                            },
                            {
                                id: WB.generateId(), type: 'input-field', tagName: 'div',
                                content: null,
                                styles: { marginBottom: '16px' },
                                children: [
                                    { id: WB.generateId(), type: 'text-inline', tagName: 'label', content: 'Email', styles: { display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#333' }, children: [], attributes: {} },
                                    { id: WB.generateId(), type: 'form-input', tagName: 'input', content: null, styles: { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }, children: [], attributes: { type: 'email', placeholder: 'your@email.com' } }
                                ],
                                attributes: {}
                            },
                            {
                                id: WB.generateId(), type: 'input-field', tagName: 'div',
                                content: null,
                                styles: { marginBottom: '20px' },
                                children: [
                                    { id: WB.generateId(), type: 'text-inline', tagName: 'label', content: 'Message', styles: { display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#333' }, children: [], attributes: {} },
                                    { id: WB.generateId(), type: 'form-input', tagName: 'textarea', content: null, styles: { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', minHeight: '100px', resize: 'vertical' }, children: [], attributes: { placeholder: 'Your message...' } }
                                ],
                                attributes: {}
                            },
                            {
                                id: WB.generateId(), type: 'button', tagName: 'button',
                                content: 'Send Message',
                                styles: {
                                    display: 'block', width: '100%', padding: '12px 24px',
                                    backgroundColor: '#6c5ce7', color: '#ffffff', border: 'none',
                                    borderRadius: '6px', fontSize: '15px', fontWeight: '600', cursor: 'pointer'
                                },
                                children: [], attributes: { type: 'submit' }
                            }
                        ]
                    };
                },
                editableProperties: ['backgroundColor', 'padding', 'borderRadius', 'maxWidth', 'margin', 'border']
            },

            'input-field': {
                label: 'Input Field',
                icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="1" y="5" width="14" height="6" rx="1.5"/><path d="M4 8h0" stroke-width="2" stroke-linecap="round"/></svg>',
                createNode: function() {
                    return {
                        id: WB.generateId(), type: 'input-field', tagName: 'div',
                        attributes: {},
                        styles: { marginBottom: '16px' },
                        children: [
                            { id: WB.generateId(), type: 'text-inline', tagName: 'label', content: 'Label', styles: { display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#333' }, children: [], attributes: {} },
                            { id: WB.generateId(), type: 'form-input', tagName: 'input', content: null, styles: { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }, children: [], attributes: { type: 'text', placeholder: 'Enter text...' } }
                        ]
                    };
                },
                editableProperties: ['margin', 'padding']
            },

            /* ===================== COMPOSITE ===================== */

            'card': {
                label: 'Card',
                icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="2" y="1" width="12" height="14" rx="2"/><path d="M2 6h12M5 9h6M5 11.5h4"/></svg>',
                createNode: function() {
                    return {
                        id: WB.generateId(), type: 'card', tagName: 'div',
                        attributes: {},
                        styles: {
                            backgroundColor: '#ffffff', borderRadius: '12px',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden',
                            maxWidth: '350px', margin: '0 auto'
                        },
                        children: [
                            {
                                id: WB.generateId(), type: 'image', tagName: 'img',
                                attributes: { src: 'https://placehold.co/400x200/e8e8e8/888?text=Card+Image', alt: 'Card image' },
                                styles: { width: '100%', height: '200px', objectFit: 'cover', display: 'block' },
                                children: [], content: null
                            },
                            {
                                id: WB.generateId(), type: 'card-body', tagName: 'div',
                                content: null,
                                styles: { padding: '20px' },
                                children: [
                                    { id: WB.generateId(), type: 'heading', tagName: 'h3', content: 'Card Title', styles: { fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }, children: [], attributes: {} },
                                    { id: WB.generateId(), type: 'paragraph', tagName: 'p', content: 'Card description goes here. This is a brief summary.', styles: { fontSize: '14px', color: '#666', lineHeight: '1.5', marginBottom: '16px' }, children: [], attributes: {} },
                                    { id: WB.generateId(), type: 'button', tagName: 'a', content: 'Learn More', attributes: { href: '#' }, styles: { display: 'inline-block', padding: '8px 20px', backgroundColor: '#6c5ce7', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }, children: [] }
                                ],
                                attributes: {}
                            }
                        ]
                    };
                },
                editableProperties: ['backgroundColor', 'borderRadius', 'boxShadow', 'maxWidth', 'margin', 'border']
            },

            'two-column': {
                label: 'Two Columns',
                icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="1" y="2" width="6" height="12" rx="1"/><rect x="9" y="2" width="6" height="12" rx="1"/></svg>',
                createNode: function() {
                    return {
                        id: WB.generateId(), type: 'two-column', tagName: 'div',
                        attributes: {},
                        styles: { display: 'flex', gap: '32px', padding: '40px', alignItems: 'center' },
                        children: [
                            {
                                id: WB.generateId(), type: 'column', tagName: 'div',
                                content: null,
                                styles: { flex: '1' },
                                children: [
                                    { id: WB.generateId(), type: 'heading', tagName: 'h2', content: 'Left Column', styles: { fontSize: '28px', fontWeight: '700', marginBottom: '12px', color: '#1a1a1a' }, children: [], attributes: {} },
                                    { id: WB.generateId(), type: 'paragraph', tagName: 'p', content: 'Add your content here. This is the left column of a two-column layout.', styles: { fontSize: '16px', lineHeight: '1.6', color: '#555' }, children: [], attributes: {} }
                                ],
                                attributes: {}
                            },
                            {
                                id: WB.generateId(), type: 'column', tagName: 'div',
                                content: null,
                                styles: { flex: '1' },
                                children: [
                                    { id: WB.generateId(), type: 'image', tagName: 'img', content: null, attributes: { src: 'https://placehold.co/500x350/e2e2e2/666?text=Image', alt: 'Column image' }, styles: { width: '100%', borderRadius: '8px' }, children: [] }
                                ],
                                attributes: {}
                            }
                        ]
                    };
                },
                editableProperties: ['gap', 'padding', 'backgroundColor', 'alignItems', 'flexDirection']
            },

            'three-column': {
                label: 'Three Columns',
                icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="1" y="2" width="3.5" height="12" rx="0.75"/><rect x="6.25" y="2" width="3.5" height="12" rx="0.75"/><rect x="11.5" y="2" width="3.5" height="12" rx="0.75"/></svg>',
                createNode: function() {
                    var cols = [];
                    var titles = ['Feature One', 'Feature Two', 'Feature Three'];
                    var descs = [
                        'Describe your first feature or service here.',
                        'Describe your second feature or service here.',
                        'Describe your third feature or service here.'
                    ];
                    for (var i = 0; i < 3; i++) {
                        cols.push({
                            id: WB.generateId(), type: 'column', tagName: 'div',
                            content: null, styles: { flex: '1', textAlign: 'center' },
                            children: [
                                { id: WB.generateId(), type: 'heading', tagName: 'h3', content: titles[i], styles: { fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }, children: [], attributes: {} },
                                { id: WB.generateId(), type: 'paragraph', tagName: 'p', content: descs[i], styles: { fontSize: '14px', lineHeight: '1.6', color: '#666' }, children: [], attributes: {} }
                            ],
                            attributes: {}
                        });
                    }
                    return {
                        id: WB.generateId(), type: 'three-column', tagName: 'div',
                        attributes: {},
                        styles: { display: 'flex', gap: '24px', padding: '40px' },
                        children: cols
                    };
                },
                editableProperties: ['gap', 'padding', 'backgroundColor', 'alignItems']
            },

            /* ---- Internal / Template node types (no createNode = not in panel) ---- */
            'div': {
                label: 'Container',
                editableProperties: [
                    'display', 'flexDirection', 'justifyContent', 'alignItems', 'gap',
                    'gridTemplateColumns', 'padding', 'margin', 'width', 'height',
                    'maxWidth', 'minHeight', 'backgroundColor', 'color',
                    'borderRadius', 'border', 'boxShadow', 'backgroundImage',
                    'opacity', 'position'
                ]
            },
            'column': {
                label: 'Column',
                editableProperties: [
                    'padding', 'margin', 'backgroundColor', 'borderRadius',
                    'textAlign', 'minHeight', 'border', 'boxShadow'
                ]
            },
            'nav-links': {
                label: 'Nav Links',
                editableProperties: [
                    'display', 'gap', 'alignItems', 'flexDirection', 'padding'
                ]
            },
            'text-inline': {
                label: 'Inline Text',
                editableProperties: [
                    'fontSize', 'fontWeight', 'color', 'textDecoration',
                    'textAlign', 'letterSpacing', 'fontFamily'
                ]
            },
            'form-input': {
                label: 'Form Input',
                editableProperties: [
                    'padding', 'border', 'borderRadius', 'fontSize',
                    'color', 'backgroundColor', 'width', 'margin'
                ]
            },
            'card-body': {
                label: 'Card Body',
                editableProperties: ['padding', 'backgroundColor', 'textAlign']
            },
            'card-item': {
                label: 'Card Item',
                editableProperties: [
                    'backgroundColor', 'borderRadius', 'padding',
                    'boxShadow', 'textAlign', 'border'
                ]
            },
            'list-item': {
                label: 'List Item',
                editableProperties: ['color', 'fontSize', 'padding', 'margin']
            },

            'card-grid': {
                label: 'Card Grid',
                icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>',
                createNode: function() {
                    var cards = [];
                    for (var i = 1; i <= 4; i++) {
                        cards.push({
                            id: WB.generateId(), type: 'card-item', tagName: 'div',
                            content: null,
                            styles: {
                                backgroundColor: '#ffffff', borderRadius: '10px', padding: '24px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center'
                            },
                            children: [
                                { id: WB.generateId(), type: 'heading', tagName: 'h3', content: 'Card ' + i, styles: { fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }, children: [], attributes: {} },
                                { id: WB.generateId(), type: 'paragraph', tagName: 'p', content: 'Brief card description.', styles: { fontSize: '14px', color: '#666', lineHeight: '1.5' }, children: [], attributes: {} }
                            ],
                            attributes: {}
                        });
                    }
                    return {
                        id: WB.generateId(), type: 'card-grid', tagName: 'div',
                        attributes: {},
                        styles: {
                            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '20px', padding: '40px', backgroundColor: '#f5f5f5'
                        },
                        children: cards
                    };
                },
                editableProperties: ['gridTemplateColumns', 'gap', 'padding', 'backgroundColor']
            }
        },

        /* === Factory === */
        createNode: function(type, options) {
            var def = this.definitions[type];
            if (!def) {
                console.error('Unknown component type: ' + type);
                return null;
            }
            var node = def.createNode(options);
            this._setParentIds(node, null);
            return node;
        },

        _setParentIds: function(node, parentId) {
            node.parentId = parentId;
            if (node.children && node.children.length) {
                for (var i = 0; i < node.children.length; i++) {
                    this._setParentIds(node.children[i], node.id);
                }
            }
        },

        getDefinition: function(type) {
            return this.definitions[type] || null;
        },

        getEditableProperties: function(type) {
            var def = this.definitions[type];
            return def ? (def.editableProperties || []) : [];
        }
    };

})(window.WebBuilder);
