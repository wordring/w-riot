<group-demo>
    <h1>Group</h1>

    <h2>Default</h2>
    <w-component ref="comp1" data-group="default" data-mixin="clickable">Click me.</w-component>
    <w-component ref="comp2" data-group="default" data-mixin="clickable">Click me.</w-component>
    <w-component ref="comp3" data-group="default" data-mixin="clickable">Click me.</w-component>

<script>
    var tag = this

    tag.on('mount', function() {
        var comp1 = tag.refs.comp1
        var comp2 = tag.refs.comp2
        var comp3 = tag.refs.comp3

        comp1.on('click', function() { comp1.group.trigger('msg') })
        comp2.on('click', function() { comp2.group.trigger('msg') })
        comp3.on('click', function() { comp3.group.trigger('msg') })

        comp1.group.on('msg', function() {
            comp1.root.style.backgroundColor = '#F8BBD0'
            setTimeout(function() { comp1.root.style.backgroundColor = '#CFD8DC' }, 1000)
        })
        comp2.group.on('msg', function() {
            comp2.root.style.backgroundColor = '#F8BBD0'
            setTimeout(function() { comp2.root.style.backgroundColor = '#CFD8DC' }, 1000)
        })
        comp3.group.on('msg', function() {
            comp3.root.style.backgroundColor = '#F8BBD0'
            setTimeout(function() { comp3.root.style.backgroundColor = '#CFD8DC' }, 1000)
        })
    })
</script>
<style>
    w-component {
        display: block;
        float: left;
        height: 100px;
        width: 100px;
        background-color: #CFD8DC;
    }
</style>
</group-demo>