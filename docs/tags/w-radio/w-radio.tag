<w-radio onclick={onClick}>
    <w-icon data-value={face}></w-icon>
<script>
    this.mixin('component')
    this.mixin('ripple')

    var tag = this
    var $ = tag.$
    var el = $.element(tag.root)

    var face = { checked: 'radio_button_checked', unchecked: 'radio_button_unchecked' }

    tag.property(
        'checked',
        function() { return el.classes.contains('checked') },
        function(val) { checked(val) }
    )

    tag.property(
        'color',
        function() {
            return tag.disabled ? '' : (tag.checked ? (el.computedStyle().color || '') : '')
        },
        function(val) {
            el.styles.color = val
            update()
        }
    )

    tag.property(
        'disabled',
        function () { return el.classes.contains('disabled') },
        function (val) {
            val ? el.classes.add('disabled') : el.classes.remove('disabled')
            update()
        }
    )

    tag.property(
        'face',
        function () { return tag.checked ? face.checked : face.unchecked }
    )

    toggle() { tag.checked = !tag.checked }

    onClick(ev) {
        ev.preventUpdate = true
        tag.toggle()
        tag.trigger('click')
    }

    var checked = function(val, force) {
        if(tag.checked == val || tag.disabled) return
        if(tag.group && !val && tag.checked && !force) return
        if(tag.group) tag.group.trigger('checked', val)
        val ? el.classes.add('checked') : el.classes.remove('checked')
        tag.trigger('checked', val)
        update()
    }

    var update = function() { tag.tags['w-icon'].update() }

    if(tag.group) tag.group.on('checked', function(val) { checked(false, true) })
</script>
</w-radio>