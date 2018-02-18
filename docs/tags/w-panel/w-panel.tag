<w-panel>
    <div ref="holder">
        <yield/>
    </div>
<script>
    this.mixin('component')
    
    var tag = this
    var $ = tag.$
    var el = $.element(tag.root)
    var holder = null

    var anchors = ['anchor-left', 'anchor-right', 'anchor-top', 'anchor-bottom']

    // anchor.
    tag.property(
        'anchor',
        function() { return el.classes.find(anchors).replace(/^anchor-/, '') },
        function(val) {
            if(!tag.visible) throw new Error
            if(val) el.classes.remove(anchors).add('anchor-' + val)
        }
    )

    // animation.
    tag.property(
        'animation',
        function() { return el.classes.contains('animation') },
        function(val) { val ? el.classes.add('animation') : el.classes.remove('animation') }
    )

    // bacgroundColor.
    tag.property(
        'backgroundColor',
        function() { return holder.styles.backgroundColor },
        function(val) { holder.styles.backgroundColor = val }
    )

    // direction.
    tag.property(
        'direction',
        function() {
            var anchor = tag.anchor
            if(anchor == 'top' || anchor == 'bottom') return 'vertical'
            return 'horizontal'
        },
        function() { throw new TypeError }
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
        function() { return el.width },
        function(val) { el.width = val }
    )

    close() {
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
    }

    open() {
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
    }

    toggle() {
        tag.visible = !tag.visible
    }

    init() {
        holder = $.element(tag.refs.holder)
        if(el.styles.display == 'none') {
            tag.close()
            el.styles.display = ''
        }
        el.classes.add('animation')
        tag.anchor = tag.opts.dataAnchor || (tag.anchor || 'top')

        return false
    }
</script>
</w-panel>