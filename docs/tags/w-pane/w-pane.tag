<w-pane>
    <yield/>
<script>
    this.mixin('component')
    
    var tag = this

    var $ = tag.$
    var el = $.element(tag.root)

    // height.
    tag.property(
        'height',
        function() { return el.height },
        function(val) { el.height = val }
    )
    // width.
    tag.property(
        'width',
        function() { return el.width },
        function(val) { el.width = val }
    )

</script>
</w-pane>