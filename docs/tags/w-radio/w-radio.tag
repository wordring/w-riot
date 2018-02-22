<w-radio onclick={onClick}>
    <w-icon data-value={face}></w-icon>
<script>
    this.mixin('component')
    this.mixin('ripple')

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

    tag.property(
        'face',
        function () {
             return (tag.checked && !tag.disabled) ? 'radio_button_checked' : 'radio_button_unchecked' }
    )

    toggle() { if(!tag.disabled) tag.checked = !tag.checked }

    onClick(ev) {
        tag.toggle()
        tag.trigger('click')
    }

    mounted() {
        tag.checked = tag.checked
    }

    tag.on('update', function() { })
    
</script>
</w-radio>