<w-ripple>
    <span ref="effect"></span>
<script>
    this.component = 'ripple'

    this.mixin('Component')

    var $ = this.wordring

    var tag = this

    var el = tag.root
    var parent = null
    var effect = null

    onMousedown(ev) {
        var dx = Math.max($.width(el), $.height(el)) * 2
        $.width(effect, dx)
        $.height(effect, dx)
        var rect = ev.currentTarget.getBoundingClientRect()
        var x = ev.clientX - rect.left
        var y = ev.clientY - rect.top
        effect.style.left = (x - dx / 2) + 'px'
        effect.style.top = (y - dx / 2) + 'px'

        if(!$.hasClass(el, 'active') && !$.hasClass(el, 'disabled')) {
            $.addClass(el, 'active')
            if(!window.AnimationEvent) setTimeout(tag.onAnimationEnd, 500)
        }
    }

    onAnimationEnd(ev) { 
        $.removeClass(el, 'active')
    }

    onMount() {
        effect = tag.refs.effect

        el.addEventListener('click', tag.onMousedown)
        if(window.AnimationEvent) {
            effect.addEventListener('animationend', tag.onAnimationEnd, false)
        }
        tag.onUpdate()
    }

    onUpdate() {
        parent = el.parentElement

        $.height(el, $.height(parent))
        $.width(el, $.width(parent))

        var style = window.getComputedStyle(el, '')
        effect.style.backgroundColor = style.color
    }
    
    tag.on('mount', tag.onMount)
    tag.on('update', tag.onUpdate)

</script>
</w-ripple>