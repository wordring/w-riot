<w-ripple>
    <span ref="effect"></span>
    <yield/>
<script>
    this.component = 'ripple'

    this.mixin('Component')

    var $ = this.wordring

    var tag = this

    var el = tag.root
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

        if(!$.hasClass(effect, 'active')) {
            $.addClass(effect, 'active')
            if(!window.AnimationEvent) setTimeout(tag.onAnimationEnd, 500)
        }
    }

    onAnimationEnd(ev) { 
        $.removeClass(effect, 'active')
    }
    
    tag.on('mount', function() {
        effect = tag.refs.effect

        var style = window.getComputedStyle(el, '')
        effect.style.backgroundColor = style.backgroundColor
        el.style.backgroundColor = 'transparent'

        el.addEventListener('mousedown', tag.onMousedown)

        if(window.AnimationEvent) {
            tag.refs.effect.addEventListener('animationend', tag.onAnimationEnd, false)
        }
    })
</script>
</w-ripple>