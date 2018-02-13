riot.tag2('w-app', '<yield></yield>', '', '', function(opts) {
    this.component = 'app'

    this.mixin('Component')

    var tag = this
    var $ = tag.wordring
    var el = tag.root

});

riot.tag2('w-button', '<w-ripple ref="ripple" class="center middle"></w-ripple> <yield></yield>', '', 'onclick="{onClick}"', function(opts) {
    this.component = 'button'

    this.mixin('Component')

    var tag = this
    var ripple = null

    var $ = tag.wordring
    var el = tag.root

    this.onClick = function(ev) {
        tag.trigger('clicked')
    }.bind(this)

    this.onMount = function() {
        ripple = tag.refs.ripple
        tag.onUpdate()
    }.bind(this)

    this.onUpdate = function() {
        ripple.root.style.color = tag.opts.dataRippleColor
    }.bind(this)

    tag.on('mount', tag.onMount)
    tag.on('update', tag.onUpdate)

});
riot.tag2('w-drawer', '<w-panel ref="panel"> <yield></yield> </w-panel>', '', '', function(opts) {
    this.component = 'drawer'

    this.mixin('Component')

    var tag = this
    var panel = null

    var $ = tag.wordring
    var el = tag.root

    document.body.style.overflowX = 'hidden'

    this.getAnchor = function() {
        if($.hasClass(el, 'left')) return 'left'
        if($.hasClass(el, 'right')) return 'right'
        return null
    }.bind(this)
    this.setAnchor = function(to) {
        var ary = ['left', 'right']
        if(ary.indexOf(to) == -1) throw TypeError
        $.removeClass(el, to=='left' ? 'left' : 'right')
        $.addClass(el, to)
    }.bind(this)
    $.defineProperty(tag, 'anchor', tag.getAnchor, tag.setAnchor)

    this.getContentPane = function() { return panel.tags['w-pane'] }.bind(this)
    this.setContentPane = function(opts) {
        var root = null
        if(tag.contentPane) {
            root = tag.contentPane.root
            tag.contentPane.unmount(true)
        }
        if(!root) {
            root = document.createElement('div')
            el.appendChild(root)
        }
        riot.mount(root, 'w-pane', opts)
    }.bind(this)
    $.defineProperty(tag, 'contentPane', tag.getContentPane, tag.setContentPane)

    this.getHeader = function() { return panel.tags['w-header'] }.bind(this)
    this.setHeader = function(opts) {
        var root = null
        if(tag.header) {
            root = tag.header.root
            tag.header.unmount(true)
        }
        if(!root) {
            root = document.createElement('div')
            if(el.firstChild) el.insertBefore(root, el.firstChild)
            else el.appendChild(root)
        }
        riot.mount(root, 'w-header', opts)
    }.bind(this)
    $.defineProperty(tag, 'header', tag.getHeader, tag.setHeader)

    this.getHeight = function() { return $.height(el) }.bind(this)
    this.setHeight = function(val) {
        $.height(el, val)
        panel.height = val
    }.bind(this)
    $.defineProperty(tag, 'height', tag.getHeight, tag.setHeight)

    this.getTemporary = function() { return $.hasClass(el, 'temporary') }.bind(this)
    this.setTemporary = function(val) {
        $.removeClass(el, val ? 'persistent' :  'temporary')
        $.addClass(el, val ? 'temporary' : 'persistent')
    }.bind(this)
    $.defineProperty(tag, 'temporary', tag.getTemporary, tag.setTemporary)

    this.getVisible = function() { return !$.hasClass(el, 'close') }.bind(this)
    this.setVisible = function(val) {
        if(val) tag.open()
        else tag.close()
    }.bind(this)
    $.defineProperty(tag, 'visible', tag.getVisible, tag.setVisible)

    this.getWidth = function() { return panel.width }.bind(this)
    this.setWidth = function(val) { panel.width = val }.bind(this)
    $.defineProperty(tag, 'width', tag.getWidth, tag.setWidth)

    this.close = function() {
        el.style.display = 'block'
        panel.close()
        $.removeClass(el, 'open')
    }.bind(this)

    this.open = function() {
        panel.open()
        $.removeClass(el, 'close')
    }.bind(this)

    this.toggle = function() { tag.visible = !tag.visible }.bind(this)

    this.handleResize = function() {
        var header = tag.header
        var contentPane = tag.contentPane

        var height = tag.height
        var headerHeight = header ? header.height : 0
        var contentPaneHeight = height - headerHeight

        if(contentPane) contentPane.height = contentPaneHeight
    }.bind(this)

    this.onMount = function() {
        panel = tag.refs.panel
        panel.on('closed', tag.onPanelClosed)
        panel.on('created', tag.onPanelCreated)
        panel.on('opened', tag.onPanelOpend)
    }.bind(this)

    this.onPanelClosed = function() {
        $.addClass(el, 'close')
        el.style.minWidth = ''
        tag.trigger('closed', tag)
    }.bind(this)

    this.onPanelCreated = function() {
        tag.anchor = tag.anchor || 'left'
        if(!$.hasClass(el, 'persistent')) tag.temporary = 'temporary'

        var display = el.style.display
        el.style.display = 'block'

        var style = window.getComputedStyle(el, '')
        panel.backgroundColor = style.backgroundColor
        el.style.backgroundColor = 'transparent'

        panel.width = style.width
        el.style.width = style.width

        if(display == 'none') {
            tag.close()
            $.addClass(el, 'close')
        } else {
            tag.open()
            $.addClass(el, 'open')
        }

        if(!$.hasClass(el, 'right')) panel.anchor = 'left'
        else panel.anchor = 'right'

        tag.handleResize()
    }.bind(this)

    this.onPanelOpend = function() {
        $.addClass(el, 'open')
        el.style.minWidth = tag.width + 'px'
        tag.trigger('opened', tag)
        tag.handleResize()
    }.bind(this)

    tag.on('close', tag.close)
    tag.on('mount', tag.onMount)
    tag.on('open', tag.open)
    tag.on('resize', tag.handleResize)
    tag.on('temporary', tag.temporary)
    tag.on('toggle', tag.toggle)

    $.handleResize(tag)

});
riot.tag2('w-header', '<yield></yield>', '', '', function(opts) {
    this.component = 'header'

    this.mixin('Component')

    var tag = this

    var $ = tag.wordring
    var el = tag.root

    this.getHeight = function() { return $.height(el) }.bind(this)
    this.setHeight = function(val) { $.height(el, val) }.bind(this)
    $.defineProperty(tag, 'height', tag.getHeight, tag.setHeight)

});
riot.tag2('w-icon', '<yield></yield>', '', '', function(opts) {
    this.component = 'icon'

    this.mixin('Component')

    var tag = this

    var el = tag.root

    tag.on('hide', function() {
        el.style.display = 'none'
    })
    tag.on('show', function() {
        el.style.display = ''
    })
});
riot.tag2('w-item', '', '', '', function(opts) {
});
riot.tag2('w-list', '<yield></yield>', '', '', function(opts) {
    this.component = 'list'

    this.mixin('Component')

    var tag = this
    var $ = tag.wordring

    var el = tag.root

});
riot.tag2('w-pane', '<yield></yield>', '', '', function(opts) {
    this.component = 'pane'
    this.mixin('Component')

    var tag = this

    var $ = tag.wordring
    var el = tag.root

    this.getHeight = function() { return $.height(el) }.bind(this)
    this.setHeight = function(val) { $.height(el, val) }.bind(this)
    $.defineProperty(tag, 'height', tag.getHeight, tag.setHeight)

});
riot.tag2('w-panel', '<div ref="holder"> <yield></yield> </div>', '', '', function(opts) {

    this.component = 'panel'

    this.mixin('Component')

    var tag = this

    var $ = tag.wordring
    var el = tag.root

    var anchor = ''
    var transition = false

    this.getAnchor = function() { return anchor }.bind(this)
    this.setAnchor = function(to) {
        var ary = ['left', 'right', 'top', 'bottom']
        if(ary.indexOf(to) == -1) throw TypeError

        anchor = to

        for(var i = 0; i < ary.length; i++) {
            var atom = 'anchor-' + ary[i]
            if(to) $.removeClass(el, atom)
            else if($.hasClass(el, atom)) return ary[i]
        }
        if(to) $.addClass(el, 'anchor-' + to)
    }.bind(this)
    $.defineProperty(tag, 'anchor', tag.getAnchor, tag.setAnchor)

    this.getBackgroundColor = function() { return tag.refs.holder.style.backgroundColor }.bind(this)
    this.setBackgroundColor = function(color) {
        tag.refs.holder.style.backgroundColor = color
    }.bind(this)
    $.defineProperty(tag, 'backgroundColor', tag.getBackgroundColor, tag.setBackgroundColor)

    this.getHeight = function() { return $.height(tag.refs.holder) }.bind(this)
    this.setHeight = function(val) {
        $.height(tag.refs.holder, val)
    }.bind(this)
    $.defineProperty(tag, 'height', tag.getHeight, tag.setHeight)

    this.getVisible = function() { return !$.hasClass(el, 'close') }.bind(this)
    this.setVisible = function(val) {
        if(val) tag.open()
        else tag.close()
    }.bind(this)
    $.defineProperty(tag, 'visible', tag.getVisible, tag.setVisible)

    this.getWidth = function() { return $.width(tag.refs.holder) }.bind(this)
    this.setWidth = function(val) {
        $.width(tag.refs.holder, val)
    }.bind(this)
    $.defineProperty(tag, 'width', tag.getWidth, tag.setWidth)

    this.close = function() {
        if(transition || !tag.visible) return
        transition = true
        $.addClass(el, 'close')

        function fn() {
            transition = false
            tag.refs.holder.style.position = 'absolute'
            tag.trigger('closed', tag)
        }
        if($.hasClass(tag.refs.holder, 'animation')) $.handleTransitionEnd(tag.refs.holder, fn)
        else fn()
    }.bind(this)

    this.open = function() {
        if(transition || tag.visible) return
        transition = true
        tag.refs.holder.style.position = ''
        $.removeClass(el, 'close')

        function fn() {
            transition = false
            tag.trigger('opened', tag)
        }
        if($.hasClass(tag.refs.holder, 'animation')) $.handleTransitionEnd(tag.refs.holder, fn)
        else fn()
    }.bind(this)

    this.toggle = function() {
        tag.visible = !tag.visible
    }.bind(this)

    this.onMount = function() {
        if(el.style.display == 'none') {
            tag.close()
            el.style.display = ''
        }
        $.addClass(tag.refs.holder, 'animation')
    }.bind(this)

    tag.on('mount', tag.onMount)

});
riot.tag2('w-ripple', '<span ref="effect"></span>', '', '', function(opts) {
    this.component = 'ripple'

    this.mixin('Component')

    var $ = this.wordring

    var tag = this

    var el = tag.root
    var parent = null
    var effect = null

    this.onMousedown = function(ev) {
        var dx = Math.max($.width(el), $.height(el)) * 2
        $.width(effect, dx)
        $.height(effect, dx)
        var rect = ev.currentTarget.getBoundingClientRect()
        var x = ev.clientX - rect.left
        var y = ev.clientY - rect.top
        effect.style.left = (x - dx / 2) + 'px'
        effect.style.top = (y - dx / 2) + 'px'

        if(!$.hasClass(el, 'active') && !$.hasClass(el, 'disabled')) {
            $.addClass(el, 'active')
            if(!window.AnimationEvent) setTimeout(tag.onAnimationEnd, 500)
        }
    }.bind(this)

    this.onAnimationEnd = function(ev) {
        $.removeClass(el, 'active')
    }.bind(this)

    this.onMount = function() {
        effect = tag.refs.effect

        el.addEventListener('click', tag.onMousedown)
        if(window.AnimationEvent) {
            effect.addEventListener('animationend', tag.onAnimationEnd, false)
        }
        tag.onUpdate()
    }.bind(this)

    this.onUpdate = function() {
        parent = el.parentElement

        $.height(el, $.height(parent))
        $.width(el, $.width(parent))

        var style = window.getComputedStyle(el, '')
        effect.style.backgroundColor = style.color
    }.bind(this)

    tag.on('mount', tag.onMount)
    tag.on('update', tag.onUpdate)

});
riot.tag2('w-switch', '<div ref="track"></div> <div ref="container" onclick="{onClick}"> <w-ripple ref="ripple" class="circle"></w-ripple> <div ref="thumb"></div> </div>', '', '', function(opts) {
    this.component = 'switch'

    this.mixin('Component')

    var tag = this

    var $ = tag.wordring
    var el = tag.root

    this.getChecked = function() { return tag.value == 'on' }.bind(this)
    this.setChecked = function(val) { tag.value = val ? 'on' : 'off' }.bind(this)
    $.defineProperty(tag, 'checked', tag.getChecked, tag.setChecked)

    this.getColor = function() {
        var style = window.getComputedStyle(el, '')
        var color = style.color || ''
        color = tag.checked ? color : ''
        return tag.disabled ? '' : color
    }.bind(this)
    this.setColor = function(val) {
        tag.refs.track.style.backgroundColor = tag.refs.thumb.style.backgroundColor = val
    }.bind(this)
    $.defineProperty(tag, 'color', tag.getColor, tag.setColor)

    this.getDisabled = function() { return $.hasClass(el, 'disabled') }.bind(this)
    this.setDisabled = function(val) {
        if(val === true) $.addClass(el, 'disabled')
        else {
            $.removeClass(el, 'disabled')
            tag.color = tag.color
        }
    }.bind(this)
    $.defineProperty(tag, 'disabled', tag.getDisabled, tag.setDisabled)

    this.getValue = function() { return $.hasClass(el, 'on') ? 'on' : 'off' }.bind(this)
    this.setValue = function(val) {
        var ary = ['on', 'off']
        if(ary.indexOf(val) == -1) throw TypeError

        $.handleTransitionEnd(el, tag.handleTransitionEnd)
        tag.transition = true

        $.removeClass(el, val == 'on' ? 'off' : 'on')
        $.addClass(el, val)

        tag.color = tag.color
    }.bind(this)
    $.defineProperty(tag, 'value', tag.getValue, tag.setValue)

    this.getTransition = function() { return $.hasClass(el, 'animation') }.bind(this)
    this.setTransition = function(val) {
        if(val) $.addClass(el, 'animation')
        else $.removeClass(el, 'animation')
    }.bind(this)
    $.defineProperty(tag, 'transition', tag.getTransition, tag.setTransition)

    this.toggle = function() {
        if(tag.disabled) return
        tag.checked = !tag.checked
    }.bind(this)

    this.handleTransitionEnd = function() {
        tag.transition = false
    }.bind(this)

    this.onClick = function(ev) {
        tag.toggle()
        tag.trigger('clicked')
    }.bind(this)

    this.onMount = function() {
        if(!$.hasClass(el, 'on')) $.addClass(el, 'off')
        tag.color = tag.color
    }.bind(this)

    tag.on('mount', tag.onMount)

});