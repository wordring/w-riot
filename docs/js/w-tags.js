
(function(tagger) {
  if (typeof define === 'function' && define.amd) {
    define(function(require, exports, module) { tagger(require('riot'), require, exports, module)})
  } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    tagger(require('riot'), require, exports, module)
  } else {
    tagger(window.riot)
  }
})(function(riot, require, exports, module) {
riot.tag2('w-app-drawer', '<div data-is="w-panel" ref="panel"> <yield></yield> </div>', '', '', function(opts) {
    this.component = 'drawer'

    this.mixin('Component')

    var tag = this
    var $ = tag.wordring

    var el = tag.root
    var panel = null

    var pane = null
    var header = null

    this.close = function() {
        panel.close()
        $.removeClass(el, 'open')
    }.bind(this)

    this.header = function(val) {
        if(val) header = val
        return header
    }.bind(this)

    this.isLeft = function() { return $.hasClass(el, 'left') }.bind(this)

    this.isTemporary_ = function() { return $.hasClass(el, 'temporary') }.bind(this)

    this.isOpen = function() { return !$.hasClass(el, 'close') }.bind(this)

    this.open = function() {
        panel.open()
        $.removeClass(el, 'close')
    }.bind(this)

    this.pane = function(val) {
        if(val) pane = val
        return pane
    }.bind(this)

    this.temporary = function(flg) {
        if(typeof flg == 'undefined') return $.hasClass(el, 'temporary')

        if(flg) {
            $.addClass(el, 'temporary')
            $.removeClass(el, 'persistent')
        } else {
            $.addClass(el, 'persistent')
            $.removeClass(el, 'temporary')
        }
    }.bind(this)

    this.toggle = function() { tag.isOpen() ? tag.close() : tag.open() }.bind(this)

    this.onPanelClosed = function() {
        tag.onResize()
        $.addClass(el, 'close')
        tag.trigger('closed', tag)
    }.bind(this)

    this.onPanelMount = function() {
        var bgColor = window.getComputedStyle(el, '').backgroundColor
        el.style.backgroundColor = 'transparent'
        el.style.display = 'block'

        panel.backgroundColor(bgColor)
        panel.height('100%')
        if(!$.hasClass(el, 'right')) panel.anchor('left')
        else panel.anchor('right')

        tag.onResize()
    }.bind(this)

    this.onPanelOpend = function() {
        tag.onResize()
        $.addClass(el, 'open')
        tag.trigger('opened', tag)
    }.bind(this)

    this.onResize = function() {
        var headerHeight = header ? $.height(header.root) : 0
        if(pane) {
            $.height(pane.root, $.height(el) - headerHeight)
        }
    }.bind(this)

    tag.on('close', tag.close)
    tag.on('open', tag.open)
    tag.on('toggle', tag.toggle)
    tag.on('temporary', tag.temporary)
    tag.on('resize', tag.onResize)

    tag.on('mount', function() {
        panel = tag.refs.panel

        panel.on('closed', tag.onPanelClosed)
        panel.on('mount', tag.onPanelMount)
        panel.on('opened', tag.onPanelOpend)

        if(!$.hasClass(el, 'right')) $.addClass(el, 'left')
        if(!$.hasClass(el, 'temporary')) $.addClass(el, 'persistent')
    })

    $.handleResize(tag)

});
riot.tag2('w-app-pane', '<yield></yield>', '', '', function(opts) {
    this.component = 'app-pane'

    this.mixin('Component')

    var tag = this
    var $ = this.wordring

    var el = tag.root

});

riot.tag2('w-app', '', '', '', function(opts) {
    this.component = 'app'
    this.mixin('Component')

    var tag = this
    var $ = tag.wordring
    var el = tag.root

    tag.leftDrawer = null
    tag.rightDrawer = null
    tag.appPane = null

    this.onDrawerClose = function(drawer) {
        var pos = drawer.isLeft() ? 'left' : 'right'
    }.bind(this)

    this.onDrawerMount = function(drawer) {
        if(drawer.isLeft()) tag.leftDrawer = drawer
        else tag.rightDrawer = drawer
    }.bind(this)

    this.onDrawerOpen = function(drawer) {
        var pos = drawer.isLeft() ? 'left' : 'right'
    }.bind(this)

    this.onMount = function() {
    }.bind(this)

    this.onPaneMount = function(appPane) {
        tag.appPane = appPane
    }.bind(this)

    this.onUpdate = function() {
        ;
    }.bind(this)

    tag.on('drawer-close', tag.onDrawerClose)
    tag.on('drawer-mount', tag.onDrawerMount)
    tag.on('drawer-open', tag.onDrawerOpen)
    tag.on('pane-mount', tag.onPaneMount)

    tag.on('mount', tag.onMount)
});

riot.tag2('w-header', '<yield></yield>', '', '', function(opts) {
    this.component = 'header'
    this.mixin('Component')
});
riot.tag2('w-icon', '<yield></yield>', '', 'onclick="{onClick}"', function(opts) {
    this.component = 'icon'

    this.mixin('Component')

    var tag = this

    var el = tag.root

    this.onClick = function() { tag.trigger('click') }.bind(this)

    tag.on('hide', function() {
        el.style.display = 'none'
    })
    tag.on('show', function() {
        el.style.display = ''
    })
});
riot.tag2('w-list-item', '<yield></yield>', '', '', function(opts) {
    this.component = 'list-item'

    this.mixin('Component')

    var tag = this
    var $ = tag.wordring

    var el = tag.root

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

    tag.on('mount', function() {

    })
});
riot.tag2('w-panel', '<div ref="holder"> <yield></yield> </div>', '', '', function(opts) {
    this.component = 'panel'

    this.mixin('Component')

    var tag = this
    var $ = tag.wordring

    var el = tag.root
    var holder = null

    var transition = false

    this.anchor = function(to) {
        var ary = ['left', 'right', 'top', 'bottom']
        for(var i = 0; i < ary.length; i++) {
            var atom = 'anchor-' + ary[i]
            if(to) $.removeClass(el,atom)
            else if($.hasClass(el, atom)) return ary[i]
        }
        if(to) $.addClass(el, 'anchor-' + to)
    }.bind(this)

    this.backgroundColor = function(color) {
        holder.style.backgroundColor = color
    }.bind(this)

    this.close = function() {
        if(transition || !tag.isOpen()) return
        transition = true
        $.addClass(el, 'close')
        $.handleTransitionEnd(holder, function() {
            transition = false
            holder.style.position = 'absolute'
            tag.trigger('closed')
        })
    }.bind(this)

    this.height = function(val) {
        $.height(holder, val)
        return $.height(el, val)
    }.bind(this)

    this.isOpen = function() { return !$.hasClass(el, 'close') }.bind(this)

    this.open = function() {
        if(transition || tag.isOpen()) return
        transition = true
        holder.style.position = ''
        $.removeClass(el, 'close')
        $.handleTransitionEnd(holder, function() {
            transition = false
            tag.trigger('opened')
        })
    }.bind(this)

    this.toggle = function() {
        if($.hasClass(el, 'close')) tag.open()
        else tag.close()
    }.bind(this)

    this.onMount = function() {
        holder = tag.refs.holder
    }.bind(this)

    tag.on('close', tag.close)
    tag.on('anchor', tag.anchor)
    tag.on('mount', tag.onMount)
    tag.on('open', tag.open)
    tag.on('toggle', tag.toggle)

});
riot.tag2('w-ripple', '<span ref="effect"></span> <yield></yield>', '', '', function(opts) {
    this.component = 'ripple'

    this.mixin('Component')

    var $ = this.wordring
    var el = this.root
    var effect = null

    var tag = this

    tag.color = tag.opts.dataColor || ''

    this.onMousedown = function(ev) {

        var dx = Math.max($.width(el), $.height(el)) * 2
        $.width(effect, dx)
        $.height(effect, dx)
        var rect = ev.currentTarget.getBoundingClientRect()
        var x = ev.clientX - rect.left
        var y = ev.clientY - rect.top
        effect.style.left = (x - dx / 2) + 'px'
        effect.style.top = (y - dx / 2) + 'px'

        if(!$.hasClass(effect, 'active')) {
            $.addClass(effect, 'active')
            if(!window.AnimationEvent) setTimeout(tag.onAnimationEnd, 500)
        }
    }.bind(this)

    this.onAnimationEnd = function(ev) {
        $.removeClass(effect, 'active')
    }.bind(this)

    tag.on('mount', function() {
        effect = tag.refs.effect

        effect.style.background = tag.opts.dataColor || ''
        el.addEventListener('mousedown', tag.onMousedown)

        if(window.AnimationEvent) {
            tag.refs.effect.addEventListener('animationend', tag.onAnimationEnd, false)
        }
    })
});
riot.tag2('w-switch', '<label> <input ref="input" type="checkbox"> <span></span> </label> <yield></yield>', '', '', function(opts) {
    this.component = 'switch'

    this.mixin('Component')

});

riot.tag2('w-toolbar', '<yield></yield>', '', '', function(opts) {
    this.component = 'toolbar'

    this.mixin('Component')

    var tag = this

});});