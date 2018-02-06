
(function(tagger) {
  if (typeof define === 'function' && define.amd) {
    define(function(require, exports, module) { tagger(require('riot'), require, exports, module)})
  } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    tagger(require('riot'), require, exports, module)
  } else {
    tagger(window.riot)
  }
})(function(riot, require, exports, module) {
riot.tag2('w-drawer-container', '<yield></yield>', '', '', function(opts) {

debugger

this.component = 'drawer-container'

this.mixin('Component')
this.mixin('Container')

var tag = this

tag.left = null
tag.right = null
tag.content = null

tag.on('drawer-open', function(drawer) {
    if(drawer.isTemporary()) {
        if(drawer.isLeft()) tag.right.trigger('close')
        else tag.left.trigger('close')
    }
})

tag.on('drawer-mount', function(drawer) {
    if(drawer.isLeft()) tag.left = drawer
    else tag.right = drawer
})

tag.on('content-mount', function(content) {
    tag.content = content
})

tag.on('mount', function() {

})

this.onResize = function() {

}.bind(this)

});
riot.tag2('w-drawer-content', '<yield></yield>', '', '', function(opts) {
this.component = 'drawer-content'

this.mixin('Component')
this.mixin('Container')

var tag = this

tag.container = null

tag.on('mount', function() {
    if(tag.container) {
        tag.container.trigger('content-mount', tag)
    }
})

if(tag.parent) tag.container = tag.findAncestor(function(arg) {
    return arg.component == 'drawer-container'
})

});

riot.tag2('w-drawer-panel', '<div ref="panel"> <yield></yield> </div>', '', '', function(opts) {
    this.component = 'drawer-panel'

    this.style = {
        minWidth: '300px',
        maxWidth: '400px',
        width: '320px',
    }

    this.mixin('Component')

    var tag = this

    this.isLeft = function() { return tag.hasClass('left') }.bind(this)

    this.isTemporary = function() { return tag.hasClass('temporary') }.bind(this)

    this.isOpen = function() { return !tag.hasClass('close') }.bind(this)

    this.close = function() {
        if(tag.container) tag.container.trigger('drawer-close', tag)

        var el = tag.root
        var panel = tag.refs.panel

        var w = tag.width()
        tag.addClass('close')

        panel.style.width = w + 'px'

        if(!tag.isTemporary() || !tag.isLeft()) {
            tag.addClass(panel, 'float')
            el.style.maxWidth = '0px'
            el.style.minWidth = '0px'
            el.style.width = '0px'
        }

        if(tag.isLeft()) el.style.left = -w + 'px'

    }.bind(this)

    this.open = function() {
        if(tag.container) tag.container.trigger('drawer-open', tag)

        var el = tag.root
        var panel = tag.refs.panel

        el.style.maxWidth = tag.style.maxWidth
        el.style.minWidth = tag.style.minWidth
        el.style.width = tag.style.width

        if(tag.isLeft()) el.style.left = ''
        else panel.style.width = ''

        tag.removeClass(panel, 'float')
        tag.removeClass('close')
    }.bind(this)

    this.setTemporary = function(flg) {
        var el = tag.root

        tag.close()
        el.style.display = 'block'

        if(flg) {
            tag.addClass('temporary')
            el.style.width = tag.width()
        }
        else {
            tag.removeClass('temporary')
            el.style.width = ''
        }
    }.bind(this)

    this.toggle = function() { tag.isOpen() ? tag.close() : tag.open() }.bind(this)

    tag.on('close', tag.close)
    tag.on('open', tag.open)
    tag.on('toggle', tag.toggle)

    tag.container.on('resize', function(){
        if(tag.isTemporary() && tag.isOpen()) tag.close()
    })

    tag.on('mount', function() {
        if(!tag.hasClass('right')) tag.addClass('left')

        tag.container.trigger('drawer-mount', tag)
    })

    tag.container = tag.findAncestor(function(arg) {
        return arg.component == 'drawer-container'
    })

});
riot.tag2('w-icon', '<yield></yield>', '', 'onclick="{onClick}"', function(opts) {
    this.component = 'icon'

    this.mixin('Component')

    var tag = this

    this.onClick = function() { tag.trigger('click') }.bind(this)
});
riot.tag2('w-ripple', '<span ref="effect" class="{active}" riot-style="background:{color}"></span> <yield></yield>', '', 'onmousedown="{onMousedown}"', function(opts) {
    this.component = 'ripple'

    this.mixin('Component')

    var tag = this

    tag.active = ''
    tag.color = tag.opts.dataColor || ''

    this.onMousedown = function(ev) {
        var effect = tag.refs.effect
        effect.style.left = (ev.offsetX - tag.width(effect) / 2) + 'px'
        effect.style.top = (ev.offsetY - tag.height(effect) / 2) + 'px'

        if(!tag.active) {
            tag.active = 'active'
            if(!window.AnimationEvent) setTimeout(tag.onAnimationEnd, 500)
        }
    }.bind(this)

    this.onAnimationEnd = function(ev) {
        tag.active = ''
        tag.update()
    }.bind(this)

    tag.on('mount', function() {
        if(window.AnimationEvent) {
            tag.refs.effect.addEventListener('animationend', tag.onAnimationEnd, false)
        }
    })
});
riot.tag2('w-switch', '<label> <input type="checkbox"> <span></span> </label>', '', '', function(opts) {
});
riot.tag2('w-toolbar', '<yield></yield>', '', '', function(opts) {
    this.component = 'toolbar'

    this.mixin('Component')
    this.mixin('Container')

    console.log(this)

    var tag = this

});});