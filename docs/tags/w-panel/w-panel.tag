<w-panel>
    <div ref="holder">
        <yield/>
    </div>
<script>
/*
    trigger
        closed(tag)
        opened(tag)
*/
    this.component = 'panel'

    this.mixin('Component')

    var tag = this

    var $ = tag.wordring
    var el = tag.root

    var anchor = ''
    var transition = false

    // anchor.
    getAnchor() { return anchor }
    setAnchor(to) {
        var ary = ['left', 'right', 'top', 'bottom']
        if(ary.indexOf(to) == -1) throw TypeError
        
        anchor = to

        for(var i = 0; i < ary.length; i++) {
            var atom = 'anchor-' + ary[i]
            if(to) $.removeClass(el, atom)
            else if($.hasClass(el, atom)) return ary[i]
        }
        if(to) $.addClass(el, 'anchor-' + to)
    }
    $.defineProperty(tag, 'anchor', tag.getAnchor, tag.setAnchor)

    // bacgroundColor.
    getBackgroundColor() { return tag.refs.holder.style.backgroundColor }
    setBackgroundColor(color) {
        tag.refs.holder.style.backgroundColor = color
    }
    $.defineProperty(tag, 'backgroundColor', tag.getBackgroundColor, tag.setBackgroundColor)

    // height.
    getHeight() { return $.height(tag.refs.holder) }
    setHeight(val) {
        $.height(tag.refs.holder, val)
    }
    $.defineProperty(tag, 'height', tag.getHeight, tag.setHeight)

    // visible.
    getVisible() { return !$.hasClass(el, 'close') }
    setVisible(val) {
        if(val) tag.open()
        else tag.close()
    }
    $.defineProperty(tag, 'visible', tag.getVisible, tag.setVisible)

    // width.
    getWidth() { return $.width(tag.refs.holder) }
    setWidth(val) {
        $.width(tag.refs.holder, val)
    }
    $.defineProperty(tag, 'width', tag.getWidth, tag.setWidth)

    close() {
        if(transition || !tag.visible) return
        transition = true
        $.addClass(el, 'close')

        function fn() {
            transition = false
            tag.refs.holder.style.position = 'absolute'
            tag.trigger('closed', tag)
        }
        if($.hasClass(tag.refs.holder, 'animation')) $.handleTransitionEnd(tag.refs.holder, fn)
        else fn()
    }

    open() {
        if(transition || tag.visible) return
        transition = true
        tag.refs.holder.style.position = ''
        $.removeClass(el, 'close')

        function fn() {
            transition = false
            tag.trigger('opened', tag)
        }
        if($.hasClass(tag.refs.holder, 'animation')) $.handleTransitionEnd(tag.refs.holder, fn)
        else fn()
    }

    toggle() {
        tag.visible = !tag.visible
    }

    onMount() {
        if(el.style.display == 'none') {
            tag.close()
            el.style.display = ''
        }
        $.addClass(tag.refs.holder, 'animation')
    }

    tag.on('mount', tag.onMount)

</script>
</w-panel>