
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
        fn.find = function(val) {
            val = fn.array(val)
            for(var i = 0; i < val.length; i++) {
                if(fn.contains(val[i])) return val[i]
            }
            return ''
        }
        // 引数が配列あるいは文字列である必要がある。
        // 文字列は、空白文字で分割する。
        fn.remove = function (val) {
            val = fn.array(val)
           for(var i = 0; i < val.length; i++) {
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
                    if(ev.target == el) {
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
                    if(ev.target == el) { 
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
    }

    // data-mixin の初期化。
    function initDataMixin(tag) {
        if (!tag.opts.dataMixin) return
        var mixins = tag.opts.dataMixin.split(/[\s]+/g)
        for (var i = 0; i < mixins.length; i++) {
            tag.mixin(mixins[i])
        }
    }

    // data-on の初期化。
    function initDataOn(tag) {
        var observer = tag.opts.observer || tag.observer

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
        var observer = tag.opts.observer || tag.observer

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

    var clickable = function(tag) {
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
                'id',
                {
                    get: function() { return tag.root.id },
                    set: function(val) { tag.root.id = val }
                }
            )
            initDataTrigger(tag)
            initDataOn(tag)
            initDataMixin(tag)

            tag.on('mount', function() {
                var manage = false
                if(tag.init) manage = tag.init()
                if(!manage) tag.trigger('created', tag)
            })
        },
        id: function() { return this.root.id },
        property: function (name, getter, setter) {
            Object.defineProperty(this, name, { get: getter, set: setter })
        },
    }
    riot.mixin('component', wordring.component)

    wordring.link = {
        init: function() {
            var tag = this
            var el = $.element(tag.root)
            el.classes.add('link')
            el.on('click', function() { route(tag.opts.dataRoute) })
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

riot.tag2('w-component', '<yield></yield>', '', '', function(opts) {
    this.mixin('component')
});
riot.tag2('w-app', '<yield></yield>', '', '', function(opts) {
    var tag = this
    var $ = tag.$
    var el = tag.root
});

riot.tag2('w-header', '<yield></yield>', '', '', function(opts) {
    this.mixin('component')

    var tag = this

    var $ = tag.$
    var el = $.element(tag.root)

    tag.property(
        'height',
        function() { return el.height },
        function(val) { el.height = val })

});
riot.tag2('w-icon', '<yield></yield>', '', '', function(opts) {
    this.mixin('component')

    var tag = this

    var $ = tag.$
    var el = $.element(tag.root)

    tag.property(
        'value',
        function() { return tag.root.innerText },
        function(val) { tag.root.innerText = val }
    )

    tag.property(
        'visible',
        function() { return el.styles.display != 'none' },
        function(val) { el.styles.display = val ? '' : 'none' }
    )

    function init() {}
});
riot.tag2('w-drawer', '<w-panel observer="{this}" data-trigger="created:panel-created"> <yield></yield> </w-panel>', '', '', function(opts) {
    this.mixin('component')

    var tag = this

    var panel = null

    var $ = tag.$
    var doc = $.element(document.body)
    var el = $.element(tag.root)

    var variants = ['temporary', 'persistent']
    var anchors = ['left', 'right']

    doc.styles.overflowX = 'hidden'
    doc.styles.height = '100%'

    tag.property(
        'anchor',
        function() { return el.classes.find(anchors) },
        function(val) {
            el.classes.remove(anchors).add(val)
            panel.anchor = val
        }
    )

    tag.property(
        'contentPane',
        function() { return panel.tags['w-pane'] },
        function(opts) {
    })

    tag.property(
        'header',
        function() { return panel.tags['w-header'] },
        function(opts) {
    })

    tag.property(
        'height',
        function() { return el.height },
        function(val) {
            el.height = val
            panel.height = val
        }
    )

    tag.property(
        'variant',
        function() { return el.classes.find(variants) },
        function(val) {
            el.classes.remove(variants).add(val)
            el.styles.minWidth = tag.width || ''
        }
    )

    tag.property(
        'visible',
        function() { return !el.classes.contains('close') },
        function(val) {
            val ? tag.open() : tag.close()
            el.classes.add(val ? 'open' : 'close')
        }
    )

    tag.property(
        'width',
        function() { return panel.width },
        function(val) {
            el.styles.width = el.styles.minWidth = el.maxWidth = panel.width = val }
    )

    this.close = function() {
        panel.close()
        el.styles.minWidth = ''
        el.classes.remove('open')
    }.bind(this)

    this.open = function() {
        panel.open()
        el.classes.remove('close')
    }.bind(this)

    this.toggle = function() { tag.visible ? tag.close() : tag.open() }.bind(this)

    this.init = function() {
        return true
    }.bind(this)

    this.onPanelClosed = function() {
        el.classes.add('close')
        tag.trigger('closed', tag)
        tag.handleResize()
    }.bind(this)

    this.onPanelOpend = function() {
        el.classes.add('open')
        el.styles.minWidth = tag.width + 'px'
        tag.trigger('opened', tag)
        tag.handleResize()
    }.bind(this)

    this.handleResize = function() {
        var header = tag.header
        var contentPane = tag.contentPane
        if(contentPane) contentPane.height = doc.height - (header ? header.height : 0)
    }.bind(this)
    el.handleResize(tag.handleResize)

    tag.on('panel-created', function(val) {
        panel = val
        panel.on('closed', tag.onPanelClosed)
        panel.on('opened', tag.onPanelOpend)

        tag.anchor = tag.anchor || 'left'
        tag.variant = tag.variant || 'temporary'

        var style = el.computedStyle()
        el.styles.display = 'block'

        panel.backgroundColor = style.backgroundColor
        el.styles.backgroundColor = 'transparent'

        tag.width = style.width

        tag.visible = style.display == 'none' ? false : true
        tag.handleResize()

        tag.trigger('created', tag)
    })

});

riot.tag2('w-item', '', '', '', function(opts) {
    this.mixin('component')
});
riot.tag2('w-pane', '<yield></yield>', '', '', function(opts) {
    this.mixin('component')

    var tag = this

    var $ = tag.$
    var el = $.element(tag.root)

    tag.property(
        'height',
        function() { return el.height },
        function(val) { el.height = val }
    )

    tag.property(
        'width',
        function() { return el.width },
        function(val) { el.width = val }
    )

});
riot.tag2('w-panel', '<div ref="holder"> <yield></yield> </div>', '', '', function(opts) {
    this.mixin('component')

    var tag = this
    var $ = tag.$
    var el = null
    var holder = null

    var anchors = ['anchor-left', 'anchor-right', 'anchor-top', 'anchor-bottom']

    tag.property(
        'anchor',
        function() { return el.classes.find(anchors).replace(/^anchor-/, '') },
        function(val) { if(val) el.classes.remove(anchors).add('anchor-' + val) }
    )

    tag.property(
        'animation',
        function() { return holder.classes.contains('animation') },
        function(val) { val ? holder.classes.add('animation') : holder.classes.remove('animation') }
    )

    tag.property(
        'backgroundColor',
        function() { return holder.styles.backgroundColor },
        function(val) { holder.styles.backgroundColor = val }
    )

    tag.property(
        'height',
        function() { return holder.height },
        function(val) { holder.height = val }
    )

    tag.property(
        'transition',
        function() { return el.classes.contains('transition') },
        function(val) { val ? el.classes.add('transition') : el.classes.remove('transition') }
    )

    tag.property(
        'visible',
        function() { return !el.classes.contains('close') },
        function(val) { val ? tag.open() : tag.close() }
    )

    tag.property(
        'width',
        function() { return holder.width },
        function(val) { holder.width = val }
    )

    this.close = function() {
        if(tag.transition || !tag.visible) return
        tag.transition = true
        el.classes.add('close')

        function fn() {
            tag.transition = false
            holder.styles.position = 'absolute'
            tag.trigger('closed', tag)
        }
        tag.animation ? holder.handleTransitionEnd(fn) : fn()
    }.bind(this)

    this.open = function() {
        if(tag.transition || tag.visible) return

        tag.transition = true
        holder.styles.position = ''
        el.classes.remove('close')

        function fn() {
            tag.transition = false
            tag.trigger('opened', tag)
        }
        tag.animation ? holder.handleTransitionEnd(fn) : fn()
    }.bind(this)

    this.toggle = function() {
        tag.visible = !tag.visible
    }.bind(this)

    this.init = function() {
        el = $.element(tag.root)
        holder = $.element(tag.refs.holder)
        if(el.styles.display == 'none') {
            tag.close()
            el.styles.display = ''
        }
        holder.classes.add('animation')
        tag.anchor = tag.opts.dataAnchor || (tag.anchor || 'top')
    }.bind(this)
});
riot.tag2('w-switch', '<div ref="track"></div> <div ref="container" data-mixin="ripple" onclick="{onClick}"> <div ref="thumb"></div> </div>', '', '', function(opts) {
    this.mixin('component')

    var tag = this
    var container = null

    var $ = tag.$
    var el = $.element(tag.root)
    var track = null
    var thumb = null

    tag.property(
        'checked',
        function() { return el.classes.contains('checked') },
        function(val) {
            el.handleTransitionEnd(tag.handleTransitionEnd)
            tag.transition = true
            if(val) el.classes.add('checked')
            else el.classes.remove('checked')
            tag.color = tag.color
    })

    tag.property(
        'color',
        function() {
            var style = el.computedStyle()
            return tag.disabled ? '' : (tag.checked ? (style.color || '') : '')
        },
        function(val) { track.styles.backgroundColor = thumb.styles.backgroundColor = val }
    )

    tag.property(
        'disabled',
        function () { return el.classes.contains('disabled') },
        function (val) {
            if(val) el.classes.add('disabled')
            else {
                el.classes.remove('disabled')
                tag.color = tag.color
            }
    })

    tag.property(
        'transition',
        function() { return el.classes.contains('animation') },
        function(val) {
            if(val) el.classes.add('animation')
            else el.classes.remove('animation')
    })

    this.toggle = function() {
        if(!tag.disabled) tag.checked = !tag.checked
    }.bind(this)

    this.handleTransitionEnd = function() {
        tag.transition = false
    }.bind(this)

    this.onClick = function(ev) {
        tag.toggle()
        tag.trigger('clicked')
    }.bind(this)

    this.init = function() {
        container = riot.mount(tag.refs.container, 'w-component')[0]
        track = $.element(tag.refs.track)
        thumb = $.element(container.refs.thumb)
        tag.color = tag.color
    }.bind(this)

});
riot.tag2('w-button', '<yield></yield>', '', '', function(opts) {
    this.mixin('component')
    this.mixin('button')
    this.mixin('ripple')
});