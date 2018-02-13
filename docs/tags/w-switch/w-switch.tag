<w-switch>
    <div ref="track"></div>
    <div ref="container" onclick={onClick}>
        <w-ripple ref="ripple" class="circle"/>
        <div ref="thumb"></div>
    </div>
<script>
    this.component = 'switch'

    this.mixin('Component')

    var tag = this

    var $ = tag.wordring
    var el = tag.root

    // checked.
    getChecked() { return tag.value == 'on' }
    setChecked(val) { tag.value = val ? 'on' : 'off' }
    $.defineProperty(tag, 'checked', tag.getChecked, tag.setChecked)

    // color.
    getColor() {
        var style = window.getComputedStyle(el, '')
        var color = style.color || ''
        color = tag.checked ? color : ''
        return tag.disabled ? '' : color
    }
    setColor(val) {
        tag.refs.track.style.backgroundColor = tag.refs.thumb.style.backgroundColor = val
    }
    $.defineProperty(tag, 'color', tag.getColor, tag.setColor)

    // disabled.
    getDisabled() { return $.hasClass(el, 'disabled') }
    setDisabled(val) {
        if(val === true) $.addClass(el, 'disabled')
        else {
            $.removeClass(el, 'disabled')
            tag.color = tag.color
        }
    }
    $.defineProperty(tag, 'disabled', tag.getDisabled, tag.setDisabled)

    // value.
    getValue() { return $.hasClass(el, 'on') ? 'on' : 'off' }
    setValue(val) {
        var ary = ['on', 'off']
        if(ary.indexOf(val) == -1) throw TypeError

        $.handleTransitionEnd(el, tag.handleTransitionEnd)
        tag.transition = true
        
        $.removeClass(el, val == 'on' ? 'off' : 'on')
        $.addClass(el, val)
        
        tag.color = tag.color
    }
    $.defineProperty(tag, 'value', tag.getValue, tag.setValue)

    getTransition() { return $.hasClass(el, 'animation') }
    setTransition(val) {
        if(val) $.addClass(el, 'animation')
        else $.removeClass(el, 'animation')
    }
    $.defineProperty(tag, 'transition', tag.getTransition, tag.setTransition)

    toggle() {
        if(tag.disabled) return
        tag.checked = !tag.checked
    }

    handleTransitionEnd() {
        tag.transition = false
    }

    onClick(ev) {
        tag.toggle()
        tag.trigger('clicked')
    }

    onMount() {
        if(!$.hasClass(el, 'on')) $.addClass(el, 'off')
        tag.color = tag.color
    }

    tag.on('mount', tag.onMount)
    
</script>
</w-switch>