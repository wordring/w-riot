
/*
    w-riot
*/
(function (self) {
    var wordring = self.wordring || (self.wordring = {})

    Object.assign = function () { throw 'Object.assign' }

    var $ = wordring.$ = {
        addClass: function (el, classes) {
            classes = classes.split(/\s+/)

            for (var i = 0; i < classes.length; i++) {
                className = classes[i]
                if (el.classList) el.classList.add(className)
                else {
                    var re = new RegExp('(\\s|^)' + className + '(\\s|$)')
                    if (!re.test(el.className)) el.className += ' ' + className
                }
            }
        },
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
        defineProperty: function(tag, name, getter, setter) {
            Object.defineProperty(tag, name, {
                get: function() { return getter ? getter() : null },
                set: function(val) { if(setter) setter(val) },
            })
        },
        device: function () {
            var width = $.width(document.documentElement)
            if (width < 480) return 'phone'
            if (width < 840) return 'tablet'
            if (width <= 1024) return 'desktop'
            return ''
        },
        /* CSSアニメーションの終了を監視し、callbackを呼び出す。 */
        handleAnimationEnd: function (el, callback) {
            if (window.AnimationEvent) {
                var fn = function () {
                    callback()
                    el.removeEventListener('animationend', fn, false)
                }
                el.addEventListener('animationend', fn, false)
            } else {
                setTimeout(callback, 500)
            }
        },
        /*
        自身のサイズ変更の監視を開始する。
        変更された場合、'resize'をtriggerする。
        */
        handleResize: function (tag) {
            var width = 0
            var height = 0
            window.addEventListener('resize', $.throttle(300, function () {
                var el = tag.root
                var w = $.width(el)
                var h = $.height(el)
                if (width != w || height != h) {
                    width = w
                    height = h
                    tag.trigger('resize', width, height)
                }
            }))
        },
        /* CSSTransitionの終了を監視し、callbackを呼び出す。 */
        handleTransitionEnd: function (el, callback) {
            if (typeof el.style.transition != 'undefined') {
                var fn = function () {
                    callback()
                    el.removeEventListener('transitionend', fn, false)
                }
                el.addEventListener('transitionend', fn, false)
            } else {
                setTimeout(callback, 500)
            }
        },
        hasClass: function (el, className) {
            if (el.classList) {
                return el.classList.contains(className)
            }
            var re = new RegExp('(\\s|^)' + className + '(\\s|$)')
            return re.test(el.className)
        },
        removeClass: function (el, classes) {
            classes = classes.split(/\s+/)

            for (var i = 0; i < classes.length; i++) {
                className = classes[i]

                if (el.classList) {
                    el.classList.remove(className);
                } else {
                    var re = new RegExp('(\\s|^)' + className + '(\\s|$)');
                    el.className = el.className.replace(re, ' ');
                }
            }
        },
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
        left: function (el, val) {
            if (typeof val != 'undefined') {
                if (/[-]*[0-9]+$/.test(val)) val += 'px'
                el.style.left = val
            }
            var rect = el.getBoundingClientRect()
            return rect.left
        },
        right: function (el, val) {
            if (typeof val != 'undefined') {
                if (/[-]*[0-9]+$/.test(val)) val += 'px'
                el.style.right = val
            }
            var rect = el.getBoundingClientRect()
            return rect.right
        },
        height: function (el, h) {
            if (typeof h != 'undefined') {
                if (typeof h != 'string') h = h + 'px'
                el.style.height = h
                return
            }
            var rect = el.getBoundingClientRect()
            return rect.bottom - rect.top
        },
        actualSize: function (base, val) {
            if (/px$/.test(val)) return +val.replace(/px$/, '')
            if (/%$/.test(val)) return (base / 100) * (+val.replace(/%$/, ''))
            return +val
        },
        actualWidth: function (el, w) {
            el = el || document.documentElement
            var pw = $.width(el)
            return $.actualSize(pw, w)
        },
        width: function (el, w) {
            if (typeof w != 'undefined') {
                if (typeof w != 'string') w = w + 'px'
                el.style.width = w
                return
            }
            var rect = el.getBoundingClientRect()
            return rect.right - rect.left
        },
    }

    // Component data-trigger の初期化。
    function initDataTrigger(tag) {
        var observer = tag[tag.opts.dataObserver || 'observer']

        if (tag.opts.dataTrigger && observer) {
            var triggers = tag.opts.dataTrigger.split(/[\s]+/g)
            for (i = 0; i < triggers.length; i++) {
                var tmp = triggers[i].split(/[\s]*:[\s]*/)

                var fn = function (to) {
                    return function () {
                        var args = $.toArrayFromArguments(arguments)
                        observer.trigger.apply(null, Array.prototype.concat(to, args))
                    }
                }

                var from = tmp[0]
                var to = fn(tmp[1])
                tag.on(from, to)
                tag.on('unmount', function () { tag.off(tmp[1], to) })
            }
        }
    }

    // Component data-on の初期化。
    function initDataOn(tag) {
        var observer = tag[tag.opts.dataObserver || 'observer']

        if (tag.opts.dataOn && observer) {
            var listeners = tag.opts.dataOn.split(/[\s]+/g)
            for (i = 0; i < listeners.length; i++) {
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

    /*
    Containerより先にmixinする必要がある。
    */
    wordring.Component = {
        init: function () {
            var self = this

            this.on('mount', function () { self.trigger('created', self) })
            this.on('unmount', function () { self.trigger('deleted', self) })

            initDataTrigger(this)
            initDataOn(this)
        },
        wordring: $,
    }
})(this);
