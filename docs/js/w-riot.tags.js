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
riot.tag2('w-component', '<yield></yield>', '', '', function(opts) {
    this.mixin('component')
});
riot.tag2('w-container', '<yield></yield>', '', '', function(opts) {
    this.mixin('component')
    var tag = this

    var $ = tag.$
    var el = $.element(tag.root)

    var animation = false
    var drawer = { left: null, right: null, primary: null, secondary: null }
    var resize = { min: 0, max: 0 }

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

    var update = function() {
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

        if(drawer.left && drawer.right) {
            drawer.left.on('visible', function(sender, val) {
                if(val && drawer.variant == 'temporary') drawer.right.visible = false })
            drawer.right.on('visible', function(sender, val) {
                if(val && drawer.variant == 'temporary') drawer.left.visible = false })
        }
    }.bind(this)
    tag.on('update', update)

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
riot.tag2('w-item', '', '', '', function(opts) {
    this.mixin('component')
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

riot.tag2('w-button', '<yield></yield>', '', '', function(opts) {
    this.mixin('component')
    this.mixin('button')
    this.mixin('ripple')

    var tag = this
});