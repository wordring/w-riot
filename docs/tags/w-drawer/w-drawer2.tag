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

    var _height = 0
    var _width = 0
    var _temporary = false

    var doc = $.element(document.body)
    doc.styles.overflowX = 'hidden'
    doc.styles.height = '100%'

    // anchor.
    tag.property(
        'anchor',
        function() { return el.classes.find(anchors) },
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
    })

    // header.
    tag.property(
        'header',
        function() { return panel.tags['w-header'] },
        function(opts) {
    })

    // height.
    tag.property(
        'height',
        function() { return el.height },
        function(val) { _height = el.height = panel.height = val }
    )

    // variant.
    tag.property(
        'variant',
        function() { return el.classes.find(variants) },
        function(val) {
            el.classes.remove(variants).add(val)
            el.styles.minWidth = tag.width || ''
        }
    )

    // visible.
    tag.property(
        'visible',
        function() { return !el.classes.contains('close') },
        function(val) {
            val ? tag.open() : tag.close()
            el.classes.add(val ? 'open' : 'close')
        }
    )

    // width.
    tag.property(
        'width',
        function() { return panel.width },
        function(val) { _width = panel.width = val }
    )

    close() {
        panel.close()
        el.styles.minWidth = el.styles.width = '0px'
        el.classes.remove('open')
    }

    open() {
        panel.open()
        el.styles.minWidth = el.styles.width = _width
        el.classes.remove('close')
    }

    toggle() { tag.visible ? tag.close() : tag.open() }

    init() { return true }

    onPanelCreated() {
        panel = tag.tags['w-panel']

        panel.on('closed', tag.onPanelClosed)
        panel.on('opened', tag.onPanelOpend)

        tag.anchor = tag.anchor || 'left'
        tag.variant = tag.variant || 'temporary'
        
        var style = el.computedStyle()
        _height = style.height
        _width = style.width

        el.styles.display = 'block'

        panel.backgroundColor = style.backgroundColor
        el.styles.backgroundColor = 'transparent'

        tag.width = style.width

        tag.visible = style.display == 'none' ? false : true
        tag.handleResize()

        tag.trigger('created', tag)
    }

    onPanelClosed() {
        el.classes.add('close')
        tag.handleResize()
        tag.trigger('closed', tag)
    }

    onPanelOpend() {
        el.classes.add('open')
        tag.handleResize()
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