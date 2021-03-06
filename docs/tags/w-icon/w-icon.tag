<w-icon>
    <yield/>
<script>
    this.mixin('component')
    
    var tag = this

    var $ = tag.$
    var el = $.element(tag.root)

    tag.property(
        'value',
        function() { return tag.root.innerText },
        function(val) { tag.root.innerText = val }
    )
    
    tag.property(
        'visible',
        function() { return el.styles.display != 'none' },
        function(val) { el.styles.display = val ? '' : 'none' }
    )
    
    tag.on('update', function() { if(tag.opts.dataValue) tag.value = tag.opts.dataValue })
    tag.on('mount', function() { if(tag.opts.dataValue) tag.value = tag.opts.dataValue })
</script>
</w-icon>