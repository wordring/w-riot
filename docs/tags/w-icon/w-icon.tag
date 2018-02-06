<w-icon onclick={ onClick }>
    <yield/>
<script>
    this.component = 'icon'

    this.mixin('Component')
    
    var tag = this

    var el = tag.root

    onClick() { tag.trigger('click') }

    tag.on('hide', function() {
        el.style.display = 'none'
    })
    tag.on('show', function() {
        el.style.display = ''
    })
</script>
</w-icon>