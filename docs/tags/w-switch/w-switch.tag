<w-switch>
    <div ref="track"></div>
    <div ref="container" data-mixin="ripple" onclick={onClick}>
        <div ref="thumb"></div>
    </div>
<script>
    this.mixin('component')

    var tag = this
    var container = null

    var $ = tag.$
    var el = $.element(tag.root)
    var track = null
    var thumb = null

    // checked.
    tag.property(
        'checked',
        function() { return el.classes.contains('checked') },
        function(val) {
            el.handleTransitionEnd(tag.handleTransitionEnd)
            tag.transition = true
            if(val) el.classes.add('checked')
            else el.classes.remove('checked')
            tag.color = tag.color
    })

    // color.
    tag.property(
        'color',
        function() {
            var style = el.computedStyle()
            return tag.disabled ? '' : (tag.checked ? (style.color || '') : '')
        },
        function(val) { track.styles.backgroundColor = thumb.styles.backgroundColor = val }
    )

    // disabled.
    tag.property(
        'disabled',
        function () { return el.classes.contains('disabled') },
        function (val) {
            if(val) el.classes.add('disabled')
            else {
                el.classes.remove('disabled')
                tag.color = tag.color
            }
    })

    // transition.
    tag.property(
        'transition',
        function() { return el.classes.contains('animation') },
        function(val) {
            if(val) el.classes.add('animation')
            else el.classes.remove('animation')
    })

    toggle() {
        if(!tag.disabled) tag.checked = !tag.checked
    }

    handleTransitionEnd() {
        tag.transition = false
    }

    onClick(ev) {
        tag.toggle()
        tag.trigger('clicked')
    }

    init() {
        container = riot.mount(tag.refs.container, 'w-component')[0]
        track = $.element(tag.refs.track)
        thumb = $.element(container.refs.thumb)
        tag.color = tag.color
    }
    
</script>
</w-switch>