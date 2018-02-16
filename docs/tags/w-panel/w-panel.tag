<w-panel>
    <div ref="holder">
        <yield/>
    </div>
<script>
    this.mixin('component')
    
    var tag = this
    var $ = tag.$
    var el = null
    var holder = null

    var anchors = ['anchor-left', 'anchor-right', 'anchor-top', 'anchor-bottom']

    // anchor.
    tag.property(
        'anchor',
        function() { return el.classes.find(anchors).replace(/^anchor-/, '') },
        function(val) { if(val) el.classes.remove(anchors).add('anchor-' + val) }
    )

    // animation.
    tag.property(
        'animation',
        function() { return holder.classes.contains('animation') },
        function(val) { val ? holder.classes.add('animation') : holder.classes.remove('animation') }
    )

    // bacgroundColor.
    tag.property(
        'backgroundColor',
        function() { return holder.styles.backgroundColor },
        function(val) { holder.styles.backgroundColor = val }
    )

    // height.
    tag.property(
        'height',
        function() { return holder.height },
        function(val) { holder.height = val }
    )

    // transition.
    tag.property(
        'transition',
        function() { return el.classes.contains('transition') },
        function(val) { val ? el.classes.add('transition') : el.classes.remove('transition') }
    )

    // visible.
    tag.property(
        'visible',
        function() { return !el.classes.contains('close') },
        function(val) { val ? tag.open() : tag.close() }
    )

    // width.
    tag.property(
        'width',
        function() { return holder.width },
        function(val) { holder.width = val }
    )

    close() {
        if(tag.transition || !tag.visible) return
        tag.transition = true
        el.classes.add('close')

        function fn() {
            tag.transition = false
            holder.styles.position = 'absolute'
            tag.trigger('closed', tag)
        }
        tag.animation ? holder.handleTransitionEnd(fn) : fn()
    }

    open() {
        if(tag.transition || tag.visible) return

        tag.transition = true
        holder.styles.position = ''
        el.classes.remove('close')

        function fn() {
            tag.transition = false
            tag.trigger('opened', tag)
        }
        tag.animation ? holder.handleTransitionEnd(fn) : fn()
    }

    toggle() {
        tag.visible = !tag.visible
    }

    init() {
        el = $.element(tag.root)
        holder = $.element(tag.refs.holder)
        if(el.styles.display == 'none') {
            tag.close()
            el.styles.display = ''
        }
        holder.classes.add('animation')
        tag.anchor = tag.opts.dataAnchor || (tag.anchor || 'top')
    }
</script>
</w-panel>