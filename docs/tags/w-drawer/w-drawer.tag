<w-drawer>
    <w-panel ref="panel">
        <yield/>
    </w-panel>
<script>
    this.component = 'drawer'

    this.mixin('Component')

    var tag = this
    var panel = null

    var $ = tag.wordring
    var el = tag.root

    document.body.style.overflowX = 'hidden'

    // anchor.
    getAnchor() {
        if($.hasClass(el, 'left')) return 'left'
        if($.hasClass(el, 'right')) return 'right'
        return null
    }
    setAnchor(to) {
        var ary = ['left', 'right']
        if(ary.indexOf(to) == -1) throw TypeError
        $.removeClass(el, to=='left' ? 'left' : 'right')
        $.addClass(el, to)
    }
    $.defineProperty(tag, 'anchor', tag.getAnchor, tag.setAnchor)

    // contentPane.
    getContentPane() { return panel.tags['w-pane'] }
    setContentPane(opts) {
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
    }
    $.defineProperty(tag, 'contentPane', tag.getContentPane, tag.setContentPane)

    // header.
    getHeader() { return panel.tags['w-header'] }
    setHeader(opts) {
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
    }
    $.defineProperty(tag, 'header', tag.getHeader, tag.setHeader)

    // height.
    getHeight() { return $.height(el) }
    setHeight(val) {
        $.height(el, val)
        panel.height = val
    }
    $.defineProperty(tag, 'height', tag.getHeight, tag.setHeight)

    // temporary.
    getTemporary() { return $.hasClass(el, 'temporary') }
    setTemporary(val) {
        $.removeClass(el, val ? 'persistent' :  'temporary')
        $.addClass(el, val ? 'temporary' : 'persistent')
    }
    $.defineProperty(tag, 'temporary', tag.getTemporary, tag.setTemporary)

    // visible.
    getVisible() { return !$.hasClass(el, 'close') }
    setVisible(val) {
        if(val) tag.open()
        else tag.close()
    }
    $.defineProperty(tag, 'visible', tag.getVisible, tag.setVisible)

    // width.
    getWidth() { return panel.width }
    setWidth(val) { panel.width = val }
    $.defineProperty(tag, 'width', tag.getWidth, tag.setWidth)

    close() {
        el.style.display = 'block'
        panel.close()
        $.removeClass(el, 'open')
    }

    open() {
        panel.open()
        $.removeClass(el, 'close')
    }

    toggle() { tag.visible = !tag.visible }

    handleResize() {
        var header = tag.header
        var contentPane = tag.contentPane

        var height = tag.height
        var headerHeight = header ? header.height : 0
        var contentPaneHeight = height - headerHeight

        if(contentPane) contentPane.height = contentPaneHeight
    }

    onMount() {
        panel = tag.refs.panel
        panel.on('closed', tag.onPanelClosed)
        panel.on('created', tag.onPanelCreated)
        panel.on('opened', tag.onPanelOpend)
    }

    onPanelClosed() {
        $.addClass(el, 'close')
        el.style.minWidth = ''
        tag.trigger('closed', tag)
    }

    onPanelCreated() {
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
    }

    onPanelOpend() {
        $.addClass(el, 'open')
        el.style.minWidth = tag.width + 'px'
        tag.trigger('opened', tag)
        tag.handleResize()
    }

    tag.on('close', tag.close)
    tag.on('mount', tag.onMount)
    tag.on('open', tag.open)
    tag.on('resize', tag.handleResize)
    tag.on('temporary', tag.temporary)
    tag.on('toggle', tag.toggle)

    $.handleResize(tag)

</script>
</w-drawer>