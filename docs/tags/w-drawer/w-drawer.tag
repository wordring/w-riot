<w-drawer>
    <w-panel style="display:{display};" data-anchor={anchor} data-observer={this} data-trigger="created:panel-created">
        <yield/>
    </w-panel>
<script>
    this.mixin('component')
    
    var tag = this
    var panel = null

    var $ = tag.$
    var el = $.element(tag.root)
    var mask = $.window.mask

    var variants = ['temporary', 'persistent']
    var anchors = ['left', 'right']

    var doc = $.element(document.body)

    var handleResize, handleTemporary, onTemporaryClick, onPanelCreated, onPanelClosed, onPanelOpend

    // anchor.
    tag.property(
        'anchor',
        function() { return el.classes.contains('right') ? 'right' : 'left' },
        function(val) {
            el.classes.remove(anchors).add(val)
            panel.anchor = val
        }
    )
    
    // animation.
    tag.property(
        'animation',
        function() { return el.classes.contains('animation') },
        function(val) {
            val ? el.classes.add('animation') : el.classes.remove('animation')
            panel.animation = val
        }
    )

    // contentPane.
    tag.property(
        'contentPane',
        function() { return panel.tags['w-pane'] },
        function(opts) {
        }
    )

    // display.
    tag.property(
        'display',
        function() { return el.computedStyle().display },
        function(val) {el.styles.display = val }
    )
    // header.
    tag.property(
        'header',
        function() { return panel.tags['w-header'] },
        function(opts) {
        }
    )

    // height.
    tag.property(
        'height',
        function() { return panel.height },
        function(val) { el.height = panel.height = val }
    )

    // variant.
    tag.property(
        'variant',
        function() { return el.classes.find(variants) },
        function(val) {
            el.classes.remove(variants).add(val)
            handleTemporary(val == 'temporary' && tag.visible)
        }
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
        function() { return panel.width },
        function(val) { panel.width = val }
    )

    close() {
        handleTemporary(false)
        var animation = tag.animation
        var right = tag.variant == 'temporary' && tag.anchor == 'right'
        if(right) {
            if(animation) el.handleTransitionEnd(function() { el.styles.left = '' })
            el.styles.left = $.window.width - el.width + 'px'
        }
        var fn = function() {
            if(right) el.styles.left = animation ? '100%' : ''
            panel.close()
            el.classes.add('close')
        }
        animation ? setTimeout(fn, 0) : fn()
    }

    open() {
        panel.open()
        el.classes.remove('close')
    }

    toggle() { tag.visible ? tag.close() : tag.open() }

    init() {
        if(tag.animation) {
            tag.opts.dataAnimation = true
            el.classes.remove('animation')
        }
        return true
    }
    
    onTemporaryClick = function() { tag.close() }

    handleTemporary = function(val) {
        mask.visible = val
        if(val) mask.on('click', onTemporaryClick)
        else mask.off('click', onTemporaryClick)
    }

    onPanelCreated = function() {
        panel = tag.tags['w-panel']

        panel.on('closed', onPanelClosed)
        panel.on('opened', onPanelOpend)

        tag.variant = tag.variant || 'temporary'
        
        var style = el.computedStyle()

        panel.backgroundColor = style.backgroundColor
        panel.width = style.width

        el.styles.backgroundColor = 'transparent'

        tag.visible = !(style.display == 'none')
        el.styles.display = 'block'

        tag.animation = tag.opts.dataAnimation

        handleResize()

        tag.trigger('created', tag)
    }

    onPanelClosed = function() {
        el.classes.add('close')
        tag.trigger('closed', tag)
    }

    onPanelOpend = function() {
        if(tag.variant == 'temporary') handleTemporary(true)
        el.classes.add('open')
        tag.trigger('opened', tag)
    }

    handleResize = function() {
        var header = tag.header
        var contentPane = tag.contentPane
        if(contentPane) contentPane.height = $.window.height - (header ? header.height : 0)
    }
    el.handleResize(handleResize)

    tag.on('panel-created', onPanelCreated)

</script>
</w-drawer>