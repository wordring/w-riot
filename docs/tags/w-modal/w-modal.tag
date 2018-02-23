<w-modal onclick={click}>
<script>
    this.mixin('component')
    
    var tag = this

    var $ = tag.$
    var el = $.element(tag.root)

    tag.property(
        'depth',
        function() { return Number(el.computedStye().zIndex) },
        function(val) { el.styles.zIndex = val }
    )
    tag.property(
        'visible',
        function() { return !el.classes.contains('close') },
        function(val) {
            if(val) {
                el.styles.display = 'block'
                el.classes.add('close')
                setTimeout(function() { el.classes.remove('close') }, 0)
            } else {
                el.classes.add('close')
                el.handleTransitionEnd(function() { el.styles.display = '' })
            }
        }
    )

    click() { tag.trigger('click', tag) }

    el.classes.add('close')
</script>
</w-modal>