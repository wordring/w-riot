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