<w-pane>
    <yield/>
<script>
    this.component = 'pane'
    this.mixin('Component')

    var tag = this

    var $ = tag.wordring
    var el = tag.root

    var container = null

    onMount() {
    }

    tag.on('mount', tag.onMount)
</script>
</w-pane>