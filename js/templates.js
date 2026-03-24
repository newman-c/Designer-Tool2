/* ============================================================
   WebBuilder — Template Library
   Categories: Landing Pages, Business, Portfolio, Blog,
               E-Commerce, Contact & About
   ============================================================ */
(function(WB) {
    'use strict';

    /* ---- ES5-safe style merge ---- */
    function ms(base, extra) {
        var out = {};
        var k;
        for (k in base)  { if (base.hasOwnProperty(k))  out[k] = base[k]; }
        for (k in extra) { if (extra.hasOwnProperty(k)) out[k] = extra[k]; }
        return out;
    }

    /* ---- Node factory ---- */
    function nd(tag, type, styles, content, children, attrs) {
        return {
            id:         WB.generateId(),
            tagName:    tag,
            type:       type  || 'section',
            styles:     styles || {},
            content:    content !== undefined ? content : null,
            children:   children || [],
            attributes: attrs || {},
            parentId:   null
        };
    }

    /* ---- Common style palettes ---- */
    var SECTION = { display:'flex', flexDirection:'column', alignItems:'center',
                    width:'100%', padding:'80px 40px', boxSizing:'border-box' };
    var CONTAINER = { width:'100%', maxWidth:'1100px', margin:'0 auto' };
    var H1 = { fontSize:'48px', fontWeight:'700', margin:'0 0 20px',
               color:'#1a1a2e', lineHeight:'1.15', textAlign:'center' };
    var H2 = { fontSize:'36px', fontWeight:'700', margin:'0 0 16px',
               color:'#1a1a2e', lineHeight:'1.2', textAlign:'center' };
    var H3 = { fontSize:'22px', fontWeight:'600', margin:'0 0 10px', color:'#1a1a2e' };
    var PARA = { fontSize:'17px', color:'#555', lineHeight:'1.7',
                 margin:'0 0 20px', textAlign:'center' };
    var BTN_PRIMARY = { display:'inline-block', padding:'14px 32px', backgroundColor:'#6c5ce7',
                        color:'#fff', borderRadius:'8px', fontSize:'16px',
                        fontWeight:'600', cursor:'pointer', border:'none', textDecoration:'none' };
    var BTN_OUTLINE = { display:'inline-block', padding:'14px 32px', backgroundColor:'transparent',
                        color:'#6c5ce7', border:'2px solid #6c5ce7', borderRadius:'8px',
                        fontSize:'16px', fontWeight:'600', cursor:'pointer', textDecoration:'none' };
    var CARD_BASE = { backgroundColor:'#fff', borderRadius:'12px', padding:'28px',
                      boxShadow:'0 4px 24px rgba(0,0,0,.08)', flex:'1' };
    var FLEX_ROW = { display:'flex', flexDirection:'row', gap:'24px',
                     width:'100%', flexWrap:'wrap' };
    var NAV_STYLE = { display:'flex', flexDirection:'row', alignItems:'center',
                      justifyContent:'space-between', padding:'18px 40px',
                      backgroundColor:'#fff', boxShadow:'0 2px 12px rgba(0,0,0,.07)',
                      width:'100%', boxSizing:'border-box' };
    var FOOTER_STYLE = { display:'flex', flexDirection:'column', alignItems:'center',
                         padding:'40px', backgroundColor:'#1a1a2e', color:'#aaa',
                         width:'100%', boxSizing:'border-box', gap:'10px' };

    /* ==============================================================
       HELPER BUILDERS
       ============================================================== */

    function makeNavbar(logoText, links) {
        var navLinks = nd('div', 'div',
            { display:'flex', flexDirection:'row', gap:'28px', alignItems:'center' });
        links = links || ['Home', 'About', 'Services', 'Contact'];
        for (var i = 0; i < links.length; i++) {
            navLinks.children.push(
                nd('a', 'link', { color:'#333', fontSize:'15px', textDecoration:'none',
                                  fontWeight:'500' }, links[i], [], { href:'#' })
            );
        }
        return nd('nav', 'navbar', NAV_STYLE, null, [
            nd('span', 'heading', { fontSize:'22px', fontWeight:'700', color:'#6c5ce7' },
               logoText || 'MyBrand'),
            navLinks
        ]);
    }

    function makeFooter(text) {
        return nd('footer', 'footer', FOOTER_STYLE, null, [
            nd('p', 'paragraph', { color:'#aaa', fontSize:'14px', margin:'0' },
               text || '\u00a9 2025 MyBrand. All rights reserved.')
        ]);
    }

    function makeHeroSection(title, subtitle, btnLabel) {
        var btns = nd('div', 'div',
            { display:'flex', flexDirection:'row', gap:'14px', justifyContent:'center',
              flexWrap:'wrap' }, null, [
            nd('button', 'button', BTN_PRIMARY, btnLabel || 'Get Started'),
            nd('button', 'button', BTN_OUTLINE, 'Learn More')
        ]);
        return nd('section', 'section',
            ms(SECTION, { backgroundImage:'linear-gradient(135deg,#f5f3ff 0%,#ede9fe 100%)',
                          minHeight:'480px', justifyContent:'center' }), null, [
            nd('div', 'div', CONTAINER, null, [
                nd('h1', 'heading', H1, title || 'Build Something Amazing'),
                nd('p',  'paragraph', ms(PARA, { maxWidth:'600px', margin:'0 auto 32px' }),
                   subtitle || 'Create stunning websites with our powerful drag-and-drop builder.'),
                btns
            ])
        ]);
    }

    function makeCard(icon, title, text) {
        return nd('div', 'div', ms(CARD_BASE, { display:'flex', flexDirection:'column' }), null, [
            nd('div', 'div',
               { fontSize:'32px', marginBottom:'12px', lineHeight:'1' }, icon || '\u2b50'),
            nd('h3', 'heading', H3, title || 'Feature Title'),
            nd('p',  'paragraph', { fontSize:'15px', color:'#666', lineHeight:'1.6',
                                    margin:'0' }, text || 'Short description of this feature.')
        ]);
    }

    function makeThreeCards(c1, c2, c3) {
        return nd('div', 'div', ms(FLEX_ROW, { justifyContent:'center' }), null, [
            makeCard(c1[0], c1[1], c1[2]),
            makeCard(c2[0], c2[1], c2[2]),
            makeCard(c3[0], c3[1], c3[2])
        ]);
    }

    /* ==============================================================
       SVG PREVIEWS  (viewBox 200 × 120, dark theme)
       ============================================================== */
    var C = { bg:'#1e1e2e', panel:'#252535', accent:'#6c5ce7', text:'#aaa',
              light:'#ccc', nav:'#2a2a3e', card:'#2e2e42' };

    function svgOpen() {
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120">' +
               '<rect width="200" height="120" fill="' + C.bg + '"/>';
    }
    function svgClose() { return '</svg>'; }

    /* Nav bar strip */
    function svgNav() {
        return '<rect x="0" y="0" width="200" height="14" fill="' + C.nav + '"/>' +
               '<rect x="8" y="4" width="28" height="6" rx="2" fill="' + C.accent + '"/>' +
               '<rect x="130" y="5" width="16" height="4" rx="1" fill="' + C.text + '"/>' +
               '<rect x="150" y="5" width="16" height="4" rx="1" fill="' + C.text + '"/>' +
               '<rect x="170" y="5" width="16" height="4" rx="1" fill="' + C.text + '"/>';
    }
    /* Footer strip */
    function svgFooter(y) {
        y = y || 110;
        return '<rect x="0" y="' + y + '" width="200" height="10" fill="' + C.nav + '"/>' +
               '<rect x="70" y="' + (y+3) + '" width="60" height="3" rx="1" fill="' + C.text + '"/>';
    }
    /* Hero block */
    function svgHero(y, h, grad1, grad2) {
        grad1 = grad1 || '#3d3068';
        grad2 = grad2 || '#1e1e40';
        return '<defs><linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%">' +
               '<stop offset="0%" stop-color="' + grad1 + '"/>' +
               '<stop offset="100%" stop-color="' + grad2 + '"/>' +
               '</linearGradient></defs>' +
               '<rect x="0" y="' + y + '" width="200" height="' + h + '" fill="url(#hg)"/>' +
               '<rect x="55" y="' + (y+14) + '" width="90" height="8" rx="2" fill="' + C.light + '"/>' +
               '<rect x="65" y="' + (y+26) + '" width="70" height="4" rx="1" fill="' + C.text + '"/>' +
               '<rect x="70" y="' + (y+36) + '" width="26" height="8" rx="3" fill="' + C.accent + '"/>' +
               '<rect x="102" y="' + (y+36) + '" width="26" height="8" rx="3" fill="' + C.panel + '"/>';
    }
    /* Card block */
    function svgCard(x, y, w, h) {
        return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h +
               '" rx="4" fill="' + C.card + '"/>' +
               '<rect x="' + (x+6) + '" y="' + (y+6) + '" width="' + (w/2) + '" height="4" rx="1" fill="' + C.accent + '"/>' +
               '<rect x="' + (x+6) + '" y="' + (y+14) + '" width="' + (w-12) + '" height="3" rx="1" fill="' + C.text + '"/>' +
               '<rect x="' + (x+6) + '" y="' + (y+20) + '" width="' + (w-20) + '" height="3" rx="1" fill="' + C.text + '"/>';
    }
    /* Horizontal split */
    function svgSplit(y, h) {
        var half = 95;
        return '<rect x="8" y="' + y + '" width="' + half + '" height="' + h +
               '" rx="3" fill="' + C.panel + '"/>' +
               '<rect x="16" y="' + (y+10) + '" width="50" height="6" rx="2" fill="' + C.light + '"/>' +
               '<rect x="16" y="' + (y+20) + '" width="70" height="3" rx="1" fill="' + C.text + '"/>' +
               '<rect x="16" y="' + (y+27) + '" width="60" height="3" rx="1" fill="' + C.text + '"/>' +
               '<rect x="16" y="' + (y+36) + '" width="28" height="7" rx="3" fill="' + C.accent + '"/>' +
               '<rect x="' + (half+10) + '" y="' + y + '" width="' + half + '" height="' + h +
               '" rx="3" fill="' + C.panel + '"/>' +
               '<rect x="' + (half+18) + '" y="' + (y+8) + '" width="' + (half-28) + '" height="' + (h-16) +
               '" rx="2" fill="' + C.card + '"/>';
    }

    /* ==============================================================
       TEMPLATE DEFINITIONS
       ============================================================== */
    WB.Templates = {

        categories: [
            { id: 'landing',   label: 'Landing Pages' },
            { id: 'business',  label: 'Business' },
            { id: 'portfolio', label: 'Portfolio' },
            { id: 'blog',      label: 'Blog' },
            { id: 'ecommerce', label: 'E-Commerce' },
            { id: 'contact',   label: 'Contact & About' }
        ],

        all: [

            /* ======================================================
               LANDING PAGES
               ====================================================== */
            {
                id: 'landing-startup',
                category: 'landing',
                name: 'Startup Landing',
                desc: 'Hero + features + CTA',
                preview: svgOpen() + svgNav() +
                    svgHero(14, 56) +
                    svgCard(8,  76, 57, 34) +
                    svgCard(71, 76, 57, 34) +
                    svgCard(134,76, 57, 34) +
                    svgFooter(113) + svgClose(),
                create: function() {
                    var featSection = nd('section', 'section',
                        ms(SECTION, { backgroundColor:'#f8f7ff', padding:'60px 40px' }), null, [
                        nd('div', 'div', CONTAINER, null, [
                            nd('h2', 'heading', H2, 'Why Choose Us?'),
                            nd('p', 'paragraph', ms(PARA, { marginBottom:'40px' }),
                               'We deliver results that matter.'),
                            makeThreeCards(
                                ['\u26a1', 'Lightning Fast', 'Optimized for speed and performance.'],
                                ['\ud83d\udd12', 'Secure', 'Enterprise-grade security built in.'],
                                ['\ud83d\udcc8', 'Scalable', 'Grows with your business needs.']
                            )
                        ])
                    ]);
                    var ctaSection = nd('section', 'section',
                        ms(SECTION, { backgroundColor:'#6c5ce7', padding:'60px 40px' }), null, [
                        nd('h2', 'heading', ms(H2, { color:'#fff' }), 'Ready to Get Started?'),
                        nd('p', 'paragraph', ms(PARA, { color:'rgba(255,255,255,.8)', marginBottom:'32px' }),
                           'Join thousands of businesses already using our platform.'),
                        nd('button', 'button',
                           ms(BTN_PRIMARY, { backgroundColor:'#fff', color:'#6c5ce7' }),
                           'Start Free Trial')
                    ]);
                    return [makeNavbar(), makeHeroSection(), featSection, ctaSection, makeFooter()];
                }
            },

            {
                id: 'landing-saas',
                category: 'landing',
                name: 'SaaS Product',
                desc: 'Split hero + pricing section',
                preview: svgOpen() + svgNav() +
                    svgSplit(15, 55) +
                    '<rect x="0" y="75" width="200" height="35" fill="' + C.panel + '"/>' +
                    '<rect x="60" y="80" width="80" height="5" rx="2" fill="' + C.light + '"/>' +
                    svgCard(12, 83, 52, 22) + svgCard(74, 83, 52, 22) + svgCard(136, 83, 52, 22) +
                    svgFooter(113) + svgClose(),
                create: function() {
                    var splitSection = nd('section', 'section',
                        ms(SECTION, { flexDirection:'row', gap:'48px', padding:'80px 40px',
                                      backgroundColor:'#fff', alignItems:'center' }), null, [
                        nd('div', 'div',
                           { flex:'1', minWidth:'280px' }, null, [
                            nd('h1', 'heading',
                               ms(H1, { textAlign:'left', fontSize:'42px' }),
                               'Your Team\'s New Superpower'),
                            nd('p', 'paragraph',
                               ms(PARA, { textAlign:'left', marginBottom:'28px' }),
                               'Streamline workflows and boost productivity with our all-in-one platform.'),
                            nd('button', 'button', BTN_PRIMARY, 'Try Free for 14 Days')
                        ]),
                        nd('div', 'div',
                           { flex:'1', minWidth:'280px', backgroundColor:'#f5f3ff',
                             borderRadius:'16px', height:'280px', display:'flex',
                             alignItems:'center', justifyContent:'center' }, null, [
                            nd('p', 'paragraph',
                               { color:'#6c5ce7', fontSize:'14px', margin:'0' },
                               'App Screenshot / Demo')
                        ])
                    ]);
                    var pricingSection = nd('section', 'section',
                        ms(SECTION, { backgroundColor:'#f8f7ff', padding:'60px 40px' }), null, [
                        nd('div', 'div', CONTAINER, null, [
                            nd('h2', 'heading', H2, 'Simple Pricing'),
                            makeThreeCards(
                                ['\ud83c\udf31', 'Starter', 'Free forever for small teams.'],
                                ['\ud83d\ude80', 'Pro', '$29/mo — For growing businesses.'],
                                ['\ud83c\udfe2', 'Enterprise', 'Custom pricing for large orgs.']
                            )
                        ])
                    ]);
                    return [makeNavbar(), splitSection, pricingSection, makeFooter()];
                }
            },

            {
                id: 'landing-agency',
                category: 'landing',
                name: 'Creative Agency',
                desc: 'Bold header + services grid',
                preview: svgOpen() + svgNav() +
                    svgHero(14, 48, '#2d1b69', '#0f0f23') +
                    svgCard(8, 68, 84, 38) + svgCard(108, 68, 84, 38) +
                    svgCard(8, 110, 84, 6) + svgCard(108, 110, 84, 6) +
                    svgFooter(113) + svgClose(),
                create: function() {
                    var heroSection = nd('section', 'section',
                        ms(SECTION, { backgroundImage:'linear-gradient(135deg,#2d1b69 0%,#11998e 100%)',
                                      minHeight:'440px', justifyContent:'center' }), null, [
                        nd('div', 'div', ms(CONTAINER, { textAlign:'center' }), null, [
                            nd('h1', 'heading',
                               ms(H1, { color:'#fff', fontSize:'54px' }),
                               'We Craft Digital Experiences'),
                            nd('p', 'paragraph',
                               ms(PARA, { color:'rgba(255,255,255,.8)', marginBottom:'32px' }),
                               'Award-winning design & development studio.'),
                            nd('button', 'button',
                               ms(BTN_PRIMARY, { backgroundColor:'#fff', color:'#2d1b69' }),
                               'View Our Work')
                        ])
                    ]);
                    var servicesSection = nd('section', 'section',
                        ms(SECTION, { padding:'64px 40px' }), null, [
                        nd('div', 'div', CONTAINER, null, [
                            nd('h2', 'heading', H2, 'Our Services'),
                            makeThreeCards(
                                ['\ud83c\udfa8', 'Brand Design', 'Logo, identity & visual systems.'],
                                ['\ud83d\udcbb', 'Web Development', 'Fast, modern, accessible websites.'],
                                ['\ud83d\udcf1', 'Mobile Apps', 'iOS & Android app development.']
                            )
                        ])
                    ]);
                    return [makeNavbar(), heroSection, servicesSection, makeFooter()];
                }
            },

            {
                id: 'landing-product',
                category: 'landing',
                name: 'Product Launch',
                desc: 'Centered hero + feature highlights',
                preview: svgOpen() +
                    svgHero(0, 65, '#0f2027', '#203a43') +
                    svgCard(8,  70, 57, 30) + svgCard(71, 70, 57, 30) + svgCard(134, 70, 57, 30) +
                    '<rect x="60" y="104" width="80" height="10" rx="4" fill="' + C.accent + '"/>' +
                    svgFooter(117) + svgClose(),
                create: function() {
                    var hero = nd('section', 'section',
                        ms(SECTION, { backgroundImage:'linear-gradient(160deg,#0f2027,#2c5364)',
                                      minHeight:'500px', justifyContent:'center',
                                      paddingBottom:'60px' }), null, [
                        nd('div', 'div', ms(CONTAINER, { textAlign:'center' }), null, [
                            nd('p', 'paragraph',
                               { fontSize:'13px', fontWeight:'600', color:'#a78bfa',
                                 letterSpacing:'3px', textTransform:'uppercase',
                                 margin:'0 0 16px', textAlign:'center' },
                               'Introducing'),
                            nd('h1', 'heading',
                               ms(H1, { color:'#fff', fontSize:'56px' }), 'Product Name'),
                            nd('p', 'paragraph',
                               ms(PARA, { color:'rgba(255,255,255,.75)', marginBottom:'36px' }),
                               'The next generation tool for modern teams.'),
                            nd('button', 'button', BTN_PRIMARY, 'Get Early Access')
                        ])
                    ]);
                    var features = nd('section', 'section',
                        ms(SECTION, { padding:'60px 40px' }), null, [
                        nd('div', 'div', CONTAINER, null, [
                            nd('h2', 'heading', H2, 'Everything You Need'),
                            makeThreeCards(
                                ['\ud83e\udde0', 'AI-Powered', 'Smart suggestions and automation.'],
                                ['\ud83d\udd17', 'Integrations', 'Connects with 200+ tools.'],
                                ['\ud83d\udcca', 'Analytics', 'Real-time insights and dashboards.']
                            )
                        ])
                    ]);
                    var cta = nd('section', 'section',
                        ms(SECTION, { backgroundColor:'#6c5ce7', padding:'56px 40px' }), null, [
                        nd('h2', 'heading', ms(H2, { color:'#fff' }), 'Start Building Today'),
                        nd('button', 'button',
                           ms(BTN_PRIMARY, { backgroundColor:'#fff', color:'#6c5ce7' }),
                           'Sign Up Free')
                    ]);
                    return [hero, features, cta, makeFooter()];
                }
            },

            /* ======================================================
               BUSINESS
               ====================================================== */
            {
                id: 'business-corporate',
                category: 'business',
                name: 'Corporate Website',
                desc: 'Professional layout with about & team',
                preview: svgOpen() + svgNav() +
                    svgHero(14, 40, '#1a237e', '#283593') +
                    svgSplit(58, 48) +
                    svgFooter(113) + svgClose(),
                create: function() {
                    var hero = makeHeroSection('Trusted by 10,000+ Businesses',
                        'Professional solutions for every scale.', 'Schedule a Demo');
                    var aboutSection = nd('section', 'section',
                        ms(SECTION, { flexDirection:'row', gap:'60px', padding:'80px 40px',
                                      alignItems:'center' }), null, [
                        nd('div', 'div', { flex:'1', minWidth:'260px' }, null, [
                            nd('h2', 'heading', ms(H2, { textAlign:'left' }), 'About Our Company'),
                            nd('p', 'paragraph', ms(PARA, { textAlign:'left', marginBottom:'16px' }),
                               'Founded in 2010, we have helped hundreds of organizations transform their digital presence.'),
                            nd('p', 'paragraph', ms(PARA, { textAlign:'left' }),
                               'Our team of 50+ experts brings deep industry knowledge to every project.'),
                            nd('button', 'button', BTN_PRIMARY, 'Meet The Team')
                        ]),
                        nd('div', 'div',
                           { flex:'1', minWidth:'260px', display:'grid',
                             gridTemplateColumns:'1fr 1fr', gap:'16px' }, null, [
                            nd('div', 'div', ms(CARD_BASE, { textAlign:'center', padding:'20px' }),
                               null, [
                                nd('p', 'paragraph',
                                   { fontSize:'32px', fontWeight:'700', color:'#6c5ce7',
                                     margin:'0 0 4px' }, '10K+'),
                                nd('p', 'paragraph', { fontSize:'14px', color:'#666', margin:'0' },
                                   'Customers')
                            ]),
                            nd('div', 'div', ms(CARD_BASE, { textAlign:'center', padding:'20px' }),
                               null, [
                                nd('p', 'paragraph',
                                   { fontSize:'32px', fontWeight:'700', color:'#6c5ce7',
                                     margin:'0 0 4px' }, '15+'),
                                nd('p', 'paragraph', { fontSize:'14px', color:'#666', margin:'0' },
                                   'Years')
                            ]),
                            nd('div', 'div', ms(CARD_BASE, { textAlign:'center', padding:'20px' }),
                               null, [
                                nd('p', 'paragraph',
                                   { fontSize:'32px', fontWeight:'700', color:'#6c5ce7',
                                     margin:'0 0 4px' }, '50+'),
                                nd('p', 'paragraph', { fontSize:'14px', color:'#666', margin:'0' },
                                   'Experts')
                            ]),
                            nd('div', 'div', ms(CARD_BASE, { textAlign:'center', padding:'20px' }),
                               null, [
                                nd('p', 'paragraph',
                                   { fontSize:'32px', fontWeight:'700', color:'#6c5ce7',
                                     margin:'0 0 4px' }, '98%'),
                                nd('p', 'paragraph', { fontSize:'14px', color:'#666', margin:'0' },
                                   'Satisfaction')
                            ])
                        ])
                    ]);
                    return [makeNavbar(), hero, aboutSection, makeFooter()];
                }
            },

            {
                id: 'business-restaurant',
                category: 'business',
                name: 'Restaurant / Cafe',
                desc: 'Menu sections and atmosphere',
                preview: svgOpen() + svgNav() +
                    svgHero(14, 50, '#3e1f00', '#7b3f00') +
                    svgCard(8, 70, 57, 34) + svgCard(71, 70, 57, 34) + svgCard(134, 70, 57, 34) +
                    svgFooter(113) + svgClose(),
                create: function() {
                    var hero = nd('section', 'section',
                        ms(SECTION, { backgroundImage:'linear-gradient(160deg,#3e1f00,#c0392b)',
                                      minHeight:'460px', justifyContent:'center' }), null, [
                        nd('div', 'div', ms(CONTAINER, { textAlign:'center' }), null, [
                            nd('h1', 'heading', ms(H1, { color:'#fff' }), 'A Taste of Excellence'),
                            nd('p', 'paragraph',
                               ms(PARA, { color:'rgba(255,255,255,.8)', marginBottom:'32px' }),
                               'Fresh ingredients, bold flavors, memorable moments.'),
                            nd('button', 'button',
                               ms(BTN_PRIMARY, { backgroundColor:'#e74c3c', border:'none' }),
                               'Reserve a Table')
                        ])
                    ]);
                    var menu = nd('section', 'section',
                        ms(SECTION, { padding:'64px 40px', backgroundColor:'#fffdf9' }), null, [
                        nd('div', 'div', CONTAINER, null, [
                            nd('h2', 'heading', H2, 'Our Menu'),
                            makeThreeCards(
                                ['\ud83c\udf55', 'Starters', 'Fresh seasonal salads and soups.'],
                                ['\ud83c\udf56', 'Main Course', 'Grilled, roasted and braised perfection.'],
                                ['\ud83c\udf70', 'Desserts', 'Handcrafted sweets and pastries.']
                            )
                        ])
                    ]);
                    return [makeNavbar('Bistro', ['Menu', 'About', 'Gallery', 'Reserve']),
                            hero, menu, makeFooter('\u00a9 2025 Bistro. Fine Dining.')];
                }
            },

            {
                id: 'business-consulting',
                category: 'business',
                name: 'Consulting Firm',
                desc: 'Services + testimonials layout',
                preview: svgOpen() + svgNav() +
                    svgHero(14, 44, '#0d1b2a', '#1b4332') +
                    svgCard(8, 64, 57, 34) + svgCard(71, 64, 57, 34) + svgCard(134, 64, 57, 34) +
                    '<rect x="20" y="104" width="160" height="8" rx="3" fill="' + C.panel + '"/>' +
                    svgFooter(115) + svgClose(),
                create: function() {
                    var hero = nd('section', 'section',
                        ms(SECTION, { backgroundImage:'linear-gradient(135deg,#0d1b2a,#1b4332)',
                                      minHeight:'440px', justifyContent:'center' }), null, [
                        nd('div', 'div', CONTAINER, null, [
                            nd('h1', 'heading', ms(H1, { color:'#fff' }),
                               'Strategic Consulting for Growth'),
                            nd('p', 'paragraph',
                               ms(PARA, { color:'rgba(255,255,255,.8)', marginBottom:'32px' }),
                               'Data-driven insights and actionable strategies for your business.'),
                            nd('button', 'button',
                               ms(BTN_PRIMARY, { backgroundColor:'#27ae60' }), 'Get a Free Audit')
                        ])
                    ]);
                    var services = nd('section', 'section',
                        ms(SECTION, { padding:'64px 40px' }), null, [
                        nd('div', 'div', CONTAINER, null, [
                            nd('h2', 'heading', H2, 'Our Expertise'),
                            makeThreeCards(
                                ['\ud83d\udcca', 'Strategy', 'Business planning and market analysis.'],
                                ['\ud83d\udcb0', 'Finance', 'Investment and cost optimization.'],
                                ['\ud83e\udd1d', 'Operations', 'Process improvement and efficiency.']
                            )
                        ])
                    ]);
                    var testimonial = nd('section', 'section',
                        ms(SECTION, { backgroundColor:'#f0faf5', padding:'60px 40px' }), null, [
                        nd('div', 'div', ms(CONTAINER, { maxWidth:'700px' }), null, [
                            nd('p', 'paragraph',
                               { fontSize:'20px', fontStyle:'italic', color:'#333',
                                 lineHeight:'1.7', textAlign:'center', margin:'0 0 20px' },
                               '"Working with this team transformed our bottom line. Exceptional value."'),
                            nd('p', 'paragraph',
                               { fontSize:'15px', fontWeight:'600', color:'#6c5ce7',
                                 textAlign:'center', margin:'0' },
                               '\u2014 Sarah M., CFO at TechCorp')
                        ])
                    ]);
                    return [makeNavbar('Consult', ['Services', 'Case Studies', 'About', 'Contact']),
                            hero, services, testimonial, makeFooter()];
                }
            },

            /* ======================================================
               PORTFOLIO
               ====================================================== */
            {
                id: 'portfolio-designer',
                category: 'portfolio',
                name: 'Designer Portfolio',
                desc: 'Clean portfolio with project grid',
                preview: svgOpen() + svgNav() +
                    svgHero(14, 42, '#1a1a2e', '#16213e') +
                    svgCard(8, 62, 57, 38) + svgCard(71, 62, 57, 38) + svgCard(134, 62, 57, 38) +
                    svgFooter(113) + svgClose(),
                create: function() {
                    var hero = nd('section', 'section',
                        ms(SECTION, { backgroundColor:'#1a1a2e', minHeight:'360px',
                                      justifyContent:'center' }), null, [
                        nd('div', 'div', CONTAINER, null, [
                            nd('h1', 'heading', ms(H1, { color:'#fff', fontSize:'52px' }),
                               'Hi, I\'m Alex \u2014 UI/UX Designer'),
                            nd('p', 'paragraph',
                               ms(PARA, { color:'rgba(255,255,255,.7)', marginBottom:'32px' }),
                               'I craft beautiful digital experiences that users love.'),
                            nd('button', 'button', BTN_PRIMARY, 'View My Work')
                        ])
                    ]);
                    var workSection = nd('section', 'section',
                        ms(SECTION, { padding:'64px 40px' }), null, [
                        nd('div', 'div', CONTAINER, null, [
                            nd('h2', 'heading', H2, 'Selected Work'),
                            makeThreeCards(
                                ['\ud83c\udfa8', 'Brand Redesign', 'Complete visual identity for a fintech startup.'],
                                ['\ud83d\udcf1', 'Mobile App UI', 'iOS fitness tracking app, 50K+ downloads.'],
                                ['\ud83d\uddbc\ufe0f', 'Dashboard', 'Analytics dashboard for e-commerce platform.']
                            )
                        ])
                    ]);
                    var skillsSection = nd('section', 'section',
                        ms(SECTION, { backgroundColor:'#f8f7ff', padding:'56px 40px' }), null, [
                        nd('div', 'div', CONTAINER, null, [
                            nd('h2', 'heading', H2, 'Skills & Tools'),
                            nd('div', 'div', ms(FLEX_ROW, { justifyContent:'center', gap:'12px',
                                                             flexWrap:'wrap' }), null, [
                                'Figma', 'Sketch', 'Adobe XD', 'Prototyping',
                                'HTML/CSS', 'React', 'User Research'
                            ].map(function(skill) {
                                return nd('span', 'div',
                                    { display:'inline-block', padding:'8px 18px',
                                      backgroundColor:'#ede9fe', color:'#6c5ce7',
                                      borderRadius:'100px', fontSize:'14px',
                                      fontWeight:'600' }, skill);
                            }))
                        ])
                    ]);
                    return [makeNavbar('Alex.design', ['Work', 'About', 'Skills', 'Contact']),
                            hero, workSection, skillsSection,
                            makeFooter('\u00a9 2025 Alex Designer. All rights reserved.')];
                }
            },

            {
                id: 'portfolio-developer',
                category: 'portfolio',
                name: 'Developer Portfolio',
                desc: 'Code-focused with projects & skills',
                preview: svgOpen() + svgNav() +
                    svgHero(14, 44, '#0f0f1a', '#1a1a35') +
                    svgCard(8, 64, 84, 32) + svgCard(108, 64, 84, 32) +
                    svgCard(8, 100, 84, 12) + svgCard(108, 100, 84, 12) +
                    svgFooter(115) + svgClose(),
                create: function() {
                    var hero = nd('section', 'section',
                        ms(SECTION, { backgroundColor:'#0f0f1a', minHeight:'420px',
                                      justifyContent:'center' }), null, [
                        nd('div', 'div', CONTAINER, null, [
                            nd('p', 'paragraph',
                               { fontSize:'14px', color:'#6c5ce7', fontWeight:'600',
                                 letterSpacing:'2px', textTransform:'uppercase',
                                 margin:'0 0 12px', textAlign:'center' },
                               'Full Stack Developer'),
                            nd('h1', 'heading',
                               ms(H1, { color:'#fff', fontSize:'50px' }),
                               'Jordan Chen'),
                            nd('p', 'paragraph',
                               ms(PARA, { color:'rgba(255,255,255,.65)', marginBottom:'32px' }),
                               'Building scalable web applications with modern technologies.'),
                            nd('div', 'div',
                               { display:'flex', flexDirection:'row', gap:'14px',
                                 justifyContent:'center', flexWrap:'wrap' }, null, [
                                nd('button', 'button', BTN_PRIMARY, 'View Projects'),
                                nd('button', 'button',
                                   ms(BTN_OUTLINE, { color:'#fff', borderColor:'rgba(255,255,255,.4)' }),
                                   'Download CV')
                            ])
                        ])
                    ]);
                    var projects = nd('section', 'section',
                        ms(SECTION, { padding:'64px 40px' }), null, [
                        nd('div', 'div', CONTAINER, null, [
                            nd('h2', 'heading', H2, 'Featured Projects'),
                            nd('div', 'div', ms(FLEX_ROW, { justifyContent:'center' }), null, [
                                makeCard('\ud83d\udee0\ufe0f', 'WebBuilder Tool',
                                         'Drag-and-drop website builder. Vanilla JS, 5K+ users.'),
                                makeCard('\ud83d\udcca', 'Data Dashboard',
                                         'Real-time analytics with D3.js and Node.js backend.')
                            ]),
                            nd('div', 'div',
                               ms(FLEX_ROW, { justifyContent:'center', marginTop:'24px' }), null, [
                                makeCard('\ud83e\udd16', 'AI Chatbot',
                                         'GPT-powered customer service bot, integrated with Slack.'),
                                makeCard('\ud83d\uded2', 'E-Commerce API',
                                         'REST API with payment processing and inventory management.')
                            ])
                        ])
                    ]);
                    return [makeNavbar('JC.dev', ['Projects', 'Skills', 'Blog', 'Contact']),
                            hero, projects, makeFooter()];
                }
            },

            {
                id: 'portfolio-photographer',
                category: 'portfolio',
                name: 'Photographer Portfolio',
                desc: 'Visual gallery showcase',
                preview: svgOpen() + svgNav() +
                    svgHero(14, 50, '#111', '#222') +
                    svgCard(8,  70, 38, 36) + svgCard(52, 70, 38, 36) + svgCard(96, 70, 38, 36) +
                    svgCard(140, 70, 52, 36) +
                    svgFooter(113) + svgClose(),
                create: function() {
                    var hero = nd('section', 'section',
                        ms(SECTION, { backgroundColor:'#111', minHeight:'420px',
                                      justifyContent:'center' }), null, [
                        nd('h1', 'heading', ms(H1, { color:'#fff', fontSize:'56px',
                                                      letterSpacing:'-1px' }),
                           'Capturing Moments'),
                        nd('p', 'paragraph',
                           ms(PARA, { color:'rgba(255,255,255,.6)', marginBottom:'32px' }),
                           'Fine art photography — portraits, landscapes, events.'),
                        nd('button', 'button',
                           ms(BTN_PRIMARY, { backgroundColor:'transparent',
                                             border:'1px solid rgba(255,255,255,.4)',
                                             color:'#fff' }),
                           'View Gallery')
                    ]);
                    var gallery = nd('section', 'section',
                        ms(SECTION, { backgroundColor:'#1a1a1a', padding:'48px 40px' }), null, [
                        nd('h2', 'heading', ms(H2, { color:'#fff', marginBottom:'32px' }),
                           'Gallery'),
                        nd('div', 'div',
                           { display:'grid', gridTemplateColumns:'repeat(3, 1fr)',
                             gap:'12px', width:'100%', maxWidth:'1100px',
                             margin:'0 auto' }, null, [
                            nd('div', 'div',
                               { backgroundColor:'#2a2a2a', borderRadius:'8px',
                                 height:'200px', display:'flex', alignItems:'center',
                                 justifyContent:'center', color:'#555', fontSize:'14px' },
                               'Photo 1'),
                            nd('div', 'div',
                               { backgroundColor:'#2a2a2a', borderRadius:'8px',
                                 height:'200px', display:'flex', alignItems:'center',
                                 justifyContent:'center', color:'#555', fontSize:'14px' },
                               'Photo 2'),
                            nd('div', 'div',
                               { backgroundColor:'#2a2a2a', borderRadius:'8px',
                                 height:'200px', display:'flex', alignItems:'center',
                                 justifyContent:'center', color:'#555', fontSize:'14px' },
                               'Photo 3'),
                            nd('div', 'div',
                               { backgroundColor:'#2a2a2a', borderRadius:'8px',
                                 height:'200px', display:'flex', alignItems:'center',
                                 justifyContent:'center', color:'#555', fontSize:'14px' },
                               'Photo 4'),
                            nd('div', 'div',
                               { backgroundColor:'#2a2a2a', borderRadius:'8px',
                                 height:'200px', display:'flex', alignItems:'center',
                                 justifyContent:'center', color:'#555', fontSize:'14px' },
                               'Photo 5'),
                            nd('div', 'div',
                               { backgroundColor:'#2a2a2a', borderRadius:'8px',
                                 height:'200px', display:'flex', alignItems:'center',
                                 justifyContent:'center', color:'#555', fontSize:'14px' },
                               'Photo 6')
                        ])
                    ]);
                    return [makeNavbar('LENS', ['Gallery', 'About', 'Services', 'Contact']),
                            hero, gallery, makeFooter('\u00a9 2025 Lens Photography.')];
                }
            },

            /* ======================================================
               BLOG
               ====================================================== */
            {
                id: 'blog-magazine',
                category: 'blog',
                name: 'Blog / Magazine',
                desc: 'Featured post + article grid',
                preview: svgOpen() + svgNav() +
                    svgHero(14, 38, '#1a1a2e', '#16213e') +
                    svgCard(8, 58, 57, 42) + svgCard(71, 58, 57, 42) + svgCard(134, 58, 57, 42) +
                    svgFooter(113) + svgClose(),
                create: function() {
                    var featured = nd('section', 'section',
                        ms(SECTION, { backgroundImage:'linear-gradient(135deg,#1a1a2e,#16213e)',
                                      padding:'60px 40px' }), null, [
                        nd('div', 'div', CONTAINER, null, [
                            nd('p', 'paragraph',
                               { fontSize:'12px', fontWeight:'600', color:'#6c5ce7',
                                 letterSpacing:'2px', textTransform:'uppercase',
                                 margin:'0 0 12px', textAlign:'center' },
                               'Featured Article'),
                            nd('h1', 'heading', ms(H1, { color:'#fff', fontSize:'44px' }),
                               'The Future of Web Development in 2025'),
                            nd('p', 'paragraph',
                               ms(PARA, { color:'rgba(255,255,255,.7)', marginBottom:'28px' }),
                               'Exploring the trends shaping how we build the web.'),
                            nd('button', 'button', BTN_PRIMARY, 'Read Article')
                        ])
                    ]);
                    var articles = nd('section', 'section',
                        ms(SECTION, { padding:'60px 40px' }), null, [
                        nd('div', 'div', CONTAINER, null, [
                            nd('h2', 'heading', H2, 'Latest Articles'),
                            makeThreeCards(
                                ['\ud83d\udcdd', 'CSS Grid in 2025', 'New techniques for responsive layouts.'],
                                ['\u26a1', 'Web Performance', 'Core Web Vitals and what they mean.'],
                                ['\ud83e\udd16', 'AI & Development', 'How AI is changing our workflow.']
                            )
                        ])
                    ]);
                    return [makeNavbar('TheBlog', ['Articles', 'Topics', 'Newsletter', 'About']),
                            featured, articles, makeFooter()];
                }
            },

            {
                id: 'blog-personal',
                category: 'blog',
                name: 'Personal Blog',
                desc: 'Minimal personal journal style',
                preview: svgOpen() + svgNav() +
                    svgSplit(15, 44) +
                    svgCard(8, 64, 180, 16) + svgCard(8, 84, 180, 16) + svgCard(8, 104, 180, 9) +
                    svgFooter(116) + svgClose(),
                create: function() {
                    var header = nd('section', 'section',
                        ms(SECTION, { padding:'60px 40px', backgroundColor:'#fafafa',
                                      flexDirection:'row', gap:'48px', alignItems:'center' }),
                        null, [
                        nd('div', 'div', { flex:'1', minWidth:'200px' }, null, [
                            nd('div', 'div',
                               { width:'80px', height:'80px', borderRadius:'50%',
                                 backgroundColor:'#ede9fe', display:'flex', alignItems:'center',
                                 justifyContent:'center', fontSize:'32px',
                                 marginBottom:'16px' }, '\ud83d\udcdd'),
                            nd('h1', 'heading', ms(H1, { textAlign:'left', fontSize:'36px' }),
                               'Thoughts & Ideas'),
                            nd('p', 'paragraph', ms(PARA, { textAlign:'left', marginBottom:'16px' }),
                               'A personal space to share insights about life, tech, and creativity.')
                        ]),
                        nd('div', 'div', { flex:'2', minWidth:'280px' }, null, [
                            nd('p', 'paragraph',
                               { fontSize:'14px', fontWeight:'600', color:'#6c5ce7',
                                 marginBottom:'8px', textAlign:'left' },
                               'Latest post'),
                            nd('h2', 'heading',
                               ms(H2, { textAlign:'left', fontSize:'28px', marginBottom:'12px' }),
                               'Finding Balance in a Noisy World'),
                            nd('p', 'paragraph', ms(PARA, { textAlign:'left', marginBottom:'20px' }),
                               'A reflection on mindfulness, digital detox, and rediscovering silence.'),
                            nd('button', 'button', BTN_PRIMARY, 'Read More')
                        ])
                    ]);
                    var posts = nd('section', 'section',
                        ms(SECTION, { padding:'48px 40px' }), null, [
                        nd('div', 'div', CONTAINER, null, [
                            nd('h2', 'heading', ms(H2, { textAlign:'left' }), 'Recent Posts'),
                            nd('div', 'div',
                               { display:'flex', flexDirection:'column', gap:'20px' }, null, [
                                nd('article', 'div',
                                   { borderBottom:'1px solid #eee', paddingBottom:'20px' }, null, [
                                    nd('h3', 'heading',
                                       ms(H3, { color:'#6c5ce7', marginBottom:'8px' }),
                                       'How I Learned to Love Slow Mornings'),
                                    nd('p', 'paragraph',
                                       { fontSize:'15px', color:'#666', margin:'0', lineHeight:'1.6' },
                                       'Starting the day without screens changed everything...')
                                ]),
                                nd('article', 'div',
                                   { borderBottom:'1px solid #eee', paddingBottom:'20px' }, null, [
                                    nd('h3', 'heading',
                                       ms(H3, { color:'#6c5ce7', marginBottom:'8px' }),
                                       'The Joy of Building Things from Scratch'),
                                    nd('p', 'paragraph',
                                       { fontSize:'15px', color:'#666', margin:'0', lineHeight:'1.6' },
                                       'There is something deeply satisfying about making things with your hands...')
                                ]),
                                nd('article', 'div',
                                   { paddingBottom:'20px' }, null, [
                                    nd('h3', 'heading',
                                       ms(H3, { color:'#6c5ce7', marginBottom:'8px' }),
                                       'Why I Read Physical Books Again'),
                                    nd('p', 'paragraph',
                                       { fontSize:'15px', color:'#666', margin:'0', lineHeight:'1.6' },
                                       'After years of screens, going back to paper felt revolutionary...')
                                ])
                            ])
                        ])
                    ]);
                    return [makeNavbar('My Blog', ['Posts', 'About', 'Newsletter']),
                            header, posts, makeFooter('\u00a9 2025 My Blog.')];
                }
            },

            /* ======================================================
               E-COMMERCE
               ====================================================== */
            {
                id: 'ecommerce-store',
                category: 'ecommerce',
                name: 'Online Shop',
                desc: 'Product hero + featured products',
                preview: svgOpen() + svgNav() +
                    svgHero(14, 40, '#0f2027', '#2c5364') +
                    svgCard(8, 60, 57, 44) + svgCard(71, 60, 57, 44) + svgCard(134, 60, 57, 44) +
                    svgFooter(113) + svgClose(),
                create: function() {
                    var hero = nd('section', 'section',
                        ms(SECTION, { backgroundImage:'linear-gradient(135deg,#0f2027,#2c5364)',
                                      padding:'80px 40px', flexDirection:'row',
                                      gap:'48px', alignItems:'center' }), null, [
                        nd('div', 'div', { flex:'1', minWidth:'260px' }, null, [
                            nd('p', 'paragraph',
                               { fontSize:'12px', fontWeight:'600', color:'#74b9ff',
                                 letterSpacing:'2px', textTransform:'uppercase',
                                 margin:'0 0 12px', textAlign:'left' },
                               'Summer Collection 2025'),
                            nd('h1', 'heading',
                               ms(H1, { color:'#fff', textAlign:'left', fontSize:'46px' }),
                               'Style That Speaks'),
                            nd('p', 'paragraph',
                               ms(PARA, { color:'rgba(255,255,255,.75)', textAlign:'left',
                                          marginBottom:'28px' }),
                               'Discover our latest arrivals and exclusive deals.'),
                            nd('button', 'button',
                               ms(BTN_PRIMARY, { backgroundColor:'#74b9ff', color:'#0f2027' }),
                               'Shop Now')
                        ]),
                        nd('div', 'div',
                           { flex:'1', minWidth:'260px', backgroundColor:'rgba(255,255,255,.08)',
                             borderRadius:'16px', height:'280px', display:'flex',
                             alignItems:'center', justifyContent:'center',
                             color:'rgba(255,255,255,.4)', fontSize:'14px' },
                           'Product Image')
                    ]);
                    var products = nd('section', 'section',
                        ms(SECTION, { padding:'64px 40px' }), null, [
                        nd('div', 'div', CONTAINER, null, [
                            nd('h2', 'heading', H2, 'Featured Products'),
                            makeThreeCards(
                                ['\ud83d\udc55', 'Classic Tee', '$29.99 — Premium cotton comfort.'],
                                ['\ud83d\udc54', 'Dress Shirt', '$59.99 — Slim fit, wrinkle-free.'],
                                ['\ud83e\udded', 'Casual Jacket', '$89.99 — All-season versatile.']
                            )
                        ])
                    ]);
                    return [makeNavbar('ShopCo', ['Shop', 'Sale', 'New Arrivals', 'Cart']),
                            hero, products, makeFooter('\u00a9 2025 ShopCo. Free shipping on orders over $50.')];
                }
            },

            {
                id: 'ecommerce-digital',
                category: 'ecommerce',
                name: 'Digital Products',
                desc: 'Templates / courses / downloads shop',
                preview: svgOpen() + svgNav() +
                    svgHero(14, 44, '#1a0533', '#2d1b69') +
                    svgCard(8, 64, 57, 36) + svgCard(71, 64, 57, 36) + svgCard(134, 64, 57, 36) +
                    svgFooter(113) + svgClose(),
                create: function() {
                    var hero = nd('section', 'section',
                        ms(SECTION, { backgroundImage:'linear-gradient(135deg,#1a0533,#6c5ce7)',
                                      padding:'80px 40px', justifyContent:'center' }), null, [
                        nd('div', 'div', CONTAINER, null, [
                            nd('h1', 'heading', ms(H1, { color:'#fff', fontSize:'48px' }),
                               'Premium Digital Resources'),
                            nd('p', 'paragraph',
                               ms(PARA, { color:'rgba(255,255,255,.8)', marginBottom:'32px' }),
                               'UI kits, templates, courses and tools for modern creators.'),
                            nd('button', 'button',
                               ms(BTN_PRIMARY, { backgroundColor:'#fff', color:'#6c5ce7' }),
                               'Browse All Products')
                        ])
                    ]);
                    var products = nd('section', 'section',
                        ms(SECTION, { padding:'64px 40px' }), null, [
                        nd('div', 'div', CONTAINER, null, [
                            nd('h2', 'heading', H2, 'Best Sellers'),
                            makeThreeCards(
                                ['\ud83c\udfa8', 'UI Kit Pro', '$49 — 500+ components, Figma & code.'],
                                ['\ud83d\udcda', 'Design Course', '$99 — 40 hours of video content.'],
                                ['\ud83d\udee0\ufe0f', 'Dev Toolkit', '$29 — Boilerplates & snippets.']
                            )
                        ])
                    ]);
                    var guarantee = nd('section', 'section',
                        ms(SECTION, { backgroundColor:'#f8f7ff', padding:'48px 40px' }), null, [
                        nd('div', 'div', ms(CONTAINER, { textAlign:'center' }), null, [
                            nd('h2', 'heading', ms(H2, { fontSize:'28px' }), '\ud83d\udee1\ufe0f 30-Day Money Back Guarantee'),
                            nd('p', 'paragraph', ms(PARA, { maxWidth:'500px', margin:'0 auto' }),
                               'Not satisfied? Get a full refund within 30 days, no questions asked.')
                        ])
                    ]);
                    return [makeNavbar('DigitalHub', ['Products', 'Courses', 'Blog', 'Sign In']),
                            hero, products, guarantee, makeFooter()];
                }
            },

            {
                id: 'ecommerce-food',
                category: 'ecommerce',
                name: 'Food Delivery',
                desc: 'Order landing page with categories',
                preview: svgOpen() + svgNav() +
                    svgHero(14, 44, '#1a3a00', '#2d6a00') +
                    svgCard(8, 64, 57, 36) + svgCard(71, 64, 57, 36) + svgCard(134, 64, 57, 36) +
                    svgFooter(113) + svgClose(),
                create: function() {
                    var hero = nd('section', 'section',
                        ms(SECTION, { backgroundImage:'linear-gradient(135deg,#1b5e20,#4caf50)',
                                      padding:'72px 40px', flexDirection:'row',
                                      gap:'48px', alignItems:'center' }), null, [
                        nd('div', 'div', { flex:'1', minWidth:'260px' }, null, [
                            nd('h1', 'heading',
                               ms(H1, { color:'#fff', textAlign:'left', fontSize:'46px' }),
                               'Fresh Food, Delivered Fast'),
                            nd('p', 'paragraph',
                               ms(PARA, { color:'rgba(255,255,255,.85)', textAlign:'left',
                                          marginBottom:'28px' }),
                               'Order from the best local restaurants and get food in 30 minutes.'),
                            nd('button', 'button',
                               ms(BTN_PRIMARY, { backgroundColor:'#fff', color:'#1b5e20' }),
                               'Order Now')
                        ]),
                        nd('div', 'div',
                           { flex:'1', minWidth:'260px', backgroundColor:'rgba(255,255,255,.12)',
                             borderRadius:'16px', height:'240px', display:'flex',
                             alignItems:'center', justifyContent:'center',
                             color:'rgba(255,255,255,.5)', fontSize:'48px' },
                           '\ud83c\udf55')
                    ]);
                    var categories = nd('section', 'section',
                        ms(SECTION, { padding:'60px 40px' }), null, [
                        nd('div', 'div', CONTAINER, null, [
                            nd('h2', 'heading', H2, 'What Are You Craving?'),
                            makeThreeCards(
                                ['\ud83c\udf55', 'Pizza', 'From classic margherita to gourmet toppings.'],
                                ['\ud83c\udf63', 'Sushi', 'Fresh rolls, sashimi and Japanese specials.'],
                                ['\ud83c\udf54', 'Burgers', 'Juicy burgers, fries and shakes.']
                            )
                        ])
                    ]);
                    return [makeNavbar('QuickBite', ['Restaurants', 'Deals', 'Track Order', 'Sign In']),
                            hero, categories, makeFooter('\u00a9 2025 QuickBite. Delivering happiness.')];
                }
            },

            /* ======================================================
               CONTACT & ABOUT
               ====================================================== */
            {
                id: 'contact-page',
                category: 'contact',
                name: 'Contact Page',
                desc: 'Contact form + info columns',
                preview: svgOpen() + svgNav() +
                    svgHero(14, 26, '#1a1a2e', '#16213e') +
                    svgSplit(45, 62) +
                    svgFooter(113) + svgClose(),
                create: function() {
                    var header = nd('section', 'section',
                        ms(SECTION, { backgroundImage:'linear-gradient(135deg,#1a1a2e,#16213e)',
                                      padding:'60px 40px' }), null, [
                        nd('h1', 'heading', ms(H1, { color:'#fff' }), 'Get in Touch'),
                        nd('p', 'paragraph',
                           ms(PARA, { color:'rgba(255,255,255,.7)', marginBottom:'0' }),
                           'We\'d love to hear from you. Fill in the form and we\'ll respond within 24 hours.')
                    ]);
                    var form = nd('form', 'form',
                        { display:'flex', flexDirection:'column', gap:'16px',
                          backgroundColor:'#fff', padding:'32px', borderRadius:'12px',
                          boxShadow:'0 4px 24px rgba(0,0,0,.08)', flex:'1', minWidth:'300px' },
                        null, [
                        nd('input', 'form-input',
                           { width:'100%', padding:'12px 14px', border:'1px solid #ddd',
                             borderRadius:'8px', fontSize:'15px', boxSizing:'border-box' },
                           null, [], { type:'text', placeholder:'Your Name' }),
                        nd('input', 'form-input',
                           { width:'100%', padding:'12px 14px', border:'1px solid #ddd',
                             borderRadius:'8px', fontSize:'15px', boxSizing:'border-box' },
                           null, [], { type:'email', placeholder:'Email Address' }),
                        nd('input', 'form-input',
                           { width:'100%', padding:'12px 14px', border:'1px solid #ddd',
                             borderRadius:'8px', fontSize:'15px', boxSizing:'border-box' },
                           null, [], { type:'text', placeholder:'Subject' }),
                        nd('button', 'button',
                           ms(BTN_PRIMARY, { width:'100%', textAlign:'center' }),
                           'Send Message')
                    ]);
                    var info = nd('div', 'div',
                        { flex:'1', minWidth:'240px', display:'flex',
                          flexDirection:'column', gap:'24px', paddingTop:'8px' }, null, [
                        nd('div', 'div', ms(CARD_BASE, {}), null, [
                            nd('div', 'div', { fontSize:'24px', marginBottom:'8px' }, '\ud83d\udccd'),
                            nd('h3', 'heading', H3, 'Address'),
                            nd('p', 'paragraph',
                               { fontSize:'15px', color:'#666', margin:'0', lineHeight:'1.6' },
                               '123 Main Street\nNew York, NY 10001')
                        ]),
                        nd('div', 'div', ms(CARD_BASE, {}), null, [
                            nd('div', 'div', { fontSize:'24px', marginBottom:'8px' }, '\ud83d\udcde'),
                            nd('h3', 'heading', H3, 'Phone'),
                            nd('p', 'paragraph',
                               { fontSize:'15px', color:'#666', margin:'0' },
                               '+1 (555) 123-4567')
                        ])
                    ]);
                    var contactSection = nd('section', 'section',
                        ms(SECTION, { padding:'64px 40px', flexDirection:'row',
                                      gap:'40px', alignItems:'flex-start' }), null, [
                        form, info
                    ]);
                    return [makeNavbar(), header, contactSection, makeFooter()];
                }
            },

            {
                id: 'about-page',
                category: 'contact',
                name: 'About Us Page',
                desc: 'Team bios + mission statement',
                preview: svgOpen() + svgNav() +
                    svgHero(14, 36, '#1a1a2e', '#16213e') +
                    svgSplit(54, 44) +
                    svgCard(8, 102, 57, 10) + svgCard(71, 102, 57, 10) + svgCard(134, 102, 57, 10) +
                    svgFooter(116) + svgClose(),
                create: function() {
                    var header = nd('section', 'section',
                        ms(SECTION, { backgroundImage:'linear-gradient(135deg,#1a1a2e,#6c5ce7)',
                                      padding:'64px 40px' }), null, [
                        nd('h1', 'heading', ms(H1, { color:'#fff' }), 'About Us'),
                        nd('p', 'paragraph',
                           ms(PARA, { color:'rgba(255,255,255,.75)', marginBottom:'0',
                                      maxWidth:'600px', margin:'0 auto' }),
                           'We are a passionate team building tools that empower creators.')
                    ]);
                    var mission = nd('section', 'section',
                        ms(SECTION, { flexDirection:'row', gap:'60px',
                                      padding:'72px 40px', alignItems:'center' }), null, [
                        nd('div', 'div', { flex:'1', minWidth:'260px' }, null, [
                            nd('h2', 'heading', ms(H2, { textAlign:'left' }), 'Our Mission'),
                            nd('p', 'paragraph', ms(PARA, { textAlign:'left', marginBottom:'16px' }),
                               'We believe everyone deserves access to powerful tools — without complexity or high cost.'),
                            nd('p', 'paragraph', ms(PARA, { textAlign:'left' }),
                               'Founded in 2018, we\'ve helped over 100,000 people build their digital presence.')
                        ]),
                        nd('div', 'div',
                           { flex:'1', minWidth:'260px', backgroundColor:'#ede9fe',
                             borderRadius:'16px', padding:'40px',
                             display:'flex', flexDirection:'column', gap:'16px' }, null, [
                            nd('p', 'paragraph',
                               { fontSize:'18px', fontStyle:'italic', color:'#5a4fcf',
                                 lineHeight:'1.7', margin:'0' },
                               '"Empower every creator to bring their ideas to life."'),
                            nd('p', 'paragraph',
                               { fontSize:'14px', fontWeight:'600', color:'#6c5ce7', margin:'0' },
                               '\u2014 Our founding principle')
                        ])
                    ]);
                    var team = nd('section', 'section',
                        ms(SECTION, { backgroundColor:'#f8f7ff', padding:'60px 40px' }), null, [
                        nd('div', 'div', CONTAINER, null, [
                            nd('h2', 'heading', H2, 'Meet the Team'),
                            makeThreeCards(
                                ['\ud83d\udc69\u200d\ud83d\udcbb', 'Emma Schulz', 'CEO & Co-founder — 10+ years in SaaS.'],
                                ['\ud83d\udc68\u200d\ud83c\udfa8', 'Luca Romano', 'Head of Design — Former Apple designer.'],
                                ['\ud83d\udc69\u200d\ud83d\udd2c', 'Aiko Tanaka', 'Lead Engineer — Open source contributor.']
                            )
                        ])
                    ]);
                    return [makeNavbar(), header, mission, team, makeFooter()];
                }
            }

        ]  /* end all[] */
    };  /* end WB.Templates */


    /* ==============================================================
       TEMPLATE MODAL
       ============================================================== */
    WB.TemplateModal = {

        _currentCat: 'landing',

        open: function() {
            var html = this._buildHTML();
            WB.Modal.open(WB.i18n.t('templates', 'Templates'), html, 'modal-templates');
            this._attachEvents();
        },

        _buildHTML: function() {
            var cats = WB.Templates.categories;
            var sidebarHTML = '';
            for (var i = 0; i < cats.length; i++) {
                var active = cats[i].id === this._currentCat ? ' active' : '';
                sidebarHTML += '<button class="tmpl-cat-btn' + active +
                    '" data-cat="' + cats[i].id + '">' + cats[i].label + '</button>';
            }
            return '<div class="tmpl-modal-layout">' +
                   '<div class="tmpl-sidebar">' + sidebarHTML + '</div>' +
                   '<div class="tmpl-grid-area">' + this._buildTemplateGrid(this._currentCat) + '</div>' +
                   '</div>';
        },

        _buildTemplateGrid: function(catId) {
            var all = WB.Templates.all;
            var html = '<div class="tmpl-grid">';
            var found = 0;
            for (var i = 0; i < all.length; i++) {
                if (all[i].category === catId) {
                    html += this._buildCard(all[i]);
                    found++;
                }
            }
            if (!found) {
                html += '<div class="tmpl-empty"><p>No templates in this category yet.</p></div>';
            }
            html += '</div>';
            return html;
        },

        _buildCard: function(tmpl) {
            return '<div class="tmpl-card">' +
                   '<div class="tmpl-preview">' + tmpl.preview + '</div>' +
                   '<div class="tmpl-card-body">' +
                   '<div class="tmpl-card-name">' + tmpl.name + '</div>' +
                   '<div class="tmpl-card-desc">' + tmpl.desc + '</div>' +
                   '<button class="tmpl-use-btn" data-tmpl-id="' + tmpl.id + '">' +
                   WB.i18n.t('useTemplate', 'Use Template') + '</button>' +
                   '</div></div>';
        },

        _attachEvents: function() {
            var self = this;
            var body = document.getElementById('modal-body');
            if (!body) return;

            /* Category sidebar */
            body.addEventListener('click', function handler(e) {
                var catBtn = e.target.closest('.tmpl-cat-btn');
                if (catBtn) {
                    self._currentCat = catBtn.getAttribute('data-cat');
                    var gridArea = body.querySelector('.tmpl-grid-area');
                    if (gridArea) gridArea.innerHTML = self._buildTemplateGrid(self._currentCat);
                    var allCats = body.querySelectorAll('.tmpl-cat-btn');
                    for (var i = 0; i < allCats.length; i++) {
                        allCats[i].classList.toggle('active',
                            allCats[i].getAttribute('data-cat') === self._currentCat);
                    }
                    return;
                }
                var useBtn = e.target.closest('.tmpl-use-btn');
                if (useBtn) {
                    self._applyTemplate(useBtn.getAttribute('data-tmpl-id'));
                }
            });
        },

        _applyTemplate: function(tmplId) {
            var tmpl = null;
            for (var i = 0; i < WB.Templates.all.length; i++) {
                if (WB.Templates.all[i].id === tmplId) { tmpl = WB.Templates.all[i]; break; }
            }
            if (!tmpl) return;

            var hasContent = WB.State.documentTree && WB.State.documentTree.length > 0;
            if (hasContent && !window.confirm(WB.i18n.t('templateReplaceWarning',
                    'This will replace your current canvas. Continue?'))) {
                return;
            }

            var nodes = tmpl.create();
            this._setParentIds(nodes, null);

            WB.updateState(function() {
                WB.State.documentTree = nodes;
                WB.State.selectedElementId = null;
            }, true);

            WB.Modal.close();
            WB.showToast(WB.i18n.t('templateApplied', 'Template applied'));
        },

        _setParentIds: function(nodes, parentId) {
            if (!nodes) return;
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].parentId = parentId;
                if (nodes[i].children && nodes[i].children.length) {
                    this._setParentIds(nodes[i].children, nodes[i].id);
                }
            }
        }
    };

})(window.WebBuilder = window.WebBuilder || {});
