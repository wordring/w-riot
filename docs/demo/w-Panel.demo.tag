<w-panel-demo>
    <h1>w-panel</h1>
    <h2>Default</h2>
    <w-panel id="default" class="animation" ref="panel">
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
            aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
            sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </P>
    </w-panel>
    <br/>
    <table>
        <tr><td>Anchor</td><td><w-radio ref="left" class="primary" data-group="default"></w-radio></td><td>Left</td></tr>
        <tr><td></td><td><w-radio ref="right" class="primary" data-group="default"></w-radio></td><td>Right</td></tr>
        <tr><td></td><td><w-radio ref="top" class="primary checked" data-group="default"></w-radio></td><td>Top</td></tr>
        <tr><td></td><td><w-radio ref="bottom" class="primary" data-group="default"></w-radio></td><td>Bottom</td></tr>

        <tr><td>Toggle</td><td><w-button ref="toggle"><w-icon>sync</w-icon></w-button></td><td></td></tr>
    </table>
<script>
    var tag = this

    tag.on('mount', function() {
        var panel = tag.refs.panel
        var left = tag.refs.left
        var right = tag.refs.right
        var top = tag.refs.top
        var bottom = tag.refs.bottom

        left.on('checked', function(val) { if(val) panel.anchor = 'left' })
        right.on('checked', function(val) { if(val) panel.anchor = 'right' })
        top.on('checked', function(val) { if(val) panel.anchor = 'top' })
        bottom.on('checked', function(val) { if(val) panel.anchor = 'bottom' })

        tag.refs.toggle.on('click', function() {
            panel.toggle()
            left.disabled = !panel.visible
            right.disabled = !panel.visible
            top.disabled = !panel.visible
            bottom.disabled = !panel.visible
        })
    })
</script>
<style>
    #default {
        background-color: #BBDEFB;
    }
    #default>p {
        padding: 1rem;
    }
    w-button {
        min-width: 48px;
        height: 48px;
        margin: 0;
        padding: 0;
    }
</style>
</w-panel-demo>