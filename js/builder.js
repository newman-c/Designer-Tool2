/* ============================================================
   WebBuilder — Core Engine
   ============================================================ */
(function(WB) {
    'use strict';

    /* ============================================================
       STATE
       ============================================================ */
    WB.State = {
        documentTree: [],
        selectedElementId: null,
        hoveredElementId: null,
        undoStack: [],
        redoStack: [],
        maxUndoLevels: 50,
        viewportMode: 'desktop',
        dragState: null,
        isEditingText: false,
        projectName: 'Untitled Project',
        isDirty: false
    };

    /* ============================================================
       UTILITIES
       ============================================================ */
    WB.findNodeById = function(id, nodes) {
        nodes = nodes || WB.State.documentTree;
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].id === id) return nodes[i];
            if (nodes[i].children && nodes[i].children.length) {
                var found = WB.findNodeById(id, nodes[i].children);
                if (found) return found;
            }
        }
        return null;
    };

    WB.findParentOf = function(id, nodes, parent) {
        nodes = nodes || WB.State.documentTree;
        parent = parent || null;
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].id === id) return { parent: parent, index: i, siblings: nodes };
            if (nodes[i].children && nodes[i].children.length) {
                var found = WB.findParentOf(id, nodes[i].children, nodes[i]);
                if (found) return found;
            }
        }
        return null;
    };

    WB.removeNodeById = function(id, nodes) {
        nodes = nodes || WB.State.documentTree;
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].id === id) {
                nodes.splice(i, 1);
                return true;
            }
            if (nodes[i].children && WB.removeNodeById(id, nodes[i].children)) {
                return true;
            }
        }
        return false;
    };

    WB.cloneNode = function(node) {
        var clone = JSON.parse(JSON.stringify(node));
        WB._reassignIds(clone);
        return clone;
    };

    WB._reassignIds = function(node) {
        node.id = WB.generateId();
        if (node.children) {
            for (var i = 0; i < node.children.length; i++) {
                WB._reassignIds(node.children[i]);
                node.children[i].parentId = node.id;
            }
        }
    };

    WB.serializeTree = function() {
        return JSON.parse(JSON.stringify(WB.State.documentTree));
    };

    WB.stylesToString = function(styles) {
        if (!styles || Object.keys(styles).length === 0) return '';
        return Object.keys(styles).map(function(prop) {
            if (!styles[prop] && styles[prop] !== 0) return '';
            var cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
            return cssProp + ': ' + styles[prop];
        }).filter(Boolean).join('; ');
    };

    WB.escapeHtml = function(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };

    /* ============================================================
       STATE UPDATES + UNDO/REDO
       ============================================================ */
    WB.updateState = function(changeFn, pushUndo) {
        if (pushUndo !== false) {
            WB.State.undoStack.push(WB.serializeTree());
            WB.State.redoStack = [];
            if (WB.State.undoStack.length > WB.State.maxUndoLevels) {
                WB.State.undoStack.shift();
            }
        }
        changeFn();
        WB.State.isDirty = true;
        WB.render();
    };

    WB.Undo = {
        undo: function() {
            if (WB.State.undoStack.length === 0) return;
            WB.State.redoStack.push(WB.serializeTree());
            WB.State.documentTree = WB.State.undoStack.pop();
            WB.State.selectedElementId = null;
            WB.State.isEditingText = false;
            WB.render();
        },
        redo: function() {
            if (WB.State.redoStack.length === 0) return;
            WB.State.undoStack.push(WB.serializeTree());
            WB.State.documentTree = WB.State.redoStack.pop();
            WB.State.selectedElementId = null;
            WB.State.isEditingText = false;
            WB.render();
        }
    };

    /* ============================================================
       TOAST NOTIFICATIONS
       ============================================================ */
    WB.showToast = function(message, type) {
        type = type || 'success';
        var container = document.getElementById('toast-container');
        var toast = document.createElement('div');
        toast.className = 'toast toast-' + type;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(function() {
            toast.classList.add('toast-fadeout');
            setTimeout(function() { toast.remove(); }, 300);
        }, 2500);
    };

    /* ============================================================
       RENDER DISPATCHER
       ============================================================ */
    WB.render = function() {
        WB.Canvas.sync();
        WB.PropertyEditor.render();
        WB.Toolbar.updateState();
        WB.LayerTree.render();

        var empty = document.getElementById('canvas-empty');
        if (empty) {
            if (WB.State.documentTree.length > 0) {
                empty.classList.add('hidden');
            } else {
                empty.classList.remove('hidden');
            }
        }
    };

    /* ============================================================
       CANVAS (iframe)
       ============================================================ */
    WB.Canvas = {
        iframe: null,
        doc: null,
        dropIndicator: null,

        init: function() {
            this.iframe = document.getElementById('canvas-iframe');
            this.doc = this.iframe.contentDocument || this.iframe.contentWindow.document;
            this.doc.open();
            this.doc.write([
                '<!DOCTYPE html><html><head><style>',
                '*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }',
                'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; min-height: 100vh; background: #fff; }',
                'img { max-width: 100%; height: auto; }',
                'a { color: inherit; }',
                '[data-wb-id] { position: relative; cursor: pointer; transition: outline 0.12s, box-shadow 0.12s; outline: 2px solid transparent; outline-offset: -1px; }',
                '[data-wb-id]:hover { outline-color: rgba(108, 92, 231, 0.4); }',
                '[data-wb-id].wb-selected { outline: 2px solid #6c5ce7 !important; box-shadow: 0 0 0 4px rgba(108, 92, 231, 0.15); }',
                '[data-wb-id].wb-drag-over { outline: 2px dashed #6c5ce7 !important; }',
                '.wb-drop-indicator { height: 3px; background: #6c5ce7; border-radius: 2px; pointer-events: none; margin: 0 4px; transition: all 0.1s; box-shadow: 0 0 8px rgba(108, 92, 231, 0.5); }',
                '[contenteditable="true"] { outline: 2px solid #6c5ce7 !important; background: rgba(108, 92, 231, 0.05); cursor: text; min-width: 20px; }',
                'input, textarea, select { pointer-events: none; }',
                '</style></head><body></body></html>'
            ].join('\n'));
            this.doc.close();
            this._attachEvents();
        },

        setViewportMode: function(mode) {
            var widths = { desktop: '100%', tablet: '768px', mobile: '375px' };
            this.iframe.style.width = widths[mode] || '100%';
            if (mode === 'desktop') {
                this.iframe.classList.remove('viewport-narrow');
            } else {
                this.iframe.classList.add('viewport-narrow');
            }
            WB.State.viewportMode = mode;
        },

        sync: function() {
            if (!this.doc || !this.doc.body) return;
            var body = this.doc.body;
            this._syncChildren(body, WB.State.documentTree);
        },

        _syncChildren: function(parentEl, nodes) {
            var existingMap = {};
            var existingOrder = [];
            var children = parentEl.children;

            // Build map of existing elements
            for (var i = 0; i < children.length; i++) {
                var wbId = children[i].getAttribute('data-wb-id');
                if (wbId) {
                    existingMap[wbId] = children[i];
                    existingOrder.push(wbId);
                }
            }

            // Remove drop indicators
            var indicators = parentEl.querySelectorAll('.wb-drop-indicator');
            for (var d = 0; d < indicators.length; d++) {
                indicators[d].remove();
            }

            // Track which IDs should remain
            var nodeIds = {};
            for (var n = 0; n < nodes.length; n++) {
                nodeIds[nodes[n].id] = true;
            }

            // Remove elements not in tree
            for (var id in existingMap) {
                if (!nodeIds[id]) {
                    existingMap[id].remove();
                    delete existingMap[id];
                }
            }

            // Add/update/reorder
            var prevEl = null;
            for (var j = 0; j < nodes.length; j++) {
                var node = nodes[j];
                var el = existingMap[node.id];

                if (el) {
                    // Update existing element
                    this._updateElement(el, node);
                } else {
                    // Create new element
                    el = this._createElement(node);
                    existingMap[node.id] = el;
                }

                // Ensure correct order
                if (prevEl) {
                    if (prevEl.nextElementSibling !== el) {
                        parentEl.insertBefore(el, prevEl.nextSibling);
                    }
                } else {
                    if (parentEl.firstElementChild !== el) {
                        parentEl.insertBefore(el, parentEl.firstElementChild);
                    }
                }

                prevEl = el;

                // Recursively sync children
                if (node.children && node.children.length) {
                    this._syncChildren(el, node.children);
                }

                // Selection
                if (node.id === WB.State.selectedElementId) {
                    el.classList.add('wb-selected');
                } else {
                    el.classList.remove('wb-selected');
                }
            }
        },

        _createElement: function(node) {
            var el = this.doc.createElement(node.tagName);
            el.setAttribute('data-wb-id', node.id);

            // Apply styles
            if (node.styles) {
                for (var prop in node.styles) {
                    if (node.styles[prop] !== undefined && node.styles[prop] !== '') {
                        el.style[prop] = node.styles[prop];
                    }
                }
            }

            // Apply attributes
            if (node.attributes) {
                for (var attr in node.attributes) {
                    if (node.attributes[attr] !== undefined && node.attributes[attr] !== '') {
                        el.setAttribute(attr, node.attributes[attr]);
                    }
                }
            }

            // Content
            if (node.content !== null && node.content !== undefined) {
                el.textContent = node.content;
            }

            return el;
        },

        _updateElement: function(el, node) {
            // Update tag if changed (rare — requires replacement)
            if (el.tagName.toLowerCase() !== node.tagName.toLowerCase()) {
                var newEl = this._createElement(node);
                // Move children
                while (el.firstChild) {
                    newEl.appendChild(el.firstChild);
                }
                el.parentNode.replaceChild(newEl, el);
                return newEl;
            }

            // Update styles
            el.removeAttribute('style');
            if (node.styles) {
                for (var prop in node.styles) {
                    if (node.styles[prop] !== undefined && node.styles[prop] !== '') {
                        el.style[prop] = node.styles[prop];
                    }
                }
            }

            // Update attributes
            var keepAttrs = { 'data-wb-id': true, 'style': true, 'class': true, 'contenteditable': true };
            var existingAttrs = el.attributes;
            var toRemove = [];
            for (var a = 0; a < existingAttrs.length; a++) {
                if (!keepAttrs[existingAttrs[a].name] && !(node.attributes && node.attributes[existingAttrs[a].name] !== undefined)) {
                    toRemove.push(existingAttrs[a].name);
                }
            }
            for (var r = 0; r < toRemove.length; r++) {
                el.removeAttribute(toRemove[r]);
            }
            if (node.attributes) {
                for (var attr in node.attributes) {
                    if (node.attributes[attr] !== undefined && node.attributes[attr] !== '') {
                        el.setAttribute(attr, node.attributes[attr]);
                    }
                }
            }

            // Update content (only for leaf nodes with no children, and not currently editing)
            if (node.content !== null && node.content !== undefined &&
                (!node.children || node.children.length === 0) &&
                el.getAttribute('contenteditable') !== 'true') {
                if (el.textContent !== node.content) {
                    el.textContent = node.content;
                }
            }

            return el;
        },

        _attachEvents: function() {
            var self = this;
            var canvasDoc = this.doc;
            var canvasWin = this.iframe.contentWindow;

            // Click to select
            canvasDoc.addEventListener('click', function(e) {
                if (WB.State.isEditingText) return;
                var target = e.target.closest('[data-wb-id]');
                if (target) {
                    e.preventDefault();
                    e.stopPropagation();
                    WB.Selection.select(target.getAttribute('data-wb-id'));
                } else {
                    WB.Selection.deselect();
                }
            });

            // Double-click for inline editing
            canvasDoc.addEventListener('dblclick', function(e) {
                var target = e.target.closest('[data-wb-id]');
                if (!target) return;
                var nodeId = target.getAttribute('data-wb-id');
                var node = WB.findNodeById(nodeId);
                if (node && node.content !== null && node.content !== undefined) {
                    e.preventDefault();
                    self._enableContentEditable(target, node);
                }
            });

            // Keyboard in canvas
            canvasDoc.addEventListener('keydown', function(e) {
                if (WB.State.isEditingText) {
                    if (e.key === 'Escape') {
                        e.preventDefault();
                        var active = canvasDoc.querySelector('[contenteditable="true"]');
                        if (active) active.blur();
                    }
                    return;
                }

                if ((e.key === 'Delete' || e.key === 'Backspace') && WB.State.selectedElementId) {
                    e.preventDefault();
                    WB.Actions.deleteSelected();
                }

                if (e.ctrlKey && e.key === 'd' && WB.State.selectedElementId) {
                    e.preventDefault();
                    WB.Actions.duplicateSelected();
                }

                if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
                    e.preventDefault();
                    WB.Undo.undo();
                }
                if (e.ctrlKey && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
                    e.preventDefault();
                    WB.Undo.redo();
                }
            });

            // Drag over canvas (from component library)
            canvasDoc.body.addEventListener('dragover', function(e) {
                if (!WB.State.dragState || WB.State.dragState.sourceType !== 'library') return;
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
                self._showDropIndicator(e.clientY);
            });

            canvasDoc.body.addEventListener('dragleave', function(e) {
                if (e.target === canvasDoc.body || !canvasDoc.body.contains(e.relatedTarget)) {
                    self._hideDropIndicator();
                }
            });

            canvasDoc.body.addEventListener('drop', function(e) {
                e.preventDefault();
                if (!WB.State.dragState || WB.State.dragState.sourceType !== 'library') return;

                var type = WB.State.dragState.componentType;
                var index = self._calculateDropIndex(e.clientY);

                WB.updateState(function() {
                    var node = WB.ComponentLibrary.createNode(type);
                    if (node) {
                        WB.State.documentTree.splice(index, 0, node);
                        WB.State.selectedElementId = node.id;
                    }
                });

                self._hideDropIndicator();
                WB.State.dragState = null;
            });
        },

        _enableContentEditable: function(domEl, node) {
            WB.State.isEditingText = true;
            WB.Selection.select(node.id);
            domEl.setAttribute('contenteditable', 'true');
            domEl.focus();

            // Select all text
            var range = this.doc.createRange();
            range.selectNodeContents(domEl);
            var sel = this.iframe.contentWindow.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);

            var self = this;
            function onBlur() {
                domEl.removeEventListener('blur', onBlur);
                domEl.removeAttribute('contenteditable');
                WB.State.isEditingText = false;
                var newContent = domEl.textContent;
                if (newContent !== node.content) {
                    WB.updateState(function() {
                        var n = WB.findNodeById(node.id);
                        if (n) n.content = newContent;
                    });
                }
                WB.PropertyEditor.render();
            }
            domEl.addEventListener('blur', onBlur);
        },

        _showDropIndicator: function(y) {
            if (!this.dropIndicator) {
                this.dropIndicator = this.doc.createElement('div');
                this.dropIndicator.className = 'wb-drop-indicator';
            }

            var body = this.doc.body;
            var children = body.querySelectorAll(':scope > [data-wb-id]');
            var inserted = false;

            for (var i = 0; i < children.length; i++) {
                var rect = children[i].getBoundingClientRect();
                if (y < rect.top + rect.height / 2) {
                    body.insertBefore(this.dropIndicator, children[i]);
                    inserted = true;
                    break;
                }
            }

            if (!inserted) {
                body.appendChild(this.dropIndicator);
            }
        },

        _hideDropIndicator: function() {
            if (this.dropIndicator && this.dropIndicator.parentNode) {
                this.dropIndicator.remove();
            }
        },

        _calculateDropIndex: function(y) {
            var children = this.doc.body.querySelectorAll(':scope > [data-wb-id]');
            for (var i = 0; i < children.length; i++) {
                var rect = children[i].getBoundingClientRect();
                if (y < rect.top + rect.height / 2) {
                    return i;
                }
            }
            return WB.State.documentTree.length;
        }
    };

    /* ============================================================
       SELECTION
       ============================================================ */
    WB.Selection = {
        select: function(nodeId) {
            WB.State.selectedElementId = nodeId;
            WB.PropertyEditor.render();
            WB.LayerTree.render();

            // Update canvas visuals
            if (WB.Canvas.doc) {
                var all = WB.Canvas.doc.querySelectorAll('.wb-selected');
                for (var i = 0; i < all.length; i++) {
                    all[i].classList.remove('wb-selected');
                }
                var el = WB.Canvas.doc.querySelector('[data-wb-id="' + nodeId + '"]');
                if (el) el.classList.add('wb-selected');
            }
        },

        deselect: function() {
            WB.State.selectedElementId = null;
            WB.PropertyEditor.render();
            WB.LayerTree.render();

            if (WB.Canvas.doc) {
                var all = WB.Canvas.doc.querySelectorAll('.wb-selected');
                for (var i = 0; i < all.length; i++) {
                    all[i].classList.remove('wb-selected');
                }
            }
        }
    };

    /* ============================================================
       ACTIONS (Delete, Duplicate, Move)
       ============================================================ */
    WB.Actions = {
        deleteSelected: function() {
            if (!WB.State.selectedElementId) return;
            WB.updateState(function() {
                WB.removeNodeById(WB.State.selectedElementId);
                WB.State.selectedElementId = null;
            });
            WB.showToast(WB.i18n.t('elementDeleted'));
        },

        duplicateSelected: function() {
            if (!WB.State.selectedElementId) return;
            var node = WB.findNodeById(WB.State.selectedElementId);
            if (!node) return;

            var info = WB.findParentOf(WB.State.selectedElementId);
            if (!info) return;

            WB.updateState(function() {
                var clone = WB.cloneNode(node);
                clone.parentId = node.parentId;
                info.siblings.splice(info.index + 1, 0, clone);
                WB.State.selectedElementId = clone.id;
            });
            WB.showToast(WB.i18n.t('elementDuplicated'));
        },

        moveUp: function() {
            if (!WB.State.selectedElementId) return;
            var info = WB.findParentOf(WB.State.selectedElementId);
            if (!info || info.index === 0) return;
            WB.updateState(function() {
                var item = info.siblings.splice(info.index, 1)[0];
                info.siblings.splice(info.index - 1, 0, item);
            });
        },

        moveDown: function() {
            if (!WB.State.selectedElementId) return;
            var info = WB.findParentOf(WB.State.selectedElementId);
            if (!info || info.index >= info.siblings.length - 1) return;
            WB.updateState(function() {
                var item = info.siblings.splice(info.index, 1)[0];
                info.siblings.splice(info.index + 1, 0, item);
            });
        }
    };

    /* ============================================================
       COMPONENT PANEL
       ============================================================ */
    WB.ComponentPanel = {
        init: function() {
            var list = document.getElementById('component-list');
            var html = '';
            var cats = WB.ComponentLibrary.categories;

            for (var c = 0; c < cats.length; c++) {
                var cat = cats[c];
                html += '<div class="component-category">';
                html += '<div class="component-category-title" data-category="' + cat.name + '">';
                html += '<span class="cat-arrow">&#9660;</span> ';
                html += cat.icon + ' ' + WB.i18n.t('cat_' + cat.name, cat.name);
                html += '</div>';
                html += '<div class="component-category-items" data-cat-items="' + cat.name + '">';

                for (var i = 0; i < cat.components.length; i++) {
                    var compType = cat.components[i];
                    var def = WB.ComponentLibrary.definitions[compType];
                    if (!def) continue;

                    html += '<div class="component-item" draggable="true" data-component-type="' + compType + '">';
                    html += '<span class="component-icon">' + def.icon + '</span>';
                    html += '<span class="component-label">' + WB.i18n.t('comp_' + compType.replace(/-/g, '_'), def.label) + '</span>';
                    html += '</div>';
                }

                html += '</div></div>';
            }

            list.innerHTML = html;
            if (!this._eventsAttached) {
                this._attachEvents(list);
                this._attachSearch();
                this._eventsAttached = true;
            }
        },

        _attachEvents: function(list) {
            // Drag start on component items
            list.addEventListener('dragstart', function(e) {
                var item = e.target.closest('.component-item');
                if (!item) return;
                var type = item.getAttribute('data-component-type');
                e.dataTransfer.setData('text/plain', type);
                e.dataTransfer.effectAllowed = 'copy';
                WB.State.dragState = { sourceType: 'library', componentType: type };
                item.classList.add('dragging');

                // Also signal the canvas area
                document.getElementById('canvas-area').classList.add('drag-over');
            });

            list.addEventListener('dragend', function(e) {
                var item = e.target.closest('.component-item');
                if (item) item.classList.remove('dragging');
                document.getElementById('canvas-area').classList.remove('drag-over');
                WB.State.dragState = null;
                WB.Canvas._hideDropIndicator();
            });

            // Double-click to add component
            list.addEventListener('dblclick', function(e) {
                var item = e.target.closest('.component-item');
                if (!item) return;
                var type = item.getAttribute('data-component-type');
                WB.updateState(function() {
                    var node = WB.ComponentLibrary.createNode(type);
                    if (node) {
                        WB.State.documentTree.push(node);
                        WB.State.selectedElementId = node.id;
                    }
                });
            });

            // Toggle categories
            list.addEventListener('click', function(e) {
                var title = e.target.closest('.component-category-title');
                if (!title) return;
                var catName = title.getAttribute('data-category');
                var items = list.querySelector('[data-cat-items="' + catName + '"]');
                if (items) {
                    var collapsed = items.style.display === 'none';
                    items.style.display = collapsed ? '' : 'none';
                    title.classList.toggle('collapsed', !collapsed);
                }
            });
        },

        _attachSearch: function() {
            var searchInput = document.getElementById('component-search');
            if (!searchInput) return;

            searchInput.addEventListener('input', function() {
                var query = searchInput.value.toLowerCase().trim();
                var items = document.querySelectorAll('.component-item');
                var categories = document.querySelectorAll('.component-category');

                if (!query) {
                    for (var i = 0; i < items.length; i++) items[i].style.display = '';
                    for (var c = 0; c < categories.length; c++) categories[c].style.display = '';
                    return;
                }

                for (var j = 0; j < items.length; j++) {
                    var label = items[j].querySelector('.component-label').textContent.toLowerCase();
                    items[j].style.display = label.indexOf(query) >= 0 ? '' : 'none';
                }

                // Hide empty categories
                for (var k = 0; k < categories.length; k++) {
                    var visibleItems = categories[k].querySelectorAll('.component-item:not([style*="display: none"])');
                    categories[k].style.display = visibleItems.length > 0 ? '' : 'none';
                }
            });
        }
    };

    /* ============================================================
       PROPERTY EDITOR
       ============================================================ */
    WB.PropertyEditor = {
        propertyDefs: {
            // Typography
            fontSize:       { widget: 'text', label: 'Font Size', section: 'Typography' },
            fontWeight:     { widget: 'select', label: 'Weight', section: 'Typography', options: ['300','400','500','600','700','800','900'] },
            fontFamily:     { widget: 'select', label: 'Font', section: 'Typography', options: ['inherit','Arial, sans-serif','Georgia, serif','Courier New, monospace','Verdana, sans-serif','Trebuchet MS, sans-serif','Impact, sans-serif'] },
            textAlign:      { widget: 'btngroup', label: 'Align', section: 'Typography', options: [{v:'left',l:'L'},{v:'center',l:'C'},{v:'right',l:'R'},{v:'justify',l:'J'}] },
            lineHeight:     { widget: 'text', label: 'Line Height', section: 'Typography' },
            letterSpacing:  { widget: 'text', label: 'Spacing', section: 'Typography' },
            textDecoration: { widget: 'select', label: 'Decoration', section: 'Typography', options: ['none','underline','line-through','overline'] },

            // Colors
            color:           { widget: 'color', label: 'Text Color', section: 'Colors' },
            backgroundColor: { widget: 'color', label: 'Background', section: 'Colors' },
            opacity:         { widget: 'range', label: 'Opacity', section: 'Colors', min: 0, max: 1, step: 0.05 },

            // Spacing
            padding:  { widget: 'text', label: 'Padding', section: 'Spacing' },
            margin:   { widget: 'text', label: 'Margin', section: 'Spacing' },
            gap:      { widget: 'text', label: 'Gap', section: 'Spacing' },

            // Size
            width:      { widget: 'text', label: 'Width', section: 'Size' },
            height:     { widget: 'text', label: 'Height', section: 'Size' },
            maxWidth:   { widget: 'text', label: 'Max Width', section: 'Size' },
            minHeight:  { widget: 'text', label: 'Min Height', section: 'Size' },

            // Layout
            display:         { widget: 'select', label: 'Display', section: 'Layout', options: ['block','flex','grid','inline-block','inline','none'] },
            justifyContent:  { widget: 'select', label: 'Justify', section: 'Layout', options: ['flex-start','center','flex-end','space-between','space-around','space-evenly'] },
            alignItems:      { widget: 'select', label: 'Align', section: 'Layout', options: ['flex-start','center','flex-end','stretch','baseline'] },
            flexDirection:   { widget: 'select', label: 'Direction', section: 'Layout', options: ['row','column','row-reverse','column-reverse'] },
            gridTemplateColumns: { widget: 'text', label: 'Grid Cols', section: 'Layout' },
            position:        { widget: 'select', label: 'Position', section: 'Layout', options: ['static','relative','sticky','fixed','absolute'] },

            // Border
            borderRadius: { widget: 'text', label: 'Radius', section: 'Border' },
            border:       { widget: 'text', label: 'Border', section: 'Border' },
            borderTop:    { widget: 'text', label: 'Top', section: 'Border' },
            boxShadow:    { widget: 'text', label: 'Shadow', section: 'Border' },

            // Background
            backgroundImage: { widget: 'text', label: 'BG Image', section: 'Background' },
            objectFit:       { widget: 'select', label: 'Fit', section: 'Background', options: ['cover','contain','fill','none','scale-down'] },

            // Element
            tagName:       { widget: 'select', label: 'Tag', section: 'Element', options: ['h1','h2','h3','h4','h5','h6','p','div','span','section','article','aside','header','footer','nav'] },
            listStyleType: { widget: 'select', label: 'List Style', section: 'Element', options: ['disc','circle','square','decimal','none'] }
        },

        init: function() {},

        render: function() {
            var container = document.getElementById('property-content');
            var nodeId = WB.State.selectedElementId;

            if (!nodeId) {
                container.innerHTML =
                    '<div class="panel-empty">' +
                    '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">' +
                    '<rect x="4" y="4" width="32" height="32" rx="4"/><path d="M14 16h12M14 20h8M14 24h10"/></svg>' +
                    '<p>' + WB.i18n.t('selectElement') + '</p></div>';
                return;
            }

            var node = WB.findNodeById(nodeId);
            if (!node) {
                WB.State.selectedElementId = null;
                this.render();
                return;
            }

            var def = WB.ComponentLibrary.getDefinition(node.type);
            var editableProps = def ? WB.ComponentLibrary.getEditableProperties(node.type) : this._inferProperties(node);

            var html = '';

            // Header
            html += '<div class="prop-header">';
            html += '<span class="prop-type-badge">' + WB.escapeHtml(node.type) + '</span>';
            html += '<span class="prop-tag">&lt;' + WB.escapeHtml(node.tagName) + '&gt;</span>';
            html += '</div>';

            // Content editor
            if (node.content !== null && node.content !== undefined) {
                html += '<div class="prop-section">';
                html += '<div class="prop-section-title">' + WB.i18n.t('section_Content') + '</div>';
                html += '<div class="prop-row"><textarea data-prop="__content" rows="3">' + WB.escapeHtml(node.content) + '</textarea></div>';
                html += '</div>';
            }

            // Image src (for images)
            if (node.tagName === 'img' || (node.attributes && node.attributes.src !== undefined)) {
                html += '<div class="prop-section">';
                html += '<div class="prop-section-title">' + WB.i18n.t('section_Image') + '</div>';
                html += '<div class="prop-row"><label>' + WB.i18n.t('propSource') + '</label><input type="text" data-attr="src" value="' + WB.escapeHtml(node.attributes.src || '') + '"></div>';
                html += '<div class="prop-row"><label>' + WB.i18n.t('propAltText') + '</label><input type="text" data-attr="alt" value="' + WB.escapeHtml(node.attributes.alt || '') + '"></div>';
                html += '</div>';
            }

            // Link href
            if (node.attributes && node.attributes.href !== undefined) {
                html += '<div class="prop-section">';
                html += '<div class="prop-section-title">' + WB.i18n.t('section_Link') + '</div>';
                html += '<div class="prop-row"><label>' + WB.i18n.t('propURL') + '</label><input type="text" data-attr="href" value="' + WB.escapeHtml(node.attributes.href || '') + '"></div>';
                html += '</div>';
            }

            // Input attributes
            if (node.attributes && node.attributes.placeholder !== undefined) {
                html += '<div class="prop-section">';
                html += '<div class="prop-section-title">' + WB.i18n.t('section_Input') + '</div>';
                html += '<div class="prop-row"><label>' + WB.i18n.t('propPlaceholder') + '</label><input type="text" data-attr="placeholder" value="' + WB.escapeHtml(node.attributes.placeholder || '') + '"></div>';
                if (node.attributes.type !== undefined) {
                    html += '<div class="prop-row"><label>' + WB.i18n.t('propType') + '</label><select data-attr="type">';
                    ['text','email','password','number','tel','url','date'].forEach(function(t) {
                        html += '<option value="' + t + '"' + (node.attributes.type === t ? ' selected' : '') + '>' + t + '</option>';
                    });
                    html += '</select></div>';
                }
                html += '</div>';
            }

            // Group properties by section
            var sections = {};
            for (var p = 0; p < editableProps.length; p++) {
                var propName = editableProps[p];
                var propDef = this.propertyDefs[propName];
                if (!propDef) continue;
                if (!sections[propDef.section]) sections[propDef.section] = [];
                sections[propDef.section].push({ name: propName, def: propDef });
            }

            // Render sections
            var sectionOrder = ['Element', 'Typography', 'Colors', 'Spacing', 'Size', 'Layout', 'Border', 'Background'];
            for (var s = 0; s < sectionOrder.length; s++) {
                var secName = sectionOrder[s];
                if (!sections[secName]) continue;
                html += '<div class="prop-section">';
                html += '<div class="prop-section-title">' + WB.i18n.t('section_' + secName, secName) + '</div>';
                for (var w = 0; w < sections[secName].length; w++) {
                    var prop = sections[secName][w];
                    var val = '';
                    if (prop.name === 'tagName') {
                        val = node.tagName;
                    } else {
                        val = node.styles[prop.name] || '';
                    }
                    html += this._renderWidget(prop.name, prop.def, val);
                }
                html += '</div>';
            }

            // Actions
            html += '<div class="prop-actions">';
            html += '<button class="btn-action" id="prop-move-up" title="Move Up">' + WB.i18n.t('moveUp') + '</button>';
            html += '<button class="btn-action" id="prop-move-down" title="Move Down">' + WB.i18n.t('moveDown') + '</button>';
            html += '</div>';
            html += '<div class="prop-actions">';
            html += '<button class="btn-action" id="prop-duplicate" title="Duplicate (Ctrl+D)">' + WB.i18n.t('duplicate') + '</button>';
            html += '<button class="btn-delete" id="prop-delete" title="Delete (Del)">' + WB.i18n.t('delete') + '</button>';
            html += '</div>';

            container.innerHTML = html;
            this._attachEvents(container, nodeId);
        },

        _renderWidget: function(propName, propDef, currentValue) {
            var html = '<div class="prop-row">';
            html += '<label>' + WB.i18n.t('prop_' + propName, propDef.label) + '</label>';

            switch (propDef.widget) {
                case 'color':
                    var hexVal = this._toHex(currentValue) || '#ffffff';
                    html += '<div class="prop-color-wrap">';
                    html += '<input type="color" data-style="' + propName + '" value="' + hexVal + '">';
                    html += '<input type="text" class="prop-color-text" data-style="' + propName + '" value="' + WB.escapeHtml(currentValue) + '">';
                    html += '</div>';
                    break;

                case 'select':
                    html += '<select data-style="' + propName + '">';
                    for (var i = 0; i < propDef.options.length; i++) {
                        var opt = propDef.options[i];
                        html += '<option value="' + opt + '"' + (opt === currentValue ? ' selected' : '') + '>' + opt + '</option>';
                    }
                    html += '</select>';
                    break;

                case 'range':
                    html += '<input type="range" data-style="' + propName + '" min="' + propDef.min + '" max="' + propDef.max + '" step="' + propDef.step + '" value="' + (currentValue || propDef.max) + '">';
                    html += '<span class="range-value">' + (currentValue || propDef.max) + '</span>';
                    break;

                case 'btngroup':
                    html += '<div class="prop-btn-group">';
                    for (var b = 0; b < propDef.options.length; b++) {
                        var bo = propDef.options[b];
                        html += '<button data-style="' + propName + '" data-value="' + bo.v + '" class="' + (bo.v === currentValue ? 'active' : '') + '">' + bo.l + '</button>';
                    }
                    html += '</div>';
                    break;

                default: // text
                    html += '<input type="text" data-style="' + propName + '" value="' + WB.escapeHtml(currentValue) + '">';
                    break;
            }

            html += '</div>';
            return html;
        },

        _attachEvents: function(container, nodeId) {
            var self = this;
            var undoPushed = false;

            // Style inputs (text, select)
            container.addEventListener('change', function(e) {
                var styleProp = e.target.getAttribute('data-style');
                var attrProp = e.target.getAttribute('data-attr');
                var contentProp = e.target.getAttribute('data-prop');

                if (styleProp) {
                    self._applyStyleChange(nodeId, styleProp, e.target.value);
                } else if (attrProp) {
                    self._applyAttrChange(nodeId, attrProp, e.target.value);
                } else if (contentProp === '__content') {
                    WB.updateState(function() {
                        var n = WB.findNodeById(nodeId);
                        if (n) n.content = e.target.value;
                    });
                }
            });

            // Live updates for text/color inputs
            container.addEventListener('input', function(e) {
                var styleProp = e.target.getAttribute('data-style');
                var attrProp = e.target.getAttribute('data-attr');
                var contentProp = e.target.getAttribute('data-prop');

                if (styleProp) {
                    // Live update without undo on every keystroke
                    var node = WB.findNodeById(nodeId);
                    if (node) {
                        if (styleProp === 'tagName') {
                            node.tagName = e.target.value;
                        } else {
                            node.styles[styleProp] = e.target.value;
                        }
                        WB.Canvas.sync();

                        // Sync color text/picker
                        if (e.target.type === 'color') {
                            var textInput = container.querySelector('input[type="text"][data-style="' + styleProp + '"]');
                            if (textInput) textInput.value = e.target.value;
                        }
                    }

                    // Update range value display
                    if (e.target.type === 'range') {
                        var span = e.target.nextElementSibling;
                        if (span && span.classList.contains('range-value')) {
                            span.textContent = e.target.value;
                        }
                    }
                } else if (attrProp) {
                    var node2 = WB.findNodeById(nodeId);
                    if (node2 && node2.attributes) {
                        node2.attributes[attrProp] = e.target.value;
                        WB.Canvas.sync();
                    }
                } else if (contentProp === '__content') {
                    var node3 = WB.findNodeById(nodeId);
                    if (node3) {
                        node3.content = e.target.value;
                        WB.Canvas.sync();
                    }
                }
            });

            // Push undo on focus (before changes)
            container.addEventListener('focusin', function(e) {
                if (e.target.hasAttribute('data-style') || e.target.hasAttribute('data-attr') || e.target.hasAttribute('data-prop')) {
                    if (!undoPushed) {
                        WB.State.undoStack.push(WB.serializeTree());
                        WB.State.redoStack = [];
                        if (WB.State.undoStack.length > WB.State.maxUndoLevels) {
                            WB.State.undoStack.shift();
                        }
                        undoPushed = true;
                    }
                }
            });

            container.addEventListener('focusout', function() {
                undoPushed = false;
                WB.State.isDirty = true;
            });

            // Button group clicks
            container.addEventListener('click', function(e) {
                var btn = e.target.closest('.prop-btn-group button');
                if (btn) {
                    var styleProp = btn.getAttribute('data-style');
                    var value = btn.getAttribute('data-value');
                    self._applyStyleChange(nodeId, styleProp, value);
                    // Update active state
                    var siblings = btn.parentNode.querySelectorAll('button');
                    for (var i = 0; i < siblings.length; i++) siblings[i].classList.remove('active');
                    btn.classList.add('active');
                    return;
                }

                // Action buttons
                if (e.target.id === 'prop-delete') WB.Actions.deleteSelected();
                if (e.target.id === 'prop-duplicate') WB.Actions.duplicateSelected();
                if (e.target.id === 'prop-move-up') WB.Actions.moveUp();
                if (e.target.id === 'prop-move-down') WB.Actions.moveDown();
            });
        },

        _applyStyleChange: function(nodeId, propName, value) {
            var node = WB.findNodeById(nodeId);
            if (!node) return;
            if (propName === 'tagName') {
                WB.updateState(function() {
                    var n = WB.findNodeById(nodeId);
                    if (n) n.tagName = value;
                }, false);
            } else {
                WB.updateState(function() {
                    var n = WB.findNodeById(nodeId);
                    if (n) n.styles[propName] = value;
                }, false);
            }
        },

        _applyAttrChange: function(nodeId, attrName, value) {
            WB.updateState(function() {
                var n = WB.findNodeById(nodeId);
                if (n && n.attributes) n.attributes[attrName] = value;
            }, false);
        },

        _inferProperties: function(node) {
            var props = ['color', 'backgroundColor', 'padding', 'margin', 'fontSize'];
            if (node.tagName === 'img') {
                props.push('width', 'maxWidth', 'height', 'borderRadius', 'objectFit');
            }
            return props;
        },

        _toHex: function(color) {
            if (!color) return '#ffffff';
            if (color.charAt(0) === '#') return color.length <= 7 ? color : color.substr(0, 7);
            // Try to parse rgb()
            var match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (match) {
                var r = parseInt(match[1]).toString(16).padStart(2, '0');
                var g = parseInt(match[2]).toString(16).padStart(2, '0');
                var b = parseInt(match[3]).toString(16).padStart(2, '0');
                return '#' + r + g + b;
            }
            return '#ffffff';
        }
    };

    /* ============================================================
       LAYER TREE
       ============================================================ */
    WB.LayerTree = {
        render: function() {
            var container = document.getElementById('layer-tree');
            if (!container || container.style.display === 'none') return;

            if (WB.State.documentTree.length === 0) {
                container.innerHTML = '<div class="panel-empty" style="padding:20px"><p>' + WB.i18n.t('noLayers') + '</p></div>';
                return;
            }

            container.innerHTML = this._renderNodes(WB.State.documentTree, 0);
        },

        _renderNodes: function(nodes, depth) {
            var html = '';
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                var selected = node.id === WB.State.selectedElementId ? ' selected' : '';
                var indent = depth * 12;
                var label = node.type;
                if (node.content) {
                    label += ': ' + node.content.substring(0, 20);
                    if (node.content.length > 20) label += '...';
                }
                html += '<div class="layer-item' + selected + '" data-layer-id="' + node.id + '" style="padding-left:' + (8 + indent) + 'px">';
                html += '<span class="layer-item-icon">&lt;' + node.tagName + '&gt;</span>';
                html += '<span>' + WB.escapeHtml(label) + '</span>';
                html += '</div>';

                if (node.children && node.children.length) {
                    html += this._renderNodes(node.children, depth + 1);
                }
            }
            return html;
        }
    };

    /* ============================================================
       TOOLBAR
       ============================================================ */
    WB.Toolbar = {
        init: function() {
            var self = this;

            // Undo/Redo
            document.getElementById('btn-undo').addEventListener('click', function() { WB.Undo.undo(); });
            document.getElementById('btn-redo').addEventListener('click', function() { WB.Undo.redo(); });

            // Viewport
            var vpButtons = document.querySelectorAll('.viewport-btn');
            for (var i = 0; i < vpButtons.length; i++) {
                vpButtons[i].addEventListener('click', function() {
                    var mode = this.getAttribute('data-viewport');
                    WB.Canvas.setViewportMode(mode);
                    var all = document.querySelectorAll('.viewport-btn');
                    for (var j = 0; j < all.length; j++) all[j].classList.remove('active');
                    this.classList.add('active');
                });
            }

            // Project name
            document.getElementById('project-name').addEventListener('change', function() {
                WB.State.projectName = this.value || 'Untitled Project';
            });

            // Templates
            document.getElementById('btn-templates').addEventListener('click', function() { WB.TemplateModal.open(); });

            // Save / Load / Preview / Export
            document.getElementById('btn-save').addEventListener('click', function() { WB.SaveLoad.save(); });
            document.getElementById('btn-load').addEventListener('click', function() { WB.SaveLoad.showLoadDialog(); });
            document.getElementById('btn-preview').addEventListener('click', function() { WB.Export.preview(); });
            document.getElementById('btn-export').addEventListener('click', function() { WB.Export.showExportDialog(); });

            // Layer toggle
            var layerToggle = document.getElementById('layer-toggle');
            layerToggle.addEventListener('click', function() {
                var tree = document.getElementById('layer-tree');
                var visible = tree.style.display !== 'none';
                tree.style.display = visible ? 'none' : '';
                layerToggle.classList.toggle('open', !visible);
                if (!visible) WB.LayerTree.render();
            });

            // Layer tree click delegation
            document.getElementById('layer-tree').addEventListener('click', function(e) {
                var item = e.target.closest('.layer-item');
                if (item) {
                    var id = item.getAttribute('data-layer-id');
                    WB.Selection.select(id);
                    // Scroll into view in canvas
                    var el = WB.Canvas.doc.querySelector('[data-wb-id="' + id + '"]');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        },

        updateState: function() {
            var undoBtn = document.getElementById('btn-undo');
            var redoBtn = document.getElementById('btn-redo');
            if (undoBtn) undoBtn.disabled = WB.State.undoStack.length === 0;
            if (redoBtn) redoBtn.disabled = WB.State.redoStack.length === 0;

            var nameInput = document.getElementById('project-name');
            if (nameInput && nameInput !== document.activeElement) {
                nameInput.value = WB.State.projectName;
            }
        }
    };

    /* ============================================================
       KEYBOARD SHORTCUTS (parent frame)
       ============================================================ */
    WB.Keyboard = {
        init: function() {
            document.addEventListener('keydown', function(e) {
                // Don't intercept when typing in inputs
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

                if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
                    e.preventDefault();
                    WB.Undo.undo();
                }
                if (e.ctrlKey && (e.key === 'y' || (e.shiftKey && e.key === 'z') || (e.shiftKey && e.key === 'Z'))) {
                    e.preventDefault();
                    WB.Undo.redo();
                }
                if (e.ctrlKey && e.key === 's') {
                    e.preventDefault();
                    WB.SaveLoad.save();
                }
                if ((e.key === 'Delete' || e.key === 'Backspace') && WB.State.selectedElementId) {
                    e.preventDefault();
                    WB.Actions.deleteSelected();
                }
                if (e.ctrlKey && e.key === 'd' && WB.State.selectedElementId) {
                    e.preventDefault();
                    WB.Actions.duplicateSelected();
                }
                if (e.key === 'Escape') {
                    WB.Selection.deselect();
                }
            });
        }
    };

    /* ============================================================
       SAVE / LOAD
       ============================================================ */
    WB.SaveLoad = {
        STORAGE_KEY: 'webbuilder_projects',

        save: function(slotName) {
            slotName = slotName || WB.State.projectName;
            var data = {
                version: 1,
                projectName: WB.State.projectName,
                documentTree: WB.State.documentTree,
                viewportMode: WB.State.viewportMode,
                savedAt: new Date().toISOString()
            };
            var projects = this._getAll();
            projects[slotName] = data;
            try {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
                WB.State.isDirty = false;
                WB.showToast(WB.i18n.t('projectSaved'));
            } catch (e) {
                WB.showToast(WB.i18n.t('saveFailed'), 'error');
            }
        },

        load: function(slotName) {
            var projects = this._getAll();
            var data = projects[slotName];
            if (!data) return false;
            WB.State.documentTree = data.documentTree || [];
            WB.State.projectName = data.projectName || slotName;
            WB.State.viewportMode = data.viewportMode || 'desktop';
            WB.State.undoStack = [];
            WB.State.redoStack = [];
            WB.State.selectedElementId = null;
            WB.State.isDirty = false;

            // Reset viewport
            WB.Canvas.setViewportMode(WB.State.viewportMode);
            var vpBtns = document.querySelectorAll('.viewport-btn');
            for (var i = 0; i < vpBtns.length; i++) {
                vpBtns[i].classList.toggle('active', vpBtns[i].getAttribute('data-viewport') === WB.State.viewportMode);
            }

            WB.render();
            WB.Modal.close();
            WB.showToast(WB.i18n.t('projectLoaded'));
            return true;
        },

        deleteProject: function(slotName) {
            var projects = this._getAll();
            delete projects[slotName];
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
        },

        listProjects: function() {
            var projects = this._getAll();
            return Object.keys(projects).map(function(name) {
                return { name: name, savedAt: projects[name].savedAt || '' };
            });
        },

        showLoadDialog: function() {
            var projects = this.listProjects();
            var html = '';

            if (projects.length === 0) {
                html = '<div class="no-projects">' + WB.i18n.t('noSavedProjects') + '</div>';
            } else {
                html = '<div class="project-list">';
                for (var i = 0; i < projects.length; i++) {
                    var p = projects[i];
                    var date = p.savedAt ? new Date(p.savedAt).toLocaleString() : 'Unknown';
                    html += '<div class="project-item" data-project-name="' + WB.escapeHtml(p.name) + '">';
                    html += '<div><div class="project-item-name">' + WB.escapeHtml(p.name) + '</div>';
                    html += '<div class="project-item-date">' + date + '</div></div>';
                    html += '<div class="project-item-actions">';
                    html += '<button class="project-delete-btn" data-delete="' + WB.escapeHtml(p.name) + '" title="Delete">&times;</button>';
                    html += '</div></div>';
                }
                html += '</div>';
            }

            WB.Modal.open(WB.i18n.t('loadProject'), html);

            // Attach events
            var body = document.getElementById('modal-body');
            body.addEventListener('click', function(e) {
                var deleteBtn = e.target.closest('.project-delete-btn');
                if (deleteBtn) {
                    e.stopPropagation();
                    var name = deleteBtn.getAttribute('data-delete');
                    if (confirm(WB.i18n.t('deleteConfirm').replace('{name}', name))) {
                        WB.SaveLoad.deleteProject(name);
                        WB.SaveLoad.showLoadDialog();
                    }
                    return;
                }

                var item = e.target.closest('.project-item');
                if (item) {
                    var projName = item.getAttribute('data-project-name');
                    WB.SaveLoad.load(projName);
                }
            });
        },

        _getAll: function() {
            try {
                return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || {};
            } catch (e) {
                return {};
            }
        }
    };

    /* ============================================================
       EXPORT
       ============================================================ */
    WB.Export = {
        generateHTML: function() {
            var lines = [];
            lines.push('<!DOCTYPE html>');
            lines.push('<html lang="en">');
            lines.push('<head>');
            lines.push('    <meta charset="UTF-8">');
            lines.push('    <meta name="viewport" content="width=device-width, initial-scale=1.0">');
            lines.push('    <title>' + WB.escapeHtml(WB.State.projectName) + '</title>');
            lines.push('    <style>');
            lines.push('        * { margin: 0; padding: 0; box-sizing: border-box; }');
            lines.push('        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }');
            lines.push('        img { max-width: 100%; height: auto; }');
            lines.push('        a { color: inherit; text-decoration: inherit; }');
            lines.push('    </style>');
            lines.push('</head>');
            lines.push('<body>');
            lines.push(this._renderNodes(WB.State.documentTree, 1));
            lines.push('</body>');
            lines.push('</html>');
            return lines.join('\n');
        },

        _renderNodes: function(nodes, depth) {
            var lines = [];
            var indent = '    '.repeat(depth);

            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                var tag = node.tagName;
                var styleStr = WB.stylesToString(node.styles);
                var attrsStr = this._attrsToString(node.attributes);
                var voidTags = { img: 1, br: 1, hr: 1, input: 1 };

                var openTag = indent + '<' + tag;
                if (attrsStr) openTag += ' ' + attrsStr;
                if (styleStr) openTag += ' style="' + WB.escapeHtml(styleStr) + '"';

                if (voidTags[tag]) {
                    lines.push(openTag + '>');
                } else if (node.children && node.children.length > 0) {
                    lines.push(openTag + '>');
                    if (node.content) {
                        lines.push(indent + '    ' + WB.escapeHtml(node.content));
                    }
                    lines.push(this._renderNodes(node.children, depth + 1));
                    lines.push(indent + '</' + tag + '>');
                } else if (node.content) {
                    lines.push(openTag + '>' + WB.escapeHtml(node.content) + '</' + tag + '>');
                } else {
                    lines.push(openTag + '></' + tag + '>');
                }
            }

            return lines.join('\n');
        },

        _attrsToString: function(attrs) {
            if (!attrs) return '';
            return Object.keys(attrs).map(function(key) {
                if (!attrs[key] && attrs[key] !== '') return '';
                return key + '="' + WB.escapeHtml(attrs[key]) + '"';
            }).filter(Boolean).join(' ');
        },

        preview: function() {
            var html = this.generateHTML();
            var blob = new Blob([html], { type: 'text/html' });
            var url = URL.createObjectURL(blob);
            window.open(url, '_blank');
            setTimeout(function() { URL.revokeObjectURL(url); }, 60000);
        },

        download: function() {
            var html = this.generateHTML();
            var blob = new Blob([html], { type: 'text/html' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = WB.State.projectName.replace(/[^a-z0-9]/gi, '-').toLowerCase() + '.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            WB.showToast(WB.i18n.t('htmlDownloaded'));
        },

        copyToClipboard: function() {
            var html = this.generateHTML();
            navigator.clipboard.writeText(html).then(function() {
                WB.showToast(WB.i18n.t('htmlCopied'));
            }).catch(function() {
                WB.showToast(WB.i18n.t('copyFailed'), 'error');
            });
        },

        showExportDialog: function() {
            var html = this.generateHTML();
            var content = '';
            content += '<div class="export-preview">';
            content += '<div class="export-code">' + WB.escapeHtml(html) + '</div>';
            content += '<div class="export-actions">';
            content += '<button id="export-copy">' + WB.i18n.t('copyCode') + '</button>';
            content += '<button id="export-preview-btn">' + WB.i18n.t('preview') + '</button>';
            content += '<button id="export-download" class="btn-primary">' + WB.i18n.t('downloadHTML') + '</button>';
            content += '</div></div>';

            WB.Modal.open(WB.i18n.t('exportHTML'), content);

            document.getElementById('export-copy').addEventListener('click', function() {
                WB.Export.copyToClipboard();
            });
            document.getElementById('export-preview-btn').addEventListener('click', function() {
                WB.Export.preview();
            });
            document.getElementById('export-download').addEventListener('click', function() {
                WB.Export.download();
                WB.Modal.close();
            });
        }
    };

    /* ============================================================
       MODAL
       ============================================================ */
    WB.Modal = {
        open: function(title, bodyHTML, cssClass) {
            document.getElementById('modal-title').textContent = title;
            document.getElementById('modal-body').innerHTML = bodyHTML;
            var modal = document.getElementById('modal');
            modal.className = 'modal' + (cssClass ? ' ' + cssClass : '');
            document.getElementById('modal-overlay').classList.add('visible');
        },

        close: function() {
            document.getElementById('modal-overlay').classList.remove('visible');
            document.getElementById('modal').className = 'modal';
        },

        init: function() {
            var overlay = document.getElementById('modal-overlay');
            document.getElementById('modal-close').addEventListener('click', function() {
                WB.Modal.close();
            });
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) WB.Modal.close();
            });
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && overlay.classList.contains('visible')) {
                    WB.Modal.close();
                }
            });
        }
    };

    /* ============================================================
       DRAG/DROP — Canvas area accepts drags from component panel
       ============================================================ */
    WB.CanvasDrop = {
        init: function() {
            var canvasArea = document.getElementById('canvas-area');

            canvasArea.addEventListener('dragover', function(e) {
                if (WB.State.dragState && WB.State.dragState.sourceType === 'library') {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'copy';
                }
            });

            canvasArea.addEventListener('dragleave', function(e) {
                if (!canvasArea.contains(e.relatedTarget)) {
                    canvasArea.classList.remove('drag-over');
                }
            });

            canvasArea.addEventListener('drop', function(e) {
                e.preventDefault();
                canvasArea.classList.remove('drag-over');

                if (!WB.State.dragState || WB.State.dragState.sourceType !== 'library') return;

                var type = WB.State.dragState.componentType;
                WB.updateState(function() {
                    var node = WB.ComponentLibrary.createNode(type);
                    if (node) {
                        WB.State.documentTree.push(node);
                        WB.State.selectedElementId = node.id;
                    }
                });
                WB.State.dragState = null;
            });
        }
    };

    /* ============================================================
       LANGUAGE SWITCHER
       ============================================================ */
    WB.LanguageSwitcher = {
        init: function() {
            var btn = document.getElementById('lang-btn');
            var dropdown = document.getElementById('lang-dropdown');
            var currentEl = document.getElementById('lang-current');
            if (!btn || !dropdown) return;

            // Restore saved language label
            var meta = WB.i18n.langMeta[WB.i18n.currentLang];
            if (currentEl && meta) currentEl.textContent = meta.flag;

            // Mark active option
            var opts = dropdown.querySelectorAll('.lang-option');
            for (var i = 0; i < opts.length; i++) {
                opts[i].classList.toggle('active', opts[i].getAttribute('data-lang') === WB.i18n.currentLang);
            }

            // Toggle dropdown
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                dropdown.classList.toggle('open');
            });

            // Close on outside click
            document.addEventListener('click', function() {
                dropdown.classList.remove('open');
            });

            // Language option selection
            dropdown.addEventListener('click', function(e) {
                var option = e.target.closest('.lang-option');
                if (!option) return;
                var lang = option.getAttribute('data-lang');
                WB.i18n.setLanguage(lang);
                dropdown.classList.remove('open');
            });
        }
    };

    /* ============================================================
       UNSAVED CHANGES WARNING
       ============================================================ */
    window.addEventListener('beforeunload', function(e) {
        if (WB.State.isDirty) {
            e.preventDefault();
            e.returnValue = '';
        }
    });

    /* ============================================================
       INIT
       ============================================================ */
    document.addEventListener('DOMContentLoaded', function() {
        WB.i18n.init();
        WB.Canvas.init();
        WB.ComponentPanel.init();
        WB.Toolbar.init();
        WB.PropertyEditor.init();
        WB.Keyboard.init();
        WB.Modal.init();
        WB.CanvasDrop.init();
        WB.LanguageSwitcher.init();
        WB.render();
    });

})(window.WebBuilder = window.WebBuilder || {});
