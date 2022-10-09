
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.49.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\App.svelte generated by Svelte v3.49.0 */

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    // (107:4) {#if ruta == 'about'}
    function create_if_block_2(ctx) {
    	let div2;
    	let h10;
    	let t1;
    	let p0;
    	let svg;
    	let path;
    	let t2;
    	let t3;
    	let button;
    	let t5;
    	let div1;
    	let p1;
    	let t7;
    	let h11;
    	let t9;
    	let div0;
    	let ul;
    	let li0;
    	let t11;
    	let li1;
    	let t13;
    	let li2;
    	let t15;
    	let li3;
    	let t17;
    	let li4;
    	let t19;
    	let li5;
    	let t21;
    	let li6;
    	let t23;
    	let li7;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			h10 = element("h1");
    			h10.textContent = "About Me";
    			t1 = space();
    			p0 = element("p");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t2 = text("\t\t\t\t\t\t\t  \r\n\t\t\t\t\t\t\tI am Laura, web developer from Mexico, Oaxaca. \r\n\t\t\t\t\t\t\tI have experience in web design, coding and programing.\r\n\t\t\t\t\t\t\tMy expertise lies within front-end web apps, and the main languages in my tech stack are \r\n\t\t\t\t\t\t\tJavaScript, React, and of course HTML/CSS");
    			t3 = space();
    			button = element("button");
    			button.textContent = "Download CV";
    			t5 = space();
    			div1 = element("div");
    			p1 = element("p");
    			p1.textContent = "What can I do?";
    			t7 = space();
    			h11 = element("h1");
    			h11.textContent = "My Skills";
    			t9 = space();
    			div0 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "PHP";
    			t11 = space();
    			li1 = element("li");
    			li1.textContent = "JavaScript";
    			t13 = space();
    			li2 = element("li");
    			li2.textContent = "Angular";
    			t15 = space();
    			li3 = element("li");
    			li3.textContent = "ReactJs";
    			t17 = space();
    			li4 = element("li");
    			li4.textContent = "HTML";
    			t19 = space();
    			li5 = element("li");
    			li5.textContent = "CSS";
    			t21 = space();
    			li6 = element("li");
    			li6.textContent = "Botstrap/TailWind";
    			t23 = space();
    			li7 = element("li");
    			li7.textContent = "Git";
    			attr_dev(h10, "class", "text-4xl font-bold");
    			add_location(h10, file, 108, 6, 7056);
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z");
    			add_location(path, file, 111, 8, 7346);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "1.5");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "class", "w-10 h-10 p-2 bg-purple-200 rounded-md text-purple-800");
    			add_location(svg, file, 110, 7, 7160);
    			attr_dev(p0, "class", "p-3 my-5 bg-zinc-100 rounded-md");
    			add_location(p0, file, 109, 6, 7108);
    			attr_dev(button, "class", "rounded-full bg-pink-200 py-2 px-3 hover:bg-pink-300");
    			add_location(button, file, 118, 6, 7864);
    			attr_dev(p1, "class", "");
    			add_location(p1, file, 120, 7, 7988);
    			attr_dev(h11, "class", "text-3xl font-bold");
    			add_location(h11, file, 121, 7, 8027);
    			add_location(li0, file, 124, 9, 8169);
    			add_location(li1, file, 125, 9, 8192);
    			add_location(li2, file, 126, 9, 8222);
    			add_location(li3, file, 127, 9, 8249);
    			add_location(li4, file, 128, 9, 8276);
    			add_location(li5, file, 129, 9, 8300);
    			add_location(li6, file, 130, 9, 8323);
    			add_location(li7, file, 131, 9, 8360);
    			attr_dev(ul, "class", "list-none");
    			add_location(ul, file, 123, 8, 8136);
    			attr_dev(div0, "class", "p-3 my-5 bg-zinc-100 rounded-md");
    			add_location(div0, file, 122, 7, 8081);
    			attr_dev(div1, "class", "mt-5");
    			add_location(div1, file, 119, 6, 7961);
    			attr_dev(div2, "class", "mt-10");
    			add_location(div2, file, 107, 5, 7029);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h10);
    			append_dev(div2, t1);
    			append_dev(div2, p0);
    			append_dev(p0, svg);
    			append_dev(svg, path);
    			append_dev(p0, t2);
    			append_dev(div2, t3);
    			append_dev(div2, button);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			append_dev(div1, p1);
    			append_dev(div1, t7);
    			append_dev(div1, h11);
    			append_dev(div1, t9);
    			append_dev(div1, div0);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t11);
    			append_dev(ul, li1);
    			append_dev(ul, t13);
    			append_dev(ul, li2);
    			append_dev(ul, t15);
    			append_dev(ul, li3);
    			append_dev(ul, t17);
    			append_dev(ul, li4);
    			append_dev(ul, t19);
    			append_dev(ul, li5);
    			append_dev(ul, t21);
    			append_dev(ul, li6);
    			append_dev(ul, t23);
    			append_dev(ul, li7);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(107:4) {#if ruta == 'about'}",
    		ctx
    	});

    	return block;
    }

    // (139:4) {#if ruta == 'resume'}
    function create_if_block_1(ctx) {
    	let div5;
    	let h1;
    	let t1;
    	let div4;
    	let div2;
    	let svg0;
    	let path0;
    	let t2;
    	let h20;
    	let t4;
    	let div0;
    	let p0;
    	let t6;
    	let p1;
    	let t8;
    	let p2;
    	let t10;
    	let hr;
    	let t11;
    	let div1;
    	let p3;
    	let t13;
    	let p4;
    	let t15;
    	let p5;
    	let t17;
    	let div3;
    	let svg1;
    	let path1;
    	let t18;
    	let h21;

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Resume";
    			t1 = space();
    			div4 = element("div");
    			div2 = element("div");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t2 = space();
    			h20 = element("h2");
    			h20.textContent = "Education";
    			t4 = space();
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "2015-2019";
    			t6 = space();
    			p1 = element("p");
    			p1.textContent = "Ing. Tecnologias de la Informacion";
    			t8 = space();
    			p2 = element("p");
    			p2.textContent = "Universidad Tecnologica de los Valles Centrales de Oaxaca";
    			t10 = space();
    			hr = element("hr");
    			t11 = space();
    			div1 = element("div");
    			p3 = element("p");
    			p3.textContent = "2012-2015";
    			t13 = space();
    			p4 = element("p");
    			p4.textContent = "Bachillerato";
    			t15 = space();
    			p5 = element("p");
    			p5.textContent = "Universidad Tecnologica de los Valles Centrales de Oaxaca";
    			t17 = space();
    			div3 = element("div");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t18 = space();
    			h21 = element("h2");
    			h21.textContent = "Experience";
    			attr_dev(h1, "class", "text-4xl font-bold");
    			add_location(h1, file, 140, 6, 8512);
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "d", "M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5");
    			add_location(path0, file, 144, 9, 8845);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "stroke-width", "1.5");
    			attr_dev(svg0, "stroke", "currentColor");
    			attr_dev(svg0, "class", "w-10 h-10 p-2 bg-blue-200 rounded-md text-blue-800");
    			add_location(svg0, file, 143, 8, 8662);
    			attr_dev(h20, "class", "text-2xl font-bold mb-2");
    			add_location(h20, file, 146, 7, 9383);
    			attr_dev(p0, "class", "text-xs text-gray-500");
    			add_location(p0, file, 148, 8, 9466);
    			attr_dev(p1, "class", "text-gray-700 font-bold");
    			add_location(p1, file, 149, 8, 9522);
    			add_location(p2, file, 150, 8, 9605);
    			attr_dev(div0, "class", "");
    			add_location(div0, file, 147, 7, 9442);
    			add_location(hr, file, 152, 7, 9693);
    			attr_dev(p3, "class", "text-xs text-gray-500");
    			add_location(p3, file, 154, 8, 9730);
    			attr_dev(p4, "class", "text-gray-700 font-bold");
    			add_location(p4, file, 155, 8, 9786);
    			add_location(p5, file, 156, 8, 9847);
    			attr_dev(div1, "class", "");
    			add_location(div1, file, 153, 7, 9706);
    			attr_dev(div2, "class", "bg-zinc-100 rounded-md p-3");
    			add_location(div2, file, 142, 7, 8612);
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "d", "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z");
    			add_location(path1, file, 162, 9, 10189);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "stroke-width", "1.5");
    			attr_dev(svg1, "stroke", "currentColor");
    			attr_dev(svg1, "class", "w-10 h-10 p-2 bg-orange-200 rounded-md text-orange-800");
    			add_location(svg1, file, 161, 8, 10002);
    			attr_dev(h21, "class", "text-2xl font-bold");
    			add_location(h21, file, 164, 8, 10860);
    			attr_dev(div3, "class", "bg-zinc-100 rounded-md p-3");
    			add_location(div3, file, 160, 7, 9952);
    			attr_dev(div4, "class", "grid grid-cols-2 gap-4 py-8");
    			add_location(div4, file, 141, 6, 8562);
    			attr_dev(div5, "class", "mt-10");
    			add_location(div5, file, 139, 5, 8485);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, h1);
    			append_dev(div5, t1);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, svg0);
    			append_dev(svg0, path0);
    			append_dev(div2, t2);
    			append_dev(div2, h20);
    			append_dev(div2, t4);
    			append_dev(div2, div0);
    			append_dev(div0, p0);
    			append_dev(div0, t6);
    			append_dev(div0, p1);
    			append_dev(div0, t8);
    			append_dev(div0, p2);
    			append_dev(div2, t10);
    			append_dev(div2, hr);
    			append_dev(div2, t11);
    			append_dev(div2, div1);
    			append_dev(div1, p3);
    			append_dev(div1, t13);
    			append_dev(div1, p4);
    			append_dev(div1, t15);
    			append_dev(div1, p5);
    			append_dev(div4, t17);
    			append_dev(div4, div3);
    			append_dev(div3, svg1);
    			append_dev(svg1, path1);
    			append_dev(div3, t18);
    			append_dev(div3, h21);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(139:4) {#if ruta == 'resume'}",
    		ctx
    	});

    	return block;
    }

    // (171:5) {#if ruta == 'works'}
    function create_if_block(ctx) {
    	let div;
    	let h1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Portfolio";
    			add_location(h1, file, 172, 6, 11010);
    			add_location(div, file, 171, 5, 10997);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(171:5) {#if ruta == 'works'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let div19;
    	let div0;
    	let nav;
    	let ul;
    	let li0;
    	let button0;
    	let svg0;
    	let path0;
    	let t0;
    	let p0;
    	let t2;
    	let li1;
    	let button1;
    	let svg1;
    	let path1;
    	let t3;
    	let p1;
    	let t5;
    	let li2;
    	let button2;
    	let svg2;
    	let path2;
    	let t6;
    	let p2;
    	let t8;
    	let div16;
    	let div15;
    	let div1;
    	let img;
    	let img_src_value;
    	let t9;
    	let strong;
    	let t11;
    	let div14;
    	let div4;
    	let div2;
    	let svg3;
    	let path3;
    	let t12;
    	let div3;
    	let p3;
    	let t14;
    	let p4;
    	let t16;
    	let div7;
    	let div5;
    	let svg4;
    	let path4;
    	let t17;
    	let div6;
    	let p5;
    	let t19;
    	let p6;
    	let t21;
    	let div10;
    	let div8;
    	let svg5;
    	let path5;
    	let path6;
    	let t22;
    	let div9;
    	let p7;
    	let t24;
    	let p8;
    	let t26;
    	let div13;
    	let div11;
    	let svg6;
    	let path7;
    	let t27;
    	let div12;
    	let p9;
    	let t29;
    	let p10;
    	let t31;
    	let div18;
    	let div17;
    	let t32;
    	let t33;
    	let mounted;
    	let dispose;
    	let if_block0 = /*ruta*/ ctx[0] == 'about' && create_if_block_2(ctx);
    	let if_block1 = /*ruta*/ ctx[0] == 'resume' && create_if_block_1(ctx);
    	let if_block2 = /*ruta*/ ctx[0] == 'works' && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div19 = element("div");
    			div0 = element("div");
    			nav = element("nav");
    			ul = element("ul");
    			li0 = element("li");
    			button0 = element("button");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t0 = space();
    			p0 = element("p");
    			p0.textContent = "About";
    			t2 = space();
    			li1 = element("li");
    			button1 = element("button");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "Resume";
    			t5 = space();
    			li2 = element("li");
    			button2 = element("button");
    			svg2 = svg_element("svg");
    			path2 = svg_element("path");
    			t6 = space();
    			p2 = element("p");
    			p2.textContent = "Works";
    			t8 = space();
    			div16 = element("div");
    			div15 = element("div");
    			div1 = element("div");
    			img = element("img");
    			t9 = space();
    			strong = element("strong");
    			strong.textContent = "Web Developer";
    			t11 = space();
    			div14 = element("div");
    			div4 = element("div");
    			div2 = element("div");
    			svg3 = svg_element("svg");
    			path3 = svg_element("path");
    			t12 = space();
    			div3 = element("div");
    			p3 = element("p");
    			p3.textContent = "Phone";
    			t14 = space();
    			p4 = element("p");
    			p4.textContent = "9514479026";
    			t16 = space();
    			div7 = element("div");
    			div5 = element("div");
    			svg4 = svg_element("svg");
    			path4 = svg_element("path");
    			t17 = space();
    			div6 = element("div");
    			p5 = element("p");
    			p5.textContent = "Email";
    			t19 = space();
    			p6 = element("p");
    			p6.textContent = "lauraramos418@gmail.com";
    			t21 = space();
    			div10 = element("div");
    			div8 = element("div");
    			svg5 = svg_element("svg");
    			path5 = svg_element("path");
    			path6 = svg_element("path");
    			t22 = space();
    			div9 = element("div");
    			p7 = element("p");
    			p7.textContent = "Location";
    			t24 = space();
    			p8 = element("p");
    			p8.textContent = "Oaxaca de juarez";
    			t26 = space();
    			div13 = element("div");
    			div11 = element("div");
    			svg6 = svg_element("svg");
    			path7 = svg_element("path");
    			t27 = space();
    			div12 = element("div");
    			p9 = element("p");
    			p9.textContent = "Birthday";
    			t29 = space();
    			p10 = element("p");
    			p10.textContent = "27/05/1997";
    			t31 = space();
    			div18 = element("div");
    			div17 = element("div");
    			if (if_block0) if_block0.c();
    			t32 = space();
    			if (if_block1) if_block1.c();
    			t33 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "d", "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z");
    			add_location(path0, file, 18, 8, 740);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "stroke-width", "1.5");
    			attr_dev(svg0, "stroke", "currentColor");
    			attr_dev(svg0, "class", "w-6 h-6");
    			add_location(svg0, file, 17, 7, 601);
    			add_location(p0, file, 20, 7, 980);
    			attr_dev(button0, "href", "/");
    			attr_dev(button0, "class", "border-3 border-pink-500 rounded-md flex justify-center h-12 hover:bg-pink-500 items-center px-3 mx-2 transition duration-700");
    			add_location(button0, file, 15, 6, 398);
    			attr_dev(li0, "class", "");
    			add_location(li0, file, 14, 5, 377);
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "d", "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z");
    			add_location(path1, file, 29, 8, 1412);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "stroke-width", "1.5");
    			attr_dev(svg1, "stroke", "currentColor");
    			attr_dev(svg1, "class", "w-6 h-6");
    			add_location(svg1, file, 28, 7, 1273);
    			add_location(p1, file, 31, 9, 1777);
    			attr_dev(button1, "href", "/");
    			attr_dev(button1, "class", "border-3 border-pink-500 rounded-md flex justify-center h-12 hover:bg-pink-500 items-center px-3 mx-2 transition duration-700");
    			add_location(button1, file, 26, 6, 1069);
    			attr_dev(li1, "class", "");
    			add_location(li1, file, 25, 5, 1048);
    			attr_dev(path2, "stroke-linecap", "round");
    			attr_dev(path2, "stroke-linejoin", "round");
    			attr_dev(path2, "d", "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z");
    			add_location(path2, file, 40, 8, 2220);
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "fill", "none");
    			attr_dev(svg2, "viewBox", "0 0 24 24");
    			attr_dev(svg2, "stroke-width", "1.5");
    			attr_dev(svg2, "stroke", "currentColor");
    			attr_dev(svg2, "class", "w-6 h-6");
    			add_location(svg2, file, 39, 7, 2081);
    			add_location(p2, file, 42, 9, 2881);
    			attr_dev(button2, "href", "/");
    			attr_dev(button2, "class", "border-3 border-pink-500 rounded-md flex justify-center h-12 hover:bg-pink-500 items-center px-3 mx-2 transition duration-700");
    			add_location(button2, file, 37, 6, 1878);
    			attr_dev(li2, "class", "");
    			add_location(li2, file, 36, 5, 1857);
    			attr_dev(ul, "class", "flex");
    			add_location(ul, file, 13, 4, 353);
    			attr_dev(nav, "class", "mt-10 flex justify-center");
    			add_location(nav, file, 12, 3, 308);
    			attr_dev(div0, "class", "col-span-12");
    			add_location(div0, file, 11, 2, 278);
    			if (!src_url_equal(img.src, img_src_value = "")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "rounded-full w-32 h-32");
    			add_location(img, file, 51, 5, 3099);
    			attr_dev(div1, "class", "flex justify-center py-4");
    			add_location(div1, file, 50, 4, 3054);
    			add_location(strong, file, 54, 4, 3174);
    			attr_dev(path3, "stroke-linecap", "round");
    			attr_dev(path3, "stroke-linejoin", "round");
    			attr_dev(path3, "d", "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z");
    			add_location(path3, file, 59, 7, 3492);
    			attr_dev(svg3, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg3, "fill", "none");
    			attr_dev(svg3, "viewBox", "0 0 24 24");
    			attr_dev(svg3, "stroke-width", "1.5");
    			attr_dev(svg3, "stroke", "currentColor");
    			attr_dev(svg3, "class", "w-6 h-6 text-pink-600");
    			add_location(svg3, file, 58, 7, 3340);
    			attr_dev(div2, "class", "flex items-center mr-3");
    			add_location(div2, file, 57, 6, 3295);
    			attr_dev(p3, "class", "text-xs text-gray-500");
    			add_location(p3, file, 63, 7, 3981);
    			add_location(p4, file, 64, 7, 4032);
    			attr_dev(div3, "class", "ml-1 text-left");
    			add_location(div3, file, 62, 6, 3944);
    			attr_dev(div4, "class", "flex py-2");
    			add_location(div4, file, 56, 5, 3264);
    			attr_dev(path4, "stroke-linecap", "round");
    			attr_dev(path4, "stroke-linejoin", "round");
    			attr_dev(path4, "d", "M7.875 14.25l1.214 1.942a2.25 2.25 0 001.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 011.872 1.002l.164.246a2.25 2.25 0 001.872 1.002h2.092a2.25 2.25 0 001.872-1.002l.164-.246A2.25 2.25 0 0116.954 9h4.636M2.41 9a2.25 2.25 0 00-.16.832V12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 01.382-.632l3.285-3.832a2.25 2.25 0 011.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0021.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 002.25 2.25z");
    			add_location(path4, file, 70, 8, 4312);
    			attr_dev(svg4, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg4, "fill", "none");
    			attr_dev(svg4, "viewBox", "0 0 24 24");
    			attr_dev(svg4, "stroke-width", "1.5");
    			attr_dev(svg4, "stroke", "currentColor");
    			attr_dev(svg4, "class", "w-6 h-6 text-pink-600");
    			add_location(svg4, file, 69, 7, 4159);
    			attr_dev(div5, "class", "flex items-center mr-3");
    			add_location(div5, file, 68, 6, 4114);
    			attr_dev(p5, "class", "text-xs text-gray-500");
    			add_location(p5, file, 74, 7, 5091);
    			add_location(p6, file, 75, 7, 5142);
    			attr_dev(div6, "class", "ml-1 text-left");
    			add_location(div6, file, 73, 6, 5054);
    			attr_dev(div7, "class", "flex py-2");
    			add_location(div7, file, 67, 5, 4083);
    			attr_dev(path5, "stroke-linecap", "round");
    			attr_dev(path5, "stroke-linejoin", "round");
    			attr_dev(path5, "d", "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z");
    			add_location(path5, file, 81, 8, 5435);
    			attr_dev(path6, "stroke-linecap", "round");
    			attr_dev(path6, "stroke-linejoin", "round");
    			attr_dev(path6, "d", "M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z");
    			add_location(path6, file, 82, 8, 5539);
    			attr_dev(svg5, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg5, "fill", "none");
    			attr_dev(svg5, "viewBox", "0 0 24 24");
    			attr_dev(svg5, "stroke-width", "1.5");
    			attr_dev(svg5, "stroke", "currentColor");
    			attr_dev(svg5, "class", "w-6 h-6 text-pink-600");
    			add_location(svg5, file, 80, 7, 5282);
    			attr_dev(div8, "class", "flex items-center mr-3");
    			add_location(div8, file, 79, 6, 5237);
    			attr_dev(p7, "class", "text-xs text-gray-500");
    			add_location(p7, file, 86, 7, 5772);
    			add_location(p8, file, 87, 7, 5826);
    			attr_dev(div9, "class", "ml-1 text-left");
    			add_location(div9, file, 85, 6, 5735);
    			attr_dev(div10, "class", "flex py-2");
    			add_location(div10, file, 78, 5, 5206);
    			attr_dev(path7, "stroke-linecap", "round");
    			attr_dev(path7, "stroke-linejoin", "round");
    			attr_dev(path7, "d", "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z");
    			add_location(path7, file, 93, 8, 6112);
    			attr_dev(svg6, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg6, "fill", "none");
    			attr_dev(svg6, "viewBox", "0 0 24 24");
    			attr_dev(svg6, "stroke-width", "1.5");
    			attr_dev(svg6, "stroke", "currentColor");
    			attr_dev(svg6, "class", "w-6 h-6 text-pink-600");
    			add_location(svg6, file, 92, 7, 5959);
    			attr_dev(div11, "class", "flex items-center mr-3");
    			add_location(div11, file, 91, 6, 5914);
    			attr_dev(p9, "class", "text-xs text-gray-500");
    			add_location(p9, file, 97, 7, 6811);
    			add_location(p10, file, 98, 7, 6865);
    			attr_dev(div12, "class", "ml-1 text-left");
    			add_location(div12, file, 96, 6, 6774);
    			attr_dev(div13, "class", "flex py-2");
    			add_location(div13, file, 90, 5, 5883);
    			attr_dev(div14, "class", "bg-gray-100 px-2 mt-5 w-72 m-auto");
    			add_location(div14, file, 55, 4, 3210);
    			attr_dev(div15, "class", "w-full text-center p-5");
    			add_location(div15, file, 49, 3, 3012);
    			attr_dev(div16, "class", "col-span-12 lg:col-span-4");
    			add_location(div16, file, 48, 2, 2968);
    			add_location(div17, file, 105, 3, 6990);
    			attr_dev(div18, "class", "col-span-12 lg:col-span-8");
    			add_location(div18, file, 104, 2, 6946);
    			attr_dev(div19, "class", "container grid grid-cols-12 md:gap-5 justify-between mr-auto ml-auto max-w-screen-xl rounded-lg bg-slate-50");
    			add_location(div19, file, 10, 1, 153);
    			attr_dev(main, "class", "m-5 rounded-lg");
    			add_location(main, file, 9, 0, 121);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div19);
    			append_dev(div19, div0);
    			append_dev(div0, nav);
    			append_dev(nav, ul);
    			append_dev(ul, li0);
    			append_dev(li0, button0);
    			append_dev(button0, svg0);
    			append_dev(svg0, path0);
    			append_dev(button0, t0);
    			append_dev(button0, p0);
    			append_dev(ul, t2);
    			append_dev(ul, li1);
    			append_dev(li1, button1);
    			append_dev(button1, svg1);
    			append_dev(svg1, path1);
    			append_dev(button1, t3);
    			append_dev(button1, p1);
    			append_dev(ul, t5);
    			append_dev(ul, li2);
    			append_dev(li2, button2);
    			append_dev(button2, svg2);
    			append_dev(svg2, path2);
    			append_dev(button2, t6);
    			append_dev(button2, p2);
    			append_dev(div19, t8);
    			append_dev(div19, div16);
    			append_dev(div16, div15);
    			append_dev(div15, div1);
    			append_dev(div1, img);
    			append_dev(div15, t9);
    			append_dev(div15, strong);
    			append_dev(div15, t11);
    			append_dev(div15, div14);
    			append_dev(div14, div4);
    			append_dev(div4, div2);
    			append_dev(div2, svg3);
    			append_dev(svg3, path3);
    			append_dev(div4, t12);
    			append_dev(div4, div3);
    			append_dev(div3, p3);
    			append_dev(div3, t14);
    			append_dev(div3, p4);
    			append_dev(div14, t16);
    			append_dev(div14, div7);
    			append_dev(div7, div5);
    			append_dev(div5, svg4);
    			append_dev(svg4, path4);
    			append_dev(div7, t17);
    			append_dev(div7, div6);
    			append_dev(div6, p5);
    			append_dev(div6, t19);
    			append_dev(div6, p6);
    			append_dev(div14, t21);
    			append_dev(div14, div10);
    			append_dev(div10, div8);
    			append_dev(div8, svg5);
    			append_dev(svg5, path5);
    			append_dev(svg5, path6);
    			append_dev(div10, t22);
    			append_dev(div10, div9);
    			append_dev(div9, p7);
    			append_dev(div9, t24);
    			append_dev(div9, p8);
    			append_dev(div14, t26);
    			append_dev(div14, div13);
    			append_dev(div13, div11);
    			append_dev(div11, svg6);
    			append_dev(svg6, path7);
    			append_dev(div13, t27);
    			append_dev(div13, div12);
    			append_dev(div12, p9);
    			append_dev(div12, t29);
    			append_dev(div12, p10);
    			append_dev(div19, t31);
    			append_dev(div19, div18);
    			append_dev(div18, div17);
    			if (if_block0) if_block0.m(div17, null);
    			append_dev(div17, t32);
    			if (if_block1) if_block1.m(div17, null);
    			append_dev(div17, t33);
    			if (if_block2) if_block2.m(div17, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[4], false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*ruta*/ ctx[0] == 'about') {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					if_block0.m(div17, t32);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*ruta*/ ctx[0] == 'resume') {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_1(ctx);
    					if_block1.c();
    					if_block1.m(div17, t33);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*ruta*/ ctx[0] == 'works') {
    				if (if_block2) ; else {
    					if_block2 = create_if_block(ctx);
    					if_block2.c();
    					if_block2.m(div17, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { name } = $$props;
    	var ruta = 'about';

    	function setRuta(r) {
    		$$invalidate(0, ruta = r);
    		console.log(ruta);
    	}

    	const writable_props = ['name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => setRuta('about');
    	const click_handler_1 = () => setRuta('resume');
    	const click_handler_2 = () => setRuta('works');

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(2, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({ name, ruta, setRuta });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(2, name = $$props.name);
    		if ('ruta' in $$props) $$invalidate(0, ruta = $$props.ruta);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ruta, setRuta, name, click_handler, click_handler_1, click_handler_2];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { name: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[2] === undefined && !('name' in props)) {
    			console_1.warn("<App> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
