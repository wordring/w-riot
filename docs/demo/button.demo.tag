<button-demo>
    <h1>Button</h1>

    <h2>Default</h2>
    <div class="container">
        <div data-is="w-component" ref="button" data-mixin="button">Button</div>
    </div>
<script>
    var tag = this
    var button = null

    tag.on('mount', function() {
        button = tag.refs.button
        button.on('clicked', function() {
            button.root.innerText = 'Clicked!'
            setTimeout(function() {
                button.root.innerText = 'Button'
            }, 3000)
        })
    })
</script>
<style>
    [ref="button"] {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100px;
        width: 200px;
    }
    .container {
        height: 100px;
        width: 200px;
        background-color: #BBDEFB;
    }
</style>
</button-demo>