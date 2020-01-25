
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
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

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
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
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
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
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let stylesheet;
    let active = 0;
    let current_rules = {};
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        if (!current_rules[name]) {
            if (!stylesheet) {
                const style = element('style');
                document.head.appendChild(style);
                stylesheet = style.sheet;
            }
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        node.style.animation = (node.style.animation || '')
            .split(', ')
            .filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        )
            .join(', ');
        if (name && !--active)
            clear_rules();
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            let i = stylesheet.cssRules.length;
            while (i--)
                stylesheet.deleteRule(i);
            current_rules = {};
        });
    }

    function create_animation(node, from, fn, params) {
        if (!from)
            return noop;
        const to = node.getBoundingClientRect();
        if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
            return noop;
        const { delay = 0, duration = 300, easing = identity, 
        // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
        start: start_time = now() + delay, 
        // @ts-ignore todo:
        end = start_time + duration, tick = noop, css } = fn(node, { from, to }, params);
        let running = true;
        let started = false;
        let name;
        function start() {
            if (css) {
                name = create_rule(node, 0, 1, duration, delay, easing, css);
            }
            if (!delay) {
                started = true;
            }
        }
        function stop() {
            if (css)
                delete_rule(node, name);
            running = false;
        }
        loop(now => {
            if (!started && now >= start_time) {
                started = true;
            }
            if (started && now >= end) {
                tick(1, 0);
                stop();
            }
            if (!running) {
                return false;
            }
            if (started) {
                const p = now - start_time;
                const t = 0 + 1 * easing(p / duration);
                tick(t, 1 - t);
            }
            return true;
        });
        start();
        tick(0, 1);
        return stop;
    }
    function fix_position(node) {
        const style = getComputedStyle(node);
        if (style.position !== 'absolute' && style.position !== 'fixed') {
            const { width, height } = style;
            const a = node.getBoundingClientRect();
            node.style.position = 'absolute';
            node.style.width = width;
            node.style.height = height;
            add_transform(node, a);
        }
    }
    function add_transform(node, a) {
        const b = node.getBoundingClientRect();
        if (a.left !== b.left || a.top !== b.top) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
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
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
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
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function fix_and_destroy_block(block, lookup) {
        block.f();
        destroy_block(block, lookup);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
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
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
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
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
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
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
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
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.17.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    /* src/components/todos/TodoForm.svelte generated by Svelte v3.17.1 */
    const file = "src/components/todos/TodoForm.svelte";

    function create_fragment(ctx) {
    	let div;
    	let form;
    	let input;
    	let input_placeholder_value;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			form = element("form");
    			input = element("input");
    			attr_dev(input, "type", "text");

    			attr_dev(input, "placeholder", input_placeholder_value = /*todos*/ ctx[0].length > 0
    			? "Add another todo"
    			: "Add a todo");

    			attr_dev(input, "class", "w-full py-2 px-3 text-md font-sans font-normal bg-transparent\n      border-transparent shadow-none outline-none text-white text-lg");
    			add_location(input, file, 27, 4, 816);
    			attr_dev(form, "class", "mb-3");
    			attr_dev(form, "id", "todo-input");
    			add_location(form, file, 26, 2, 745);
    			attr_dev(div, "class", "input-todo svelte-10ghh8j");
    			add_location(div, file, 25, 0, 718);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, form);
    			append_dev(form, input);
    			/*input_binding*/ ctx[5](input);
    			set_input_value(input, /*text*/ ctx[1]);

    			dispose = [
    				listen_dev(input, "input", /*input_input_handler*/ ctx[6]),
    				listen_dev(form, "submit", prevent_default(/*add*/ ctx[3]), false, true, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*todos*/ 1 && input_placeholder_value !== (input_placeholder_value = /*todos*/ ctx[0].length > 0
    			? "Add another todo"
    			: "Add a todo")) {
    				attr_dev(input, "placeholder", input_placeholder_value);
    			}

    			if (dirty & /*text*/ 2 && input.value !== /*text*/ ctx[1]) {
    				set_input_value(input, /*text*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*input_binding*/ ctx[5](null);
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
    	let { todos = [] } = $$props;
    	let text;
    	let todoInput;
    	onMount(() => todoInput.focus());
    	const dispatch = createEventDispatcher();

    	const add = () => {
    		dispatch("add", { text });
    		$$invalidate(1, text = "");
    	};

    	const writable_props = ["todos"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TodoForm> was created with unknown prop '${key}'`);
    	});

    	function input_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(2, todoInput = $$value);
    		});
    	}

    	function input_input_handler() {
    		text = this.value;
    		$$invalidate(1, text);
    	}

    	$$self.$set = $$props => {
    		if ("todos" in $$props) $$invalidate(0, todos = $$props.todos);
    	};

    	$$self.$capture_state = () => {
    		return { todos, text, todoInput };
    	};

    	$$self.$inject_state = $$props => {
    		if ("todos" in $$props) $$invalidate(0, todos = $$props.todos);
    		if ("text" in $$props) $$invalidate(1, text = $$props.text);
    		if ("todoInput" in $$props) $$invalidate(2, todoInput = $$props.todoInput);
    	};

    	return [todos, text, todoInput, add, dispatch, input_binding, input_input_handler];
    }

    class TodoForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { todos: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TodoForm",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get todos() {
    		throw new Error("<TodoForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set todos(value) {
    		throw new Error("<TodoForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function flip(node, animation, params) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const scaleX = animation.from.width / node.clientWidth;
        const scaleY = animation.from.height / node.clientHeight;
        const dx = (animation.from.left - animation.to.left) / scaleX;
        const dy = (animation.from.top - animation.to.top) / scaleY;
        const d = Math.sqrt(dx * dx + dy * dy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(d) : duration,
            easing,
            css: (_t, u) => `transform: ${transform} translate(${u * dx}px, ${u * dy}px);`
        };
    }

    /* src/components/todos/TodoList.svelte generated by Svelte v3.17.1 */
    const file$1 = "src/components/todos/TodoList.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (37:0) {#if loading}
    function create_if_block_1(ctx) {
    	let div;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			p.textContent = "Loading...";
    			add_location(p, file$1, 38, 4, 1000);
    			attr_dev(div, "class", "h-32 flex justify-center items-center");
    			add_location(div, file$1, 37, 2, 944);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(37:0) {#if loading}",
    		ctx
    	});

    	return block;
    }

    // (59:6) {#if todo.details}
    function create_if_block(ctx) {
    	let p;
    	let t_value = /*todo*/ ctx[1].details + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "font-sans font-normal text-sm opacity-50 italic text-white");
    			add_location(p, file$1, 59, 8, 1645);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*todosInOrder*/ 4 && t_value !== (t_value = /*todo*/ ctx[1].details + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(59:6) {#if todo.details}",
    		ctx
    	});

    	return block;
    }

    // (49:0) {#each todosInOrder as todo (todo._id)}
    function create_each_block(key_1, ctx) {
    	let div2;
    	let div0;
    	let p;
    	let t0_value = /*todo*/ ctx[1].text + "";
    	let t0;
    	let p_class_value;
    	let t1;
    	let t2;
    	let div1;
    	let a0;
    	let img0;
    	let img0_src_value;
    	let a0_class_value;
    	let t3;
    	let a1;
    	let img1;
    	let img1_src_value;
    	let t4;
    	let rect;
    	let stop_animation = noop;
    	let dispose;
    	let if_block = /*todo*/ ctx[1].details && create_if_block(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			div1 = element("div");
    			a0 = element("a");
    			img0 = element("img");
    			t3 = space();
    			a1 = element("a");
    			img1 = element("img");
    			t4 = space();

    			attr_dev(p, "class", p_class_value = "" + ((/*todo*/ ctx[1].completed
    			? "line-through opacity-50"
    			: "") + " font-sans\n        font-normal text-lg text-white z-10"));

    			add_location(p, file$1, 53, 6, 1457);
    			attr_dev(div0, "class", "relative flex-1");
    			add_location(div0, file$1, 52, 4, 1421);
    			if (img0.src !== (img0_src_value = completeTodoImage)) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Pin todo");
    			attr_dev(img0, "class", "h-4 mx-2");
    			add_location(img0, file$1, 70, 8, 2051);
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "class", a0_class_value = "" + ((/*todo*/ ctx[1].completed ? "opacity-100" : "opacity-25") + " hover:opacity-100\n        transition-500 will-change-opacity"));
    			add_location(a0, file$1, 65, 6, 1848);
    			if (img1.src !== (img1_src_value = deleteTodoImage)) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Delete todo");
    			attr_dev(img1, "class", "h-4 mx-2");
    			add_location(img1, file$1, 76, 8, 2288);
    			attr_dev(a1, "href", "/");
    			attr_dev(a1, "class", "opacity-25 hover:opacity-100 transition-500 will-change-opacity");
    			add_location(a1, file$1, 72, 6, 2132);
    			attr_dev(div1, "class", "relative w-20 flex justify-center items-center");
    			add_location(div1, file$1, 64, 4, 1781);
    			attr_dev(div2, "class", "relative w-full flex items-center bg-black mb-2 relative z-0 p-3");
    			add_location(div2, file$1, 49, 2, 1285);
    			this.first = div2;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, p);
    			append_dev(p, t0);
    			append_dev(div0, t1);
    			if (if_block) if_block.m(div0, null);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, a0);
    			append_dev(a0, img0);
    			append_dev(div1, t3);
    			append_dev(div1, a1);
    			append_dev(a1, img1);
    			append_dev(div2, t4);

    			dispose = [
    				listen_dev(
    					a0,
    					"click",
    					prevent_default(function () {
    						if (is_function(/*complete*/ ctx[4](/*todo*/ ctx[1]))) /*complete*/ ctx[4](/*todo*/ ctx[1]).apply(this, arguments);
    					}),
    					false,
    					true,
    					false
    				),
    				listen_dev(
    					a1,
    					"click",
    					prevent_default(function () {
    						if (is_function(/*remove*/ ctx[3](/*todo*/ ctx[1]))) /*remove*/ ctx[3](/*todo*/ ctx[1]).apply(this, arguments);
    					}),
    					false,
    					true,
    					false
    				)
    			];
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*todosInOrder*/ 4 && t0_value !== (t0_value = /*todo*/ ctx[1].text + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*todosInOrder*/ 4 && p_class_value !== (p_class_value = "" + ((/*todo*/ ctx[1].completed
    			? "line-through opacity-50"
    			: "") + " font-sans\n        font-normal text-lg text-white z-10"))) {
    				attr_dev(p, "class", p_class_value);
    			}

    			if (/*todo*/ ctx[1].details) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*todosInOrder*/ 4 && a0_class_value !== (a0_class_value = "" + ((/*todo*/ ctx[1].completed ? "opacity-100" : "opacity-25") + " hover:opacity-100\n        transition-500 will-change-opacity"))) {
    				attr_dev(a0, "class", a0_class_value);
    			}
    		},
    		r: function measure() {
    			rect = div2.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(div2);
    			stop_animation();
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(div2, rect, flip, { delay: 150, duration: 400 });
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block) if_block.d();
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(49:0) {#each todosInOrder as todo (todo._id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let t;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let if_block = /*loading*/ ctx[0] && create_if_block_1(ctx);
    	let each_value = /*todosInOrder*/ ctx[2];
    	const get_key = ctx => /*todo*/ ctx[1]._id;

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*loading*/ ctx[0]) {
    				if (!if_block) {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			const each_value = /*todosInOrder*/ ctx[2];
    			for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    			each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, fix_and_destroy_block, create_each_block, each_1_anchor, get_each_context);
    			for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }
    const completeTodoImage = "images/check-purple-500.svg";
    const deleteTodoImage = "images/trash-purple-500.svg";

    function instance$1($$self, $$props, $$invalidate) {
    	let { loading = false } = $$props;
    	let { todos = [] } = $$props;
    	let { todo } = $$props;
    	const dispatch = createEventDispatcher();

    	const remove = todo => {
    		dispatch("remove", { id: todo._id });
    	};

    	const complete = todo => {
    		dispatch("complete", { id: todo._id, completed: true });
    	};

    	const writable_props = ["loading", "todos", "todo"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TodoList> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("loading" in $$props) $$invalidate(0, loading = $$props.loading);
    		if ("todos" in $$props) $$invalidate(5, todos = $$props.todos);
    		if ("todo" in $$props) $$invalidate(1, todo = $$props.todo);
    	};

    	$$self.$capture_state = () => {
    		return {
    			loading,
    			todos,
    			todo,
    			noTodos,
    			emptyTodos,
    			todosInOrder
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("loading" in $$props) $$invalidate(0, loading = $$props.loading);
    		if ("todos" in $$props) $$invalidate(5, todos = $$props.todos);
    		if ("todo" in $$props) $$invalidate(1, todo = $$props.todo);
    		if ("noTodos" in $$props) noTodos = $$props.noTodos;
    		if ("emptyTodos" in $$props) emptyTodos = $$props.emptyTodos;
    		if ("todosInOrder" in $$props) $$invalidate(2, todosInOrder = $$props.todosInOrder);
    	};

    	let noTodos;
    	let emptyTodos;
    	let todosInOrder;

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*todos*/ 32) {
    			 noTodos = todos.length === 0;
    		}

    		if ($$self.$$.dirty & /*todos, loading*/ 33) {
    			 emptyTodos = todos.length === 0 && !loading;
    		}

    		if ($$self.$$.dirty & /*todos*/ 32) {
    			 $$invalidate(2, todosInOrder = [
    				...todos.filter(t => t.state === "TODO_PINNED"),
    				...todos.filter(t => t.state !== "TODO_PINNED")
    			]);
    		}
    	};

    	return [loading, todo, todosInOrder, remove, complete, todos];
    }

    class TodoList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { loading: 0, todos: 5, todo: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TodoList",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*todo*/ ctx[1] === undefined && !("todo" in props)) {
    			console.warn("<TodoList> was created without expected prop 'todo'");
    		}
    	}

    	get loading() {
    		throw new Error("<TodoList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loading(value) {
    		throw new Error("<TodoList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get todos() {
    		throw new Error("<TodoList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set todos(value) {
    		throw new Error("<TodoList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get todo() {
    		throw new Error("<TodoList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set todo(value) {
    		throw new Error("<TodoList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/todos/Todos.svelte generated by Svelte v3.17.1 */
    const file$2 = "src/components/todos/Todos.svelte";

    function create_fragment$2(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let div5;
    	let div0;
    	let a0;
    	let t3;
    	let div2;
    	let a1;
    	let t5;
    	let div1;
    	let t6;
    	let t7;
    	let div4;
    	let a2;
    	let t9;
    	let div3;
    	let t10;
    	let t11;
    	let t12;
    	let current;

    	const todoform = new TodoForm({
    			props: { todos: /*todos*/ ctx[0] },
    			$$inline: true
    		});

    	todoform.$on("add", /*handleSubmit*/ ctx[4]);

    	const todolist = new TodoList({
    			props: {
    				todos: /*todos*/ ctx[0],
    				todo: /*todo*/ ctx[3]
    			},
    			$$inline: true
    		});

    	todolist.$on("remove", /*handleRemove*/ ctx[5]);
    	todolist.$on("complete", /*handleComplete*/ ctx[6]);

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Todo List with Svelte";
    			t1 = space();
    			div5 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			a0.textContent = "All";
    			t3 = space();
    			div2 = element("div");
    			a1 = element("a");
    			a1.textContent = "Active";
    			t5 = space();
    			div1 = element("div");
    			t6 = text(/*numActive*/ ctx[1]);
    			t7 = space();
    			div4 = element("div");
    			a2 = element("a");
    			a2.textContent = "Completed";
    			t9 = space();
    			div3 = element("div");
    			t10 = text(/*numCompleted*/ ctx[2]);
    			t11 = space();
    			create_component(todoform.$$.fragment);
    			t12 = space();
    			create_component(todolist.$$.fragment);
    			attr_dev(h1, "class", "text-center text-white mb-4 text-3xl font-sans font-extrabold");
    			add_location(h1, file$2, 89, 2, 2626);
    			attr_dev(a0, "class", "font-sans font-normal text-white hover:text-purple-500\n        hover:no-underline transition-500 opacity-25 hover:opacity-100\n        transition-opacity");
    			attr_dev(a0, "href", "#");
    			add_location(a0, file$2, 94, 6, 2807);
    			add_location(div0, file$2, 93, 4, 2795);
    			attr_dev(a1, "class", "font-sans font-normal text-white hover:text-purple-500\n        hover:no-underline transition-500 opacity-25 hover:opacity-100\n        transition:opacity");
    			attr_dev(a1, "href", "#");
    			add_location(a1, file$2, 103, 6, 3064);
    			attr_dev(div1, "class", "absolute top-0 right-0 bg-purple-500 text-white font-sans\n        font-extrabold text-xs w-5 h-5 flex justify-center items-center\n        rounded-full badge svelte-1ledkfl");
    			add_location(div1, file$2, 110, 6, 3286);
    			attr_dev(div2, "class", "relative");
    			add_location(div2, file$2, 102, 4, 3035);
    			attr_dev(a2, "class", "font-sans font-normal text-white hover:text-purple-500\n        hover:no-underline transition-500 opacity-25 hover:opacity-100\n        transition:opacity");
    			attr_dev(a2, "href", "#");
    			add_location(a2, file$2, 118, 6, 3542);
    			attr_dev(div3, "class", "absolute top-0 right-0 bg-purple-500 text-white font-sans\n        font-extrabold text-xs w-5 h-5 flex justify-center items-center\n        rounded-full badge svelte-1ledkfl");
    			add_location(div3, file$2, 125, 6, 3767);
    			attr_dev(div4, "class", "relative");
    			add_location(div4, file$2, 117, 4, 3513);
    			attr_dev(div5, "class", "flex mx-auto w-2/3 justify-between mb-5");
    			add_location(div5, file$2, 92, 2, 2737);
    			attr_dev(main, "class", "w-full max-w-xl mx-auto mt-32");
    			add_location(main, file$2, 88, 0, 2579);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			append_dev(main, div5);
    			append_dev(div5, div0);
    			append_dev(div0, a0);
    			append_dev(div5, t3);
    			append_dev(div5, div2);
    			append_dev(div2, a1);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			append_dev(div1, t6);
    			append_dev(div5, t7);
    			append_dev(div5, div4);
    			append_dev(div4, a2);
    			append_dev(div4, t9);
    			append_dev(div4, div3);
    			append_dev(div3, t10);
    			append_dev(main, t11);
    			mount_component(todoform, main, null);
    			append_dev(main, t12);
    			mount_component(todolist, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*numActive*/ 2) set_data_dev(t6, /*numActive*/ ctx[1]);
    			if (!current || dirty & /*numCompleted*/ 4) set_data_dev(t10, /*numCompleted*/ ctx[2]);
    			const todoform_changes = {};
    			if (dirty & /*todos*/ 1) todoform_changes.todos = /*todos*/ ctx[0];
    			todoform.$set(todoform_changes);
    			const todolist_changes = {};
    			if (dirty & /*todos*/ 1) todolist_changes.todos = /*todos*/ ctx[0];
    			todolist.$set(todolist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(todoform.$$.fragment, local);
    			transition_in(todolist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(todoform.$$.fragment, local);
    			transition_out(todolist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(todoform);
    			destroy_component(todolist);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let todo;
    	let todos = [];

    	onMount(async () => {
    		try {
    			const res = await fetch("http://localhost:8888/api/todos");
    			$$invalidate(0, todos = await res.json());
    			console.log(todos);
    		} catch(err) {
    			console.log("Sorry...could not find todos");
    		}
    	});

    	const handleSubmit = async event => {
    		let { text } = event.detail;
    		text.trim();
    		console.log(text);
    		if (!text) return;

    		const res = await fetch("http://localhost:8888/api/todos", {
    			method: "POST",
    			headers: { "Content-Type": "application/json" },
    			body: JSON.stringify({ text })
    		}).then(res => res.json()).then(data => console.log(data)).then(text => text = "").catch(err => console.log(err));

    		let newTodos = await fetch("http://localhost:8888/api/todos");
    		$$invalidate(0, todos = await newTodos.json());
    	};

    	const handleRemove = async event => {
    		const { id } = event.detail;

    		const res = await fetch(`http://localhost:8888/api/todos/${id}`, {
    			method: "DELETE",
    			headers: { "Content-Type": "application/json" }
    		}).then(res => console.log(res));

    		let newTodos = await fetch("http://localhost:8888/api/todos");
    		$$invalidate(0, todos = await newTodos.json());
    	};

    	const handleComplete = async event => {
    		const { id, completed } = event.detail;

    		const res = await fetch(`http://localhost:8888/api/todos/${id}`, {
    			method: "PATCH",
    			body: JSON.stringify({ completed }),
    			headers: { "Content-Type": "application/json" }
    		}).then(res => res.json()).then(data => console.log(data)).catch(err => console.log(err));

    		let updateToCompletedTodos = await fetch("http://localhost:8888/api/todos");
    		$$invalidate(0, todos = await updateToCompletedTodos.json());
    	};

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("todo" in $$props) $$invalidate(3, todo = $$props.todo);
    		if ("todos" in $$props) $$invalidate(0, todos = $$props.todos);
    		if ("numActive" in $$props) $$invalidate(1, numActive = $$props.numActive);
    		if ("numCompleted" in $$props) $$invalidate(2, numCompleted = $$props.numCompleted);
    	};

    	let numActive;
    	let numCompleted;

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*todos*/ 1) {
    			 $$invalidate(1, numActive = todos.filter(todo => !todo.completed).length);
    		}

    		if ($$self.$$.dirty & /*todos*/ 1) {
    			 $$invalidate(2, numCompleted = todos.filter(todo => todo.completed).length);
    		}
    	};

    	return [
    		todos,
    		numActive,
    		numCompleted,
    		todo,
    		handleSubmit,
    		handleRemove,
    		handleComplete
    	];
    }

    class Todos extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Todos",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    function getLocation(source) {
      return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial"
      };
    }

    function createHistory(source, options) {
      const listeners = [];
      let location = getLocation(source);

      return {
        get location() {
          return location;
        },

        listen(listener) {
          listeners.push(listener);

          const popstateListener = () => {
            location = getLocation(source);
            listener({ location, action: "POP" });
          };

          source.addEventListener("popstate", popstateListener);

          return () => {
            source.removeEventListener("popstate", popstateListener);

            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
          };
        },

        navigate(to, { state, replace = false } = {}) {
          state = { ...state, key: Date.now() + "" };
          // try...catch iOS Safari limits to 100 pushState calls
          try {
            if (replace) {
              source.history.replaceState(state, null, to);
            } else {
              source.history.pushState(state, null, to);
            }
          } catch (e) {
            source.location[replace ? "replace" : "assign"](to);
          }

          location = getLocation(source);
          listeners.forEach(listener => listener({ location, action: "PUSH" }));
        }
      };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
      let index = 0;
      const stack = [{ pathname: initialPathname, search: "" }];
      const states = [];

      return {
        get location() {
          return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
          get entries() {
            return stack;
          },
          get index() {
            return index;
          },
          get state() {
            return states[index];
          },
          pushState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            index++;
            stack.push({ pathname, search });
            states.push(state);
          },
          replaceState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            stack[index] = { pathname, search };
            states[index] = state;
          }
        }
      };
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = Boolean(
      typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
    );
    const globalHistory = createHistory(canUseDOM ? window : createMemorySource());

    /* src/App.svelte generated by Svelte v3.17.1 */

    function create_fragment$3(ctx) {
    	let current;
    	const todos = new Todos({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(todos.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(todos, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(todos.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(todos.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(todos, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { url = "" } = $$props;
    	const writable_props = ["url"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("url" in $$props) $$invalidate(0, url = $$props.url);
    	};

    	$$self.$capture_state = () => {
    		return { url };
    	};

    	$$self.$inject_state = $$props => {
    		if ("url" in $$props) $$invalidate(0, url = $$props.url);
    	};

    	return [url];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { url: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get url() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
      target: document.body,
      props: {}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
