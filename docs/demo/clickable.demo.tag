<clickable-demo>
    <h1>Clickable</h1>

    <h2>Default</h2>
    <div data-is="w-component" ref="pane" data-mixin="clickable">Click me.</div>
<script>
    var tag = this
    var pane = null

    tag.on('mount', function() {
        pane = tag.refs.pane
        pane.on('clicked', function() {
            pane.root.innerText = 'Clicked!'
            pane.root.style.backgroundColor = '#F8BBD0'
            setTimeout(function() {
                pane.root.innerText = 'Click you.'
                pane.root.style.backgroundColor = '#CFD8DC'
            }, 3000)
        })
    })
</script>
<style>
    [ref="pane"] {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100px;
        width: 200px;
        transition-property: background-color;
        transition-duration: 2s;
        background-color: #BBDEFB;
    }
</style>
</clickable-demo>