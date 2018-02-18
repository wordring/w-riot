riot.tag2('w-app', '<yield></yield>', '', '', function(opts) {
    var tag = this
    var $ = tag.$
    var el = tag.root
});

riot.tag2('w-button', '<yield></yield>', '', '', function(opts) {
    this.mixin('component')
    this.mixin('button')
    this.mixin('ripple')
});
riot.tag2('w-drawer', '<w-panel data-observer="{this}" data-trigger="created:panel-created"> <yield></yield> </w-panel>', '', '', function(opts) {
    this.mixin('component')

    var tag = this
    var panel = null

    var $ = tag.$
    var el = $.element(tag.root)

    var variants = ['temporary', 'persistent']
    var anchors = ['left', 'right']

    var doc = $.element(document.body)
    doc.styles.height = '100%'

    tag.property(
        'anchor',
        function() { return panel.anchor },
        function(val) {
            el.classes.remove(anchors).add(val)
            panel.anchor = val
        }
    )

    tag.property(
        'contentPane',
        function() { return panel.tags['w-pane'] },
        function(opts) {
        }
    )

    tag.property(
        'header',
        function() { return panel.tags['w-header'] },
        function(opts) {
        }
    )

    tag.property(
        'height',
        function() { return panel.height },
        function(val) { el.height = panel.height = val }
    )

    tag.property(
        'variant',
        function() { return el.classes.find(variants) },
        function(val) { el.classes.remove(variants).add(val) }
    )

    tag.property(
        'visible',
        function() { return !el.classes.contains('close') },
        function(val) {
            val ? tag.open() : tag.close()
            if(!val) el.classes.add('close')
        }
    )

    tag.property(
        'width',
        function() { return panel.width },
        function(val) { _width = panel.width = val }
    )

    this.close = function() {
        var right = tag.variant == 'temporary' && tag.anchor == 'right'
        if(right) {
            el.handleTransitionEnd(function() { el.styles.left = '' })
            el.styles.left = $.window.width - el.width + 'px'
        }
        setTimeout(function() {
            if(right) el.styles.left = '100%'
            panel.close()
            el.classes.add('close')
        }, 0)
    }.bind(this)

    this.open = function() {
        panel.open()
        el.classes.remove('close')
    }.bind(this)

    this.toggle = function() { tag.visible ? tag.close() : tag.open() }.bind(this)

    this.init = function() { return true }.bind(this)

    this.onPanelCreated = function() {
        panel = tag.tags['w-panel']

        panel.on('closed', tag.onPanelClosed)
        panel.on('opened', tag.onPanelOpend)

        tag.anchor = el.classes.contains('right') ? 'right' : 'left'
        tag.variant = tag.variant || 'temporary'

        var style = el.computedStyle()
        el.styles.display = 'block'

        panel.backgroundColor = style.backgroundColor
        el.styles.backgroundColor = 'transparent'

        panel.width = style.width

        tag.visible = style.display == 'none' ? false : true
        tag.handleResize()

        tag.trigger('created', tag)
    }.bind(this)

    this.onPanelClosed = function() {
        el.classes.add('close')
        tag.trigger('closed', tag)
    }.bind(this)

    this.onPanelOpend = function() {
        el.classes.add('open')
        tag.trigger('opened', tag)
    }.bind(this)

    this.handleResize = function() {
        var header = tag.header
        var contentPane = tag.contentPane
        if(contentPane) contentPane.height = $.window.height - (header ? header.height : 0)
    }.bind(this)
    el.handleResize(tag.handleResize)

    tag.on('panel-created', tag.onPanelCreated)

});
riot.tag2('w-component', '<yield></yield>', '', '', function(opts) {
    this.mixin('component')
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
        function(val) { el.width = val }
    )

    this.close = function() {
        if(tag.transition || !tag.visible) return
        tag.transition = true

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
        tag.animation ? el.handleTransitionEnd(fn) : fn()

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

    this.init = function() {
        holder = $.element(tag.refs.holder)
        if(el.styles.display == 'none') {
            tag.close()
            el.styles.display = ''
        }
        el.classes.add('animation')
        tag.anchor = tag.opts.dataAnchor || (tag.anchor || 'top')

        return false
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