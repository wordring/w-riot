<w-header>
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
        function(val) { el.height = val })

</script>
</w-header>