
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
        fn.handleResize = function (callback, wait) {
            wait = wait || 300
            var width = 0
            var height = 0
            window.addEventListener('resize', $.throttle(wait, function () {
                var w = fn.width
                var h = fn.height
                if (width != w || height != h) {
                    callback(w - height, w - width)
                    width = w
                    height = h
                }
            }))
        }

        /* CSSTransitionの終了を監視し、callbackを呼び出す。 */
        fn.handleTransitionEnd = function (callback, timeout) {
            timeout = timeout || 500
            if (typeof el.style.transition != 'undefined') {
                var func = function (ev) {
                    if (ev.target == el) {
                        //callback()
                        el.removeEventListener('transitionend', func, false)
                        callback()
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

    var $ = wordring.$ = {
        group: {},
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

    // data-group の初期化。
    function initDataGroup(tag) {
        if (!tag.opts.dataGroup) return
        var group = $.group[tag.opts.dataGroup]
        if (!group) {
            group = function () { }
            group.id = tag.opts.dataGroup
            riot.observable(group)
            $.group[tag.opts.dataGroup] = group
        }
        group.add = function (name, callback) {
            group.on(name, callback)
            tag.on('unmount', function () { group.off(name, callback) })
        }
        tag.group = group
    }

    var clickable = function (tag) {
        var el = $.element(tag.root)

        var onClick = function (ev) {
            if (tag.disabled) return
            tag.trigger('click', tag)
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

            this.property(
                'id',
                function () { return tag.root.id },
                function (val) { tag.root.id = val }
            )

            initDataTrigger(tag)
            initDataOn(tag)
            initDataMixin(tag)
            initDataGroup(tag)

            var mount = function () {
                var mounted = function () {
                    if (tag.mounted) tag.mounted()
                    tag.trigger('mounted', tag)
                    tag.off('mount', mount)
                }

                var creating = tag.children().filter(function (val) { return val.$ })
                if (creating.length == 0) mounted()
                for (var i = 0; i < creating.length; i++) {
                    creating[i].on('mounted', function (child) {
                        creating = creating.filter(function (val) { return child != val })
                        if (creating.length == 0) mounted()
                    })
                }
            }
            tag.on('mount', mount)
        },
        children: function () {
            var tag = this
            var result = []
            var tags = Object.keys(tag.tags).map(function (key) { return tag.tags[key] })
            for (var i = 0; i < tags.length; i++) {
                Array.prototype.push.apply(result, Array.isArray(tags[i]) ? tags[i] : [tags[i]])
            }
            return result
        },
        property: function (name, getter, setter) {
            if (this.hasOwnProperty(name)) return
            val = { get: getter }
            if (setter) val.set = setter
            Object.defineProperty(this, name, val)
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

    wordring.modal = {
        modal: null,
        init: function () {
            var tag = this

            var el = $.element(tag.root)
            var modal = $.element('div')
            $.element(document.body).prepend(modal)
            tag.modal = riot.mount(modal.root, 'w-modal')[0]
        }
    }
    riot.mixin('modal', wordring.modal)

    wordring.ripple = {
        init: function () {
            var tag = this

            var effect = $.element('w-ripple-effect')
            var ripple = $.element('w-ripple').prepend(effect)
            var el = $.element(tag.root).prepend(ripple)

            var onAnimationEnd = function () {
                ripple.classes.remove('active')
                ripple.styles.height = ripple.styles.maxWidth = '0px'
            }

            var onClick = function (ev) {
                var h = el.height
                var w = el.width
                ripple.styles.height = h + 'px'
                ripple.styles.maxWidth = w + 'px'
                var dx = Math.max(h, w) * 2
                effect.height = effect.width = dx
                var rect = ev.currentTarget.getBoundingClientRect()
                var x = ev.clientX - rect.left
                var y = ev.clientY - rect.top
                effect.root.style.left = (x - dx / 2) + 'px'
                effect.root.style.top = (y - dx / 2) + 'px'

                ripple.classes.add('active')
                effect.root.style.backgroundColor = tag.opts.dataRippleColor || getComputedStyle(el.root, '').color
                effect.handleAnimationEnd(onAnimationEnd, 500)
            }

            el.on('click', onClick)
        },
    }
    riot.mixin('ripple', wordring.ripple)

})(this);

riot.tag2('w-button', '<yield></yield>', '', '', function(opts) {
    this.mixin('component')
    this.mixin('button')
    this.mixin('ripple')

    var tag = this
});
riot.tag2('w-component', '<yield></yield>', '', '', function(opts) {
    this.mixin('component')
});
riot.tag2('w-checkbox', '<w-icon data-value="{face}"></w-icon>', '', 'onclick="{onClick}"', function(opts) {
    this.mixin('component')
    this.mixin('ripple')

    var tag = this

    var $ = tag.$
    var el = $.element(tag.root)

    tag.property(
        'checked',
        function() { return el.classes.contains('checked') },
        function(val) {
            val ? el.classes.add('checked') : el.classes.remove('checked')
            tag.update()
            tag.trigger('change', tag)
        }
    )

    tag.property(
        'color',
        function() {
            var style = el.computedStyle()
            return tag.disabled ? '' : (tag.checked ? (style.color || '') : '')
        },
        function(val) {
            el.styles.backgroundColor = val
            tag.update()
        }
    )

    tag.property(
        'disabled',
        function () { return el.classes.contains('disabled') },
        function (val) {
            val ? el.classes.add('disabled') : el.classes.remove('disabled')
            tag.update()
        }
    )

    tag.property(
        'face',
        function () { return tag.checked ? 'check_box' : 'check_box_outline_blank' }
    )

    this.toggle = function() { if(!tag.disabled) tag.checked = !tag.checked }.bind(this)

    this.onClick = function(ev) {
        tag.toggle()
        tag.trigger('click')
    }.bind(this)

    this.mounted = function() {
        tag.checked = tag.checked
    }.bind(this)

});
riot.tag2('w-drawer-holder', '', '', '', function(opts) {
    this.mixin('component')

    var tag = this

    var $ = tag.$
    var el = $.element(tag.root)

    this.width = function() { return el.width }.bind(this)

    var update = function() {
        if(tag.opts.anchor == 'left') {
            el.styles.left = tag.opts.visible ? '0px' : -el.width + 'px'
            el.styles.display = tag.opts.display
        } else {
            el.styles.right = tag.opts.visible ? '0px' : -el.width + 'px'
            el.styles.display = tag.opts.display
        }
    }

    this.mounted = function() { update() }.bind(this)
    tag.on('update', update)
});

riot.tag2('w-drawer', '<w-drawer-holder ref="holder" anchor="{anchor}" display="{display}" variant="{variant}" visible="{visible}"> <yield></yield> </w-drawer-holder>', '', '', function(opts) {
    this.mixin('component')
    this.mixin('modal')

    var tag = this
    var holder = null

    var $ = tag.$
    var el = $.element(tag.root)

    var anchors = ['left', 'right']
    var persistents = ['temporary', 'persistent']

    tag.property(
        'anchor',
        function() { return el.classes.contains('right') ? 'right' : 'left' }
    )

    tag.property(
        'animation',
        function() { return tag.display && el.classes.contains('animation') },
        function(val) { val ? el.classes.add('animation') : el.classes.remove('animation') }
    )

    tag.property(
        'display',
        function() { return el.computedStyle().display }
    )

    tag.property(
        'header',
        function() {
            var result = tag.tags['w-drawer-holder'].tags['w-header']
            result = Array.isArray(result) ? result[0] : result
            return result
        }
    )

    tag.property(
        'pane',
        function() {
            var result = tag.tags['w-drawer-holder'].tags['w-pane']
            return Array.isArray(result) ? result[0] : result
        }
    )

    tag.property(
        'priority',
        function() {
            if(el.classes.contains('primary')) return 'primary'
            if(el.classes.contains('secondary')) return 'secondary'
            return ''
        }
    )

    tag.property(
        'variant',
        function() { return el.classes.contains('temporary') ? 'temporary' : 'persistent' },
        function(val) {
            if(tag.variant == val) return

            el.classes.remove(persistents).add(val)

            if(val == 'temporary' && tag.visible) tag.modal.visible = true
            else tag.modal.visible = false

            tag.update()
            tag.trigger('variant', tag, val)
        }
    )

    tag.property(
        'visible',
        function() { return !el.classes.contains('close') },
        function(val) {
            if(tag.visible == val) return

            val ? el.classes.remove('close') : el.classes.add('close')

            if(val && tag.variant == 'temporary') tag.modal.visible = true
            if(!val) tag.modal.visible = false

            tag.update()
            tag.trigger('visible', tag, val)
        }
    )

    tag.property(
        'width',
        function() { return tag.variant == 'temporary' ? 0 : (tag.visible ? holder.width() : 0) },
        function(val) {
            el.width = val
            tag.update()
        }
    )

    this.toggle = function() { tag.visible = !tag.visible }.bind(this)

    var update = function() {
        el.styles.minWidth = (tag.visible && tag.variant == 'persistent') ? holder.width() + 'px' : '0px'
        el.styles.width = el.styles.minWidth

        if(tag.header && tag.pane) tag.pane.height = el.height - tag.header.height
    }

    tag.on('mount', function() {
        holder = tag.refs.holder

        if(tag.display == 'none') tag.visible = false
        el.styles.display = 'block'

        tag.update()
    })

    tag.on('update', update)

    el.handleResize(update)

    tag.modal.on('click', function() { tag.visible = false })
});
riot.tag2('w-footer', '<yield></yield>', '', '', function(opts) {
    this.mixin('component')
});
riot.tag2('w-header', '<yield></yield>', '', '', function(opts) {
    this.mixin('component')

    var tag = this

    var $ = tag.$
    var el = $.element(tag.root)

    tag.property(
        'animation',
        function() { return el.classes.contains('animation') },
        function(val) { val ? el.classes.add('animation') : el.classes.remove('animation') }
    )

    tag.property(
        'height',
        function() { return el.height },
        function(val) { el.height = val }
    )

    tag.property(
        'inset',
        function() {
            return {
                left: el.styles.paddingLeft,　right: el.styles.paddingRight,
                top: el.styles.paddingTop,　bottom: el.styles.paddingBottom
            }
        },
        function(val) { for(var key in val) { el.styles['padding-' + key] = val[key] }
        }
    )

    tag.property(
        'margin',
        function() {
            return {
                left: el.styles.marginLeft,　right: el.styles.marginRight,
                top: el.styles.marginTop,　bottom: el.styles.marginBottom
            }
        },
        function(val) { for(var key in val) { el.styles['margin-' + key] = val[key] } }
    )

    tag.property(
        'position',
        function() { return el.computedStyle().position },
        function(val) { el.styles.position = val }
    )

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

    tag.on('update', function() { if(tag.opts.dataValue) tag.value = tag.opts.dataValue })
    tag.on('mount', function() { if(tag.opts.dataValue) tag.value = tag.opts.dataValue })
});
riot.tag2('w-list', '<yield></yield>', '', '', function(opts) {
    this.mixin('component')
});
riot.tag2('w-item', '', '', '', function(opts) {
    this.mixin('component')
});
riot.tag2('w-panel', '<div ref="holder"> <yield></yield> </div>', '', '', function(opts) {
    this.mixin('component')

    var tag = this
    var $ = tag.$
    var el = $.element(tag.root)
    var holder = null

    var anchors = ['anchor-left', 'anchor-right', 'anchor-top', 'anchor-bottom']

    tag.property(
        'anchor',
        function() { return el.classes.find(anchors).replace(/^anchor-/, '') },
        function(val) {
            if(!tag.visible) throw new Error
            if(val) el.classes.remove(anchors).add('anchor-' + val)
        }
    )

    tag.property(
        'animation',
        function() { return el.classes.contains('animation') },
        function(val) { val ? el.classes.add('animation') : el.classes.remove('animation') }
    )

    tag.property(
        'backgroundColor',
        function() { return holder.styles.backgroundColor },
        function(val) { holder.styles.backgroundColor = val }
    )

    tag.property(
        'direction',
        function() {
            var anchor = tag.anchor
            if(anchor == 'top' || anchor == 'bottom') return 'vertical'
            return 'horizontal'
        },
        function() { throw new TypeError }
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
        function() { return el.width },
        function(val) { holder.width = val }
    )

    this.close = function() {
        if(tag.transition || !tag.visible) return
        tag.transition = true
        var animation = tag.animation

        if(tag.direction == 'vertical') {
            el.styles.maxHeight = el.height + 'px'
            holder.styles.minHeight = holder.height + 'px'
            setTimeout(function() { el.styles.maxHeight = '0px' }, 0)
        } else {
            el.styles.maxWidth = el.width + 'px'
            holder.styles.minWidth = holder.width + 'px'
            setTimeout(function() { el.styles.maxWidth = '0px' }, 0)
        }

        function fn() {
            tag.transition = false
            tag.trigger('closed', tag)
        }
        animation ? el.handleTransitionEnd(fn) : fn()

        el.classes.add('close')
    }.bind(this)

    this.open = function() {
        if(tag.transition || tag.visible) return
        tag.transition = true

        if(tag.direction == 'vertical') {
            el.styles.maxHeight = '0px'
            el.styles.maxWidth = ''
            holder.styles.minHeight = ''
            setTimeout(function() { el.styles.maxHeight = holder.height + 'px' }, 0)
        } else {
            el.styles.maxHeight = ''
            el.styles.maxWidth = '0px'
            setTimeout(function() { el.styles.maxWidth = holder.width + 'px' }, 0)
        }

        function fn() {
            holder.styles.minHeight = holder.styles.minWidth = ''
            el.styles.maxHeight = el.styles.maxWidth = ''
            tag.transition = false
            tag.trigger('opened', tag)
        }
        tag.animation ? el.handleTransitionEnd(fn) : fn()

        el.classes.remove('close')
    }.bind(this)

    this.toggle = function() {
        tag.visible = !tag.visible
    }.bind(this)

    this.mounted = function() {
        holder = $.element(tag.refs.holder)

        var animation = tag.animation
        var visible = el.styles.display != 'none'

        tag.animation = false
        tag.anchor = tag.opts.dataAnchor || (tag.anchor || 'top')

        tag.visible = visible
        tag.animation = animation
        el.styles.display = ''
    }.bind(this)
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
        'margin',
        function() {
            return {
                left: el.styles.marginLeft,　right: el.styles.marginRight,
                top: el.styles.marginTop,　bottom: el.styles.marginBottom
            }
        },
        function(val) {
            for(var key in val) {
                el.styles['margin' + key.substring(0, 1).toUpperCase() + key.substring(1)] = val[key]
            }
        }
    )

    tag.property(
        'minWidth',
        function() { return Number(el.computedStyle().minWidth.replace(/px$/, '')) },
        function(val) { el.styles.minWidth = val }
    )

    tag.property(
        'padding',
        function() {
            return {
                left: el.styles.paddingLeft,　right: el.styles.paddingRight,
                top: el.styles.paddingTop,　bottom: el.styles.paddingBottom
            }
        },
        function(val) {
            for(var key in val) {
                el.styles['padding' + key.substring(0, 1).toUpperCase() + key.substring(1)] = val[key]
            }
        }
    )

    tag.property(
        'width',
        function() { return el.width },
        function(val) { el.width = val }
    )

});
riot.tag2('w-modal', '', '', 'onclick="{click}"', function(opts) {
    this.mixin('component')

    var tag = this

    var $ = tag.$
    var el = $.element(tag.root)

    tag.property(
        'depth',
        function() { return Number(el.computedStye().zIndex) },
        function(val) { el.styles.zIndex = val }
    )
    tag.property(
        'visible',
        function() { return !el.classes.contains('close') },
        function(val) {
            if(val) {
                el.styles.display = 'block'
                el.classes.add('close')
                setTimeout(function() { el.classes.remove('close') }, 0)
            } else {
                el.classes.add('close')
                el.handleTransitionEnd(function() { el.styles.display = '' })
            }
        }
    )

    this.click = function() { tag.trigger('click', tag) }.bind(this)

    el.classes.add('close')
});
riot.tag2('w-radio', '<w-icon data-value="{face}"></w-icon>', '', 'onclick="{onClick}"', function(opts) {
    this.mixin('component')
    this.mixin('ripple')

    var tag = this
    var $ = tag.$
    var el = $.element(tag.root)

    tag.property(
        'checked',
        function() { return el.classes.contains('checked') },
        function(val) {
            val ? el.classes.add('checked') : el.classes.remove('checked')
            if(tag.group && val) tag.group.trigger('checked', tag, val)
            tag.update()
            tag.trigger('change', tag)
        }
    )

    tag.property(
        'color',
        function() {
            var style = el.computedStyle()
            return tag.disabled ? '' : (tag.checked ? (style.color || '') : '')
        },
        function(val) {
            el.styles.backgroundColor = val
            tag.update()
        }
    )

    tag.property(
        'disabled',
        function () { return el.classes.contains('disabled') },
        function (val) {
            val ? el.classes.add('disabled') : el.classes.remove('disabled')
            tag.update()
        }
    )

    tag.property(
        'face',
        function () {
             return (tag.checked && !tag.disabled) ? 'radio_button_checked' : 'radio_button_unchecked' }
    )

    this.toggle = function() { if(!tag.disabled) tag.checked = !tag.checked }.bind(this)

    this.onClick = function(ev) {
        if(tag.group) {
            if(!tag.checked) tag.checked = true
        }
        else tag.toggle()
        tag.trigger('click')
    }.bind(this)

    this.mounted = function() { tag.checked = tag.checked }.bind(this)

    var handleGroup = function(sender, val) {
        if(sender == tag) return
        if(val) tag.checked = !val
    }

    if(tag.group) tag.group.add('checked', handleGroup)
});
riot.tag2('w-switch-track', '', '', '', function(opts) {
});

riot.tag2('w-switch-container', '', '', '', function(opts) {
    this.mixin('component')
    this.color = parent.color
});

riot.tag2('w-switch-thumb', '', '', '', function(opts) {
});

riot.tag2('w-switch', '<w-switch-track riot-style="background-color:{color};"></w-switch-track> <w-switch-container data-mixin="ripple" color="{color}" onclick="{onClick}"> <w-switch-thumb riot-style="background-color:{parent.color};"></w-switch-thumb> </w-switch-container>', '', '', function(opts) {
    this.mixin('component')

    var tag = this

    var $ = tag.$
    var el = $.element(tag.root)

    tag.property(
        'checked',
        function() { return el.classes.contains('checked') },
        function(val) {
            val ? el.classes.add('checked') : el.classes.remove('checked')
            tag.update()
            tag.trigger('change', tag)
        }
    )

    tag.property(
        'color',
        function() {
            var style = el.computedStyle()
            return tag.disabled ? '' : (tag.checked ? (style.color || '') : '')
        },
        function(val) {
            el.styles.backgroundColor = val
            tag.update()
        }
    )

    tag.property(
        'disabled',
        function () { return el.classes.contains('disabled') },
        function (val) {
            val ? el.classes.add('disabled') : el.classes.remove('disabled')
            tag.update()
        }
    )

    this.toggle = function() { if(!tag.disabled) tag.checked = !tag.checked }.bind(this)

    this.onClick = function(ev) {
        tag.toggle()
        tag.trigger('click')
    }.bind(this)

    this.mounted = function() {
        tag.checked = tag.checked
    }.bind(this)

});

riot.tag2('w-container', '<yield></yield>', '', '', function(opts) {
    this.mixin('component')
    var tag = this

    var $ = tag.$
    var el = $.element(tag.root)

    var animation = false
    var drawer = { left: null, right: null, primary: null, secondary: null }
    var resize = { min: 0, max: 0 }

    var update = null

    tag.property(
        'animation',
        function() { return el.classes.contains('animation') },
        function(val) { val ? el.classes.add('animation') : el.classes.remove('animation') }
    )

    tag.property(
        'pane',
        function() {
            var result = tag.tags['w-pane']
            return Array.isArray(result) ? result[0] : result
        }
    )

    tag.property(
        'drawers',
        function() {
            var result = tag.tags['w-drawer']
            return Array.isArray(result) ? result : [result] }
    )

    tag.property(
        'footer',
        function() {
            var result = tag.tags['w-footer']
            return Array.isArray(result) ? result[0] : result
        }
    )

    tag.property(
        'header',
        function() {
            var result = tag.tags['w-header']
            result = Array.isArray(result) ? result[0] : result
            return result
        }
    )

    tag.property(
        'width',
        function() { return el.width },
        function(val) { el.width = val }
    )

    var handleResize = function(h, w) {
        if(!resize.min && !resize.max) return

        var pane = tag.pane
        if(!pane) return

        var ds1 = 300
        var ds2 = 300

        var bp1 = 0
        var bp2 = 0
        var variant = null

        if(resize.min) {
            bp1 = resize.min + ds1 + ds2
            bp2 = resize.min + ds2
            if(el.width <= bp1 && drawer.secondary) {
                if(drawer.secondary.variant == 'persistent') drawer.secondary.visible = false
                drawer.secondary.variant = 'temporary'
            }
            if(el.width <= bp2 && drawer.primary) {
                if(drawer.primary.variant == 'persistent') drawer.primary.visible = false
                drawer.primary.variant = 'temporary'
            }
        }
        if(resize.max && 0 < w) {
            bp1 = resize.max + ds1 + ds2
            bp2 = resize.max + ds2
            if(bp2 <= el.width && drawer.primary) {
                drawer.primary.variant = 'persistent'
                drawer.primary.visible = true
            }
            if(bp1 <= el.width && drawer.secondary) {
                drawer.secondary.variant = 'persistent'
                drawer.secondary.visible = true
            }
        }
    }

    update = function() {
        var header = tag.header
        var pane = tag.pane
        var footer = tag.footer

        var w = tag.width
        if(drawer.left) w -= drawer.left.width
        if(drawer.right) w -= drawer.right.width

        if(header && drawer.left) header.margin = { left: drawer.left.width + 'px' }
        if(header && drawer.right) header.margin = { right: drawer.right.width + 'px' }

        if(pane) { pane.margin = { top: header.height + 'px' } }

        handleResize()
    }

    var toArray = function(val) { return Array.isArray(val) ? val : [val] }

    tag.on('mount', function() {
        if(2 < toArray(tag.tags['w-drawer']).length) throw new Error
        if(1 < toArray(tag.tags['w-header']).length) throw new Error
        if(1 < toArray(tag.tags['w-pane']).length) throw new Error
        if(1 < toArray(tag.tags['w-footer']).length) throw new Error

        animation = tag.animation
        tag.animation = false
    })

    this.mounted = function() {
        var drawers = tag.drawers
        for(var i = 0; i < drawers.length; i++) {
            var d = drawers[i]
            var priority = d.priority
            if(priority) drawer[priority] = d
            drawer[d.anchor] = d
            d.on('update', update)
        }
        for(var j = 0; j < drawers.length; j++) {
            d = drawers[j]
            if(!d.priority) {
                if(!drawer.primary) drawer.primary = d
                else drawer.secondary = d
            }
        }
        if(tag.header) tag.header.on('update', update)
        if(tag.footer) tag.footer.on('update', update)

        if(tag.pane) {
            var size = tag.pane.opts.dataHandleResize
            if(size) {
                var min = size.match(/min\:\s*(\d+)/)
                if(min) resize.min = Number(min[1])
                var max = size.match(/max\:\s*(\d+)/)
                if(max) resize.max = Number(max[1])
            }
        }

        setTimeout(function() {
            for(var k = 0; k < drawers.length; k++) { drawers[k].animation = animation }
            tag.header.animation = animation
            tag.animation = animation
        }, 0)

        update()
        if(resize.min || resize.max) {
            handleResize()
            el.handleResize(handleResize)
        }
    }.bind(this)
    tag.on('update', update)

});