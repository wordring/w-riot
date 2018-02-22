<w-drawer-holder>
<script>
    this.mixin('component')

    var tag = this

    var $ = tag.$
    var el = $.element(tag.root)

    width() { return el.width }

    var update = function() {
        if(tag.opts.anchor == 'left') {
            el.styles.left = tag.opts.visible ? '0px' : -el.width + 'px'
            el.styles.display = tag.opts.display
        } else {
            el.styles.right = tag.opts.visible ? '0px' : -el.width + 'px'
            el.styles.display = tag.opts.display
        }
    }

    mounted() { update() }
    tag.on('update', update)
</script>
</w-drawer-holder>

<w-drawer>
    <w-drawer-holder
        ref="holder"
        anchor={anchor}
        display={display}
        variant={variant}
        visible={visible}
    >
        <yield/>
    </w-drawer-holder>
<script>
    this.mixin('component')

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
            tag.update()
        }
    )

    tag.property(
        'visible',
        function() { return !el.classes.contains('close') },
        function(val) {
            if(tag.visible == val) return
            val ? el.classes.remove('close') : el.classes.add('close')
            tag.update()
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

    toggle() { tag.visible = !tag.visible }

    tag.on('mount', function() {
        holder = tag.refs.holder

        if(tag.display == 'none') tag.visible = false
        el.styles.display = 'block'
        tag.update()
    })

    tag.on('update', function() {
        el.styles.minWidth = (tag.visible && tag.variant == 'persistent') ? holder.width() + 'px' : '0px'
        el.styles.width = el.styles.minWidth
        tag.trigger('change', tag)
    })
</script>
</w-drawer>