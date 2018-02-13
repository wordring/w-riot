<w-icon>
    <yield/>
<script>
    this.component = 'icon'

    this.mixin('Component')
    
    var tag = this

    var el = tag.root

    tag.on('hide', function() {
        el.style.display = 'none'
    })
    tag.on('show', function() {
        el.style.display = ''
    })
</script>
</w-icon>