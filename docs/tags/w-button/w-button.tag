<w-button onclick={onClick}>
    <w-ripple ref="ripple" class="center middle"/>
    <yield/>
<script>
    this.component = 'button'

    this.mixin('Component')
    
    var tag = this
    var ripple = null

    var $ = tag.wordring
    var el = tag.root

    onClick(ev) {
        tag.trigger('clicked')
    }

    onMount() {
        ripple = tag.refs.ripple
        tag.onUpdate()
    }

    onUpdate() {
        ripple.root.style.color = tag.opts.dataRippleColor
    }

    tag.on('mount', tag.onMount)
    tag.on('update', tag.onUpdate)

</script>
</w-button>