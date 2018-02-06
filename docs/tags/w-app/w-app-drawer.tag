<w-app-drawer>
    <div data-is="w-panel" ref="panel">
        <yield/>
    </div>
<script>
    this.component = 'drawer'

    this.mixin('Component')

    var tag = this
    var $ = tag.wordring

    var el = tag.root
    var panel = null

    var pane = null
    var header = null

    close() {
        panel.close()
    }

    header(val) {
        if(val) header = val
        return header
    }

    isLeft() { return $.hasClass(el, 'left') }

    isTemporary_() { return $.hasClass(el, 'temporary') }

    isOpen() { return !$.hasClass(el, 'close') }

    open() {
        panel.open()
        $.removeClass(el, 'close')
    }

    pane(val) {
        if(val) pane = val
        return pane
    }

    temporary(flg) {
        if(typeof flg == 'undefined') return $.hasClass(el, 'temporary')

        if(flg) { // temporary
            $.addClass(el, 'temporary')
            $.removeClass(el, 'persistent')
        } else { // persistent
            $.addClass(el, 'persistent')
            $.removeClass(el, 'temporary')
        }
    }

    toggle() { tag.isOpen() ? tag.close() : tag.open() }

    onPanelClosed() {
        tag.onResize()
        $.addClass(el, 'close')
        tag.trigger('closed', tag)
    }

    onPanelMount() {
        var bgColor = window.getComputedStyle(el, '').backgroundColor
        el.style.backgroundColor = 'transparent'
        el.style.display = 'block'

        panel.backgroundColor(bgColor)
        panel.height('100%')
        if(!$.hasClass(el, 'right')) panel.anchor('left')
        else panel.anchor('right')

        tag.onResize()
    }

    onPanelOpend() {
        tag.onResize()
        tag.trigger('opened', tag)
    }

    onResize() {
        var headerHeight = header ? $.height(header.root) : 0
        if(pane) {
            $.height(pane.root, $.height(el) - headerHeight)
        }
    }

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

</script>
</w-app-drawer>