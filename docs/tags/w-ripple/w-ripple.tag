<w-ripple>
    <span ref="effect"></span>
    <yield/>
<script>
    this.component = 'ripple'

    this.mixin('Component')

    var $ = this.wordring
    var el = this.root
    var effect = null

    var tag = this

    tag.color = tag.opts.dataColor || ''

    onMousedown(ev) {
        // chromeにおいてeffectの大きさが取得できなかったため、
        // w-rippleの大きさで代用した。
        // 現在の値はeffectの大きさがw-rippleの二倍であることを
        // 前提としている。
        // cssを変更する場合、セットでこの部分も変更する必要がある。
        // 例）effect.style.left = (ev.offsetX - $.width(effect) / 2) + 'px'
        // なぜ取得できないのか調査中。（アニメーションなのかcssを%指定しているからか）
        effect.style.left = (ev.offsetX - $.width(el)) + 'px'
        effect.style.top = (ev.offsetY - $.height(el)) + 'px'

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

        effect.style.background = tag.opts.dataColor || ''
        el.addEventListener('mousedown', tag.onMousedown)

        if(window.AnimationEvent) {
            tag.refs.effect.addEventListener('animationend', tag.onAnimationEnd, false)
        }
    })
</script>
</w-ripple>