<w-panel>
    <div ref="holder">
        <yield/>
    </div>
<script>
    this.component = 'panel'

    this.mixin('Component')

    var tag = this
    var $ = tag.wordring

    var el = tag.root
    var holder = null

    var transition = false

    anchor(to) {
        var ary = ['left', 'right', 'top', 'bottom']
        for(var i = 0; i < ary.length; i++) {
            var atom = 'anchor-' + ary[i]
            if(to) $.removeClass(el, atom)
            else if($.hasClass(el, atom)) return ary[i]
        }
        if(to) $.addClass(el, 'anchor-' + to)
    }

    backgroundColor(color) {
        holder.style.backgroundColor = color
    }

    close() {
        if(transition || !tag.isOpen()) return
        transition = true
        $.addClass(el, 'close')

        function fn() {
            transition = false
            holder.style.position = 'absolute'
            tag.trigger('closed')
        }
        if($.hasClass(holder, 'animation')) $.handleTransitionEnd(holder, fn)
        else fn()
    }

    height(val) {
        $.height(holder, val)
        return $.height(el, val)
    }

    isOpen() { return !$.hasClass(el, 'close') }

    open() {
        if(transition || tag.isOpen()) return
        transition = true
        holder.style.position = ''
        $.removeClass(el, 'close')

        function fn() {
            transition = false
            tag.trigger('opened')
        }
        if($.hasClass(holder, 'animation')) $.handleTransitionEnd(holder, fn)
        else fn()
    }

    toggle() {
        if($.hasClass(el, 'close')) tag.open()
        else tag.close()
    }

    onMount() {
        holder = tag.refs.holder
        if(el.style.display == 'none') {
            tag.close()
            el.style.display = ''
        }
        $.addClass(holder, 'animation')
    }

    tag.on('close', tag.close)
    tag.on('anchor', tag.anchor)
    tag.on('mount', tag.onMount)
    tag.on('open', tag.open)
    tag.on('toggle', tag.toggle)

</script>
</w-panel>