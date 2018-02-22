<w-header>
    <yield/>
<script>
    this.mixin('component')
    
    var tag = this

    var $ = tag.$
    var el = $.element(tag.root)

    tag.property(
        'animation',
        function() { return el.classes.contains('animation') },
        function(val) { val ? el.classes.add('animation') : el.classes.remove('animation') }
    )

    tag.property(
        'height',
        function() { return el.height },
        function(val) { el.height = val }
    )

    tag.property(
        'inset',
        function() {
            return {
                left: el.styles.paddingLeft,　right: el.styles.paddingRight,
                top: el.styles.paddingTop,　bottom: el.styles.paddingBottom
            }
        },
        function(val) { for(var key in val) { el.styles['padding-' + key] = val[key] }
        }
    )

    tag.property(
        'margin',
        function() {
            return {
                left: el.styles.marginLeft,　right: el.styles.marginRight,
                top: el.styles.marginTop,　bottom: el.styles.marginBottom
            }
        },
        function(val) { for(var key in val) { el.styles['margin-' + key] = val[key] } }
    )

    tag.property(
        'position',
        function() { return el.computedStyle().position },
        function(val) { el.styles.position = val }
    )

</script>
</w-header>