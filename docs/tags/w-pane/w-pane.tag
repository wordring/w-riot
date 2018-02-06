<w-pane>
    <yield/>
<script>
    this.component = 'pane'
    this.mixin('Component')

    var tag = this

    var $ = tag.wordring
    var el = tag.root

    tag.on('mount', function() {
        
    })
</script>
</w-pane>