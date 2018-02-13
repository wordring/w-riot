<w-pane>
    <yield/>
<script>
    this.component = 'pane'
    this.mixin('Component')

    var tag = this

    var $ = tag.wordring
    var el = tag.root

    // height.
    getHeight() { return $.height(el) }
    setHeight(val) { $.height(el, val) }
    $.defineProperty(tag, 'height', tag.getHeight, tag.setHeight)

</script>
</w-pane>