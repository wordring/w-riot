<w-switch-track>
</w-switch-track>

<w-switch-container>
<script>
    this.mixin('component')
    this.color = parent.color
</script>
</w-switch-container>

<w-switch-thumb>
</w-switch-thumb>

<w-switch>
    <w-switch-track style="background-color:{color};" />
    <w-switch-container data-mixin="ripple" color={color} onclick={onClick}>
        <w-switch-thumb style="background-color:{parent.color};" />
    </w-switch-container>
<script>
    this.mixin('component')

    var tag = this

    var $ = tag.$
    var el = $.element(tag.root)

    tag.property(
        'checked',
        function() { return el.classes.contains('checked') },
        function(val) {
            val ? el.classes.add('checked') : el.classes.remove('checked')
            tag.update()
            tag.trigger('change', tag)
        }
    )

    tag.property(
        'color',
        function() {
            var style = el.computedStyle()
            return tag.disabled ? '' : (tag.checked ? (style.color || '') : '')
        },
        function(val) {
            el.styles.backgroundColor = val
            tag.update()
        }
    )

    tag.property(
        'disabled',
        function () { return el.classes.contains('disabled') },
        function (val) {
            val ? el.classes.add('disabled') : el.classes.remove('disabled')
            tag.update()
        }
    )

    toggle() { if(!tag.disabled) tag.checked = !tag.checked }

    onClick(ev) {
        tag.toggle()
        tag.trigger('click')
    }

    mounted() {
        tag.checked = tag.checked
    }
    
</script>
</w-switch>