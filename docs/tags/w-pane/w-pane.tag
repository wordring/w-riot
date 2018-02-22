<w-pane>
    <yield/>
<script>
    this.mixin('component')
    
    var tag = this

    var $ = tag.$
    var el = $.element(tag.root)

    tag.property(
        'height',
        function() { return el.height },
        function(val) { el.height = val }
    )
    
    tag.property(
        'margin',
        function() {
            return {
                left: el.styles.marginLeft,　right: el.styles.marginRight,
                top: el.styles.marginTop,　bottom: el.styles.marginBottom
            }
        },
        function(val) {
            for(var key in val) {
                el.styles['margin' + key.substring(0, 1).toUpperCase() + key.substring(1)] = val[key]
            }
        }
    )

    tag.property(
        'minWidth',
        function() { return Number(el.computedStyle().minWidth.replace(/px$/, '')) },
        function(val) { el.styles.minWidth = val }
    )

    tag.property(
        'padding',
        function() {
            return {
                left: el.styles.paddingLeft,　right: el.styles.paddingRight,
                top: el.styles.paddingTop,　bottom: el.styles.paddingBottom
            }
        },
        function(val) {
            for(var key in val) {
                el.styles['padding' + key.substring(0, 1).toUpperCase() + key.substring(1)] = val[key]
            }
        }
    )

    tag.property(
        'width',
        function() { return el.width },
        function(val) { el.width = val }
    )

</script>
</w-pane>