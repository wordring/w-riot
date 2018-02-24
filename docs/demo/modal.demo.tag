<modal-demo> 
    <h1>Modal</h1>

    <h2>Default</h2>
    <button data-is="w-button" ref='button' class="raised primary">
        Click.
    </button>
<script>
    this.mixin('modal')

    var tag = this

    tag.on('mount', function() {
        tag.refs.button.on('click', function() { tag.modal.visible = true })
        tag.modal.on('click', function() { tag.modal.visible = false })
    })
</script>
</modal-demo>