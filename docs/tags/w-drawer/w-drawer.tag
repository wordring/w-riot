<w-drawer>
    <w-panel data-observer={this} data-trigger="created:panel-created">
        <yield/>
    </w-panel>
<script>
    this.mixin('component')
    
    var tag = this
    var panel = null

    var $ = tag.$
    var el = $.element(tag.root)

    var variants = ['temporary', 'persistent']
    var anchors = ['left', 'right']

    var doc = $.element(document.body)
    doc.styles.height = '100%'

    // anchor.
    tag.property(
        'anchor',
        function() { return panel.anchor },
        function(val) {
            el.classes.remove(anchors).add(val)
            panel.anchor = val
        }
    )

    // contentPane.
    tag.property(
        'contentPane',
        function() { return panel.tags['w-pane'] },
        function(opts) {
        }
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
        function(val) { el.classes.remove(variants).add(val) }
    )

    // visible.
    tag.property(
        'visible',
        function() { return !el.classes.contains('close') },
        function(val) {
            val ? tag.open() : tag.close()
            if(!val) el.classes.add('close')
        }
    )

    // width.
    tag.property(
        'width',
        function() { return panel.width },
        function(val) { _width = panel.width = val }
    )

    close() {
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
    }

    open() {
        panel.open()
        el.classes.remove('close')
    }

    toggle() { tag.visible ? tag.close() : tag.open() }

    init() { return true }

    onPanelCreated() {
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
    }

    onPanelClosed() {
        el.classes.add('close')
        tag.trigger('closed', tag)
    }

    onPanelOpend() {
        el.classes.add('open')
        tag.trigger('opened', tag)
    }

    handleResize() {
        var header = tag.header
        var contentPane = tag.contentPane
        if(contentPane) contentPane.height = $.window.height - (header ? header.height : 0)
    }
    el.handleResize(tag.handleResize)

    tag.on('panel-created', tag.onPanelCreated)

</script>
</w-drawer>