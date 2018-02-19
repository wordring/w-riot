
/*
    w-riot
*/
(function (self) {
    var wordring = self.wordring || (self.wordring = {})

    function classes(el) {
        var fn = function () { }
        // の引数が配列あるいは文字列である必要がある。
        // 文字列は、空白文字で分割する。
        fn.array = function (val) {
            return typeof val == 'string' ? val.split(/\s+/) : val
        }
        // 引数が配列あるいは文字列である必要がある。
        // 文字列は、空白文字で分割する。
        fn.add = function (val) {
            el.classList.add.apply(el.classList, fn.array(val))
            return fn
        }
        // クラス名に val が含まれている場合、true を返す。
        fn.contains = function (val) {
            return el.classList.contains(val)
        }
        // val 内で最初に含まれるケラス名を返す。
        fn.find = function (val) {
            val = fn.array(val)
            for (var i = 0; i < val.length; i++) {
                if (fn.contains(val[i])) return val[i]
            }
            return ''
        }
        // 引数が配列あるいは文字列である必要がある。
        // 文字列は、空白文字で分割する。
        fn.remove = function (val) {
            val = fn.array(val)
            for (var i = 0; i < val.length; i++) {
                el.classList.remove(val[i])
            }
            // el.classList.remove.apply(el.classList, fn.array(val)) //ieで異常。
            return fn
        }
        return fn
    }

    function element(el) {
        if (typeof el == 'string') el = document.createElement(el)
        var fn = function () { }

        fn.root = el
        fn.classes = classes(el)
        fn.styles = el.style

        Object.defineProperty(fn, 'height', {
            get: function () {
                var rect = el.getBoundingClientRect()
                return rect.bottom - rect.top
            },
            set: function (val) {
                if (typeof val != 'string') val += 'px'
                el.style.height = val
            }
        })
        Object.defineProperty(fn, 'id', {
            get: function () { return el.id },
            set: function (val) { el.id = val }
        })
        Object.defineProperty(fn, 'width', {
            get: function () {
                var rect = el.getBoundingClientRect()
                return rect.right - rect.left
            },
            set: function (val) {
                if (typeof val != 'string') val += 'px'
                el.style.width = val
            }
        })

        fn.append = function (val) {
            el.appendChild(fn.element(val))
            return fn
        }

        fn.computedStyle = function (val) {
            val = val || ''
            return window.getComputedStyle(el, val)
        }

        fn.element = function (val) {
            var type = typeof val
            if (type == 'string') val = document.createElement(val)
            else if (type == 'function') val = val.root
            return val
        }

        /* CSSアニメーションの終了を監視し、callbackを呼び出す。 */
        fn.handleAnimationEnd = function (callback, timeout) {
            timeout = timeout || 500
            if (window.AnimationEvent) {
                var func = function (ev) {
                    if (ev.target == el) {
                        callback()
                        el.removeEventListener('animationend', func, false)
                    }
                }
                el.addEventListener('animationend', func, false)
            } else setTimeout(callback, timeout)
        }

        /*
        自身のサイズ変更の監視を開始する。
        */
        fn.handleResize = function (callback) {
            var width = 0
            var height = 0
            window.addEventListener('resize', $.throttle(300, function () {
                var w = fn.width
                var h = fn.height
                if (width != w || height != h) {
                    width = w
                    height = h
                    callback(fn)
                }
            }))
        }

        /* CSSTransitionの終了を監視し、callbackを呼び出す。 */
        fn.handleTransitionEnd = function (callback, timeout) {
            timeout = timeout || 500
            if (typeof el.style.transition != 'undefined') {
                var func = function (ev) {
                    if (ev.target == el) {
                        callback()
                        el.removeEventListener('transitionend', func, false)
                    }
                }
                el.addEventListener('transitionend', func, false)
            } else setTimeout(callback, timeout)
        }

        fn.on = function (name, callback, capture) {
            capture = capture || false // undefined の場合 false
            el.addEventListener(name, callback, capture)
            return fn
        }

        fn.off = function (name, callback, capture) {
            capture = capture || false // undefined の場合 false
            el.removeEventListener(name, callback, capture)
        }

        fn.prepend = function (val) {
            val = fn.element(val)
            if (el.firstChild) el.insertBefore(val, el.firstChild)
            else el.appendChild(val)
            return fn
        }

        return fn
    }

    var mask_ = element('div')
    window.addEventListener('load', function () {
        mask_.id = 'w-window-mask'
        element(document.body).prepend(mask_)
        //riot.observable(mask_)
    }, false)

    var window_ = {
        get height() { return document.documentElement.clientHeight },
        get width() { return document.documentElement.clientWidth },
        mask: {
            get depth() { return mask_.styles.zIndex },
            set depth(val) { mask_.styles.zIndex = val },

            get visible() { return mask_.classes.contains('active') },
            set visible(val) { val ? mask_.classes.add('active') : mask_.classes.remove('active') },

            off: function(name, callback, capture) { mask_.off(name, callback, capture) },
            on: function(name, callback, capture) { mask_.on(name, callback, capture) },

        },
    }

    var $ = wordring.$ = {
        assignObject: function (from) {
            var to = Object(from)
            for (var i = 1; i < arguments.length; i++) {
                var args = arguments[i]
                if (args !== undefined && args !== null) {
                    for (var key in args) {
                        if (Object.prototype.hasOwnProperty.call(args, key)) {
                            to[key] = args[key]
                        }
                    }
                }
            }
            return to
        },
        element: element,
        throttle: function (interval, callback) {
            var last = 0
            var id = 0

            return function () {
                var self = this
                var args = arguments

                var now = Date.now()

                function exec() {
                    last = +now; // 参照を切るために⁺する
                    callback.apply(self, args)
                    id = 0
                }

                if (!last) exec()
                else {
                    var diff = now - last
                    if (interval < diff) exec()
                    else if (!id) id = setTimeout(exec, interval)
                }
            }
        },
        toArrayFromArguments: function (arg) {
            return arg.length === 1 ? [arg[0]] : Array.apply(null, arg)
        },
        toCamelCase: function (str) {
            str = str || ''
            return str.replace(/-./g, function (ch) { return ch.charAt(1).toUpperCase() })
        },
        toKebabCase: function (str) {
            str = str || ''
            return str.replace(/([A-Z])/g, function (ch) { return '-' + ch.charAt(0).toLowerCase() })
        },
        window: window_,
    }


    // data-mixin の初期化。
    function initDataMixin(tag) {
        if (!tag.opts.dataMixin) return
        var mixins = tag.opts.dataMixin.split(/[\s]+/g)
        for (var i = 0; i < mixins.length; i++) {
            tag.mixin(mixins[i])
        }
    }

    function findObserver(tag) {
        if (typeof tag.opts.dataObserver == 'string') return tag[tag.opts.dataObserver]
        if (tag.opts.dataObserver) return tag.opts.dataObserver
        return tag.observer
    }

    // data-on の初期化。
    function initDataOn(tag) {
        var observer = findObserver(tag)
        if (tag.opts.dataOn && observer) {
            var listeners = tag.opts.dataOn.split(/[\s]+/g)
            for (var i = 0; i < listeners.length; i++) {
                var tmp = listeners[i].split(/[\s]*:[\s]*/)

                var fn = function (to) {
                    return function () {
                        var args = $.toArrayFromArguments(arguments)
                        tag.trigger.apply(null, Array.prototype.concat(to, args))
                    }
                }

                observer.on(tmp[0], fn(tmp[1]))
            }
        }
    }

    // data-trigger の初期化。
    function initDataTrigger(tag) {
        var observer = findObserver(tag)
        if (tag.opts.dataTrigger && observer) {
            var triggers = tag.opts.dataTrigger.split(/[\s]+/g)
            for (i = 0; i < triggers.length; i++) {
                var tmp = triggers[i].split(/[\s]*:[\s]*/)
                var tagTrigger = tmp[0]
                var observerTrigger = tmp[1]
                observerTrigger = observerTrigger || tagTrigger

                var fn = function (to) {
                    return function () {
                        var args = $.toArrayFromArguments(arguments)
                        observer.trigger.apply(null, Array.prototype.concat(to, args))
                    }
                }

                var callback = fn(observerTrigger)

                tag.on(tagTrigger, callback)
                tag.on('unmount', function () { observer.off(observerTrigger, callback) })
            }
        }
    }

    var clickable = function (tag) {
        var el = $.element(tag.root)

        var onClick = function (ev) {
            if (tag.disabled) return
            tag.trigger('clicked', tag)
        }
        el.on('click', onClick)
    }

    wordring.button = {
        init: function () {
            clickable(this)
            $.element(this.root).classes.add('button')
        },
    }
    riot.mixin('button', wordring.button)

    wordring.clickable = {
        init: function () {
            clickable(this)
        },
    }
    riot.mixin('clickable', wordring.clickable)

    wordring.component = {
        $: $,
        init: function () {
            var tag = this

            var el = tag.root

            Object.defineProperty(
                this,
                'id', {
                    get: function () { return tag.root.id },
                    set: function (val) { tag.root.id = val }
                }
            )
            initDataTrigger(tag)
            initDataOn(tag)
            initDataMixin(tag)

            tag.on('mount', function () {
                if (!tag.init || (tag.init && !tag.init())) tag.trigger('created', tag)
            })
        },
        id: function () { return this.root.id },
        property: function (name, getter, setter) {
            Object.defineProperty(this, name, { get: getter, set: setter })
        },
    }
    riot.mixin('component', wordring.component)

    wordring.link = {
        init: function () {
            var tag = this
            var el = $.element(tag.root)
            el.classes.add('link')
            el.on('click', function () { route(tag.opts.dataRoute) })
        },
    }
    riot.mixin('link', wordring.link)

    wordring.ripple = {
        init: function () {
            var tag = this

            var effect = $.element('w-ripple-effect')
            var ripple = $.element('w-ripple-container').append(effect)
            var el = $.element(tag.root).prepend(ripple)

            var onAnimationEnd = function () { ripple.classes.remove('active') }

            var onMousedown = function (ev) {
                var h = ripple.height = el.height
                var w = ripple.width = el.width
                var dx = Math.max(h, w) * 2
                effect.height = effect.width = dx
                var rect = ev.currentTarget.getBoundingClientRect()
                var x = ev.clientX - rect.left
                var y = ev.clientY - rect.top
                effect.root.style.left = (x - dx / 2) + 'px'
                effect.root.style.top = (y - dx / 2) + 'px'

                effect.root.style.backgroundColor = tag.opts.dataRippleColor || getComputedStyle(el.root, '').color

                effect.handleAnimationEnd(onAnimationEnd, 500)
                ripple.classes.add('active')
            }

            el.on('click', onMousedown)
        },
    }
    riot.mixin('ripple', wordring.ripple)

})(this);
