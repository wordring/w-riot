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

    close() {
        el.style.display = 'block'
        panel.close()
        $.removeClass(el, 'open')
    }

    handleResize() {
        var header = tag.header()
        var pane = tag.pane()

        if(header && pane) {
            $.height(pane.root, $.height(el) - $.height(header.root))
        }
    }

    header() {
        return panel.tags['w-header']
    }

    isLeft() { return $.hasClass(el, 'left') }

    isOpen() { return !$.hasClass(el, 'close') }

    open() {
        tag.handleResize()
        //el.style.display = 'block'
        panel.open()
        $.removeClass(el, 'close')
    }

    pane() {
        return panel.tags['w-pane']
    }

    temporary(flg) {
        if(flg) { // temporary
            $.addClass(el, 'temporary')
            $.removeClass(el, 'persistent')
        } else { // persistent
            $.addClass(el, 'persistent')
            $.removeClass(el, 'temporary')
        }
    }

    toggle() { tag.isOpen() ? tag.close() : tag.open() }

    onMount() {
        panel = tag.refs.panel

        if(el.style.display == 'none') $.addClass(el, 'close')
        else $.addClass(el, 'open')
        panel.root.style.display = el.style.display
        el.style.display = ''

        panel.on('closed', tag.onPanelClosed)
        panel.on('mount', tag.onPanelMount)
        panel.on('opened', tag.onPanelOpend)

        if(!$.hasClass(el, 'right')) $.addClass(el, 'left')
        if(!$.hasClass(el, 'temporary')) $.addClass(el, 'persistent')

        tag.handleResize()
    }

    onPanelClosed() {
        $.addClass(el, 'close')
        tag.trigger('closed', tag)
    }

    onPanelMount() {
        var bgColor = window.getComputedStyle(el, '').backgroundColor
        el.style.backgroundColor = 'transparent'

        panel.backgroundColor(bgColor)
        panel.height('100%')
        if(!$.hasClass(el, 'right')) panel.anchor('left')
        else panel.anchor('right')
    }

    onPanelOpend() {
        $.addClass(el, 'open')
        tag.trigger('opened', tag)
    }

    tag.on('close', tag.close)
    tag.on('mount', tag.onMount)
    tag.on('open', tag.open)
    tag.on('resize', tag.handleResize)
    tag.on('temporary', tag.temporary)
    tag.on('toggle', tag.toggle)

    $.handleResize(tag)

</script>
</w-app-drawer>