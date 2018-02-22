<w-container>
    <yield/>
<script>
    this.mixin('component')
    var tag = this

    var $ = tag.$
    var el = $.element(tag.root)

    var animation = false
    var drawer = { left: null, right: null, primary: null, secondary: null }
    var resize = { min: 0, max: 0 }

    var update = null

    tag.property(
        'animation',
        function() { return el.classes.contains('animation') },
        function(val) { val ? el.classes.add('animation') : el.classes.remove('animation') }
    )

    tag.property(
        'pane',
        function() {
            var result = tag.tags['w-pane']
            return Array.isArray(result) ? result[0] : result
        } 
    )

    tag.property(
        'drawers',
        function() {
            var result = tag.tags['w-drawer']
            return Array.isArray(result) ? result : [result] }
    )

    tag.property(
        'footer',
        function() {
            var result = tag.tags['w-footer']
            return Array.isArray(result) ? result[0] : result
        }
    )

    tag.property(
        'header',
        function() {
            var result = tag.tags['w-header']
            result = Array.isArray(result) ? result[0] : result
            return result
        } 
    )
    
    tag.property(
        'width',
        function() { return el.width },
        function(val) { el.width = val }
    )

    var handleResize = function(h, w) {
        if(!resize.min && !resize.max) return

        var pane = tag.pane
        if(!pane) return

        var ds1 = 300 // todo
        var ds2 = 300 // todo

        var bp1 = 0
        var bp2 = 0
        var variant = null

        if(resize.min) {
            bp1 = resize.min + ds1 + ds2
            bp2 = resize.min + ds2
            if(el.width <= bp1 && drawer.secondary) {
                if(drawer.secondary.variant == 'persistent') drawer.secondary.visible = false
                drawer.secondary.variant = 'temporary'
            }
            if(el.width <= bp2 && drawer.primary) {
                if(drawer.primary.variant == 'persistent') drawer.primary.visible = false
                drawer.primary.variant = 'temporary'
            }
        }
        if(resize.max && 0 < w) {
            bp1 = resize.max + ds1 + ds2
            bp2 = resize.max + ds2
            if(bp2 <= el.width && drawer.primary) {
                drawer.primary.variant = 'persistent'
                drawer.primary.visible = true
            }
            if(bp1 <= el.width && drawer.secondary) {
                drawer.secondary.variant = 'persistent'
                drawer.secondary.visible = true
            }
        }
    }

    update = function() {
        var header = tag.header
        var pane = tag.pane
        var footer = tag.footer

        var w = tag.width
        if(drawer.left) w -= drawer.left.width
        if(drawer.right) w -= drawer.right.width

        if(header && drawer.left) header.margin = { left: drawer.left.width + 'px' }
        if(header && drawer.right) header.margin = { right: drawer.right.width + 'px' }

        if(pane) { pane.margin = { top: header.height + 'px' } }

        handleResize()
    }

    var toArray = function(val) { return Array.isArray(val) ? val : [val] }

    tag.on('mount', function() {
        if(2 < toArray(tag.tags['w-drawer']).length) throw new Error
        if(1 < toArray(tag.tags['w-header']).length) throw new Error
        if(1 < toArray(tag.tags['w-pane']).length) throw new Error
        if(1 < toArray(tag.tags['w-footer']).length) throw new Error

        animation = tag.animation
        tag.animation = false
    })

    mounted() {
        var drawers = tag.drawers
        for(var i = 0; i < drawers.length; i++) {
            var d = drawers[i]
            var priority = d.priority
            if(priority) drawer[priority] = d
            drawer[d.anchor] = d
            d.on('update', update)
        }
        for(var j = 0; j < drawers.length; j++) {
            d = drawers[j]
            if(!d.priority) {
                if(!drawer.primary) drawer.primary = d
                else drawer.secondary = d
            }
        }
        if(tag.header) tag.header.on('update', update)
        if(tag.footer) tag.footer.on('update', update)
        
        if(tag.pane) {
            var size = tag.pane.opts.dataHandleResize
            if(size) {
                var min = size.match(/min\:\s*(\d+)/)
                if(min) resize.min = Number(min[1])
                var max = size.match(/max\:\s*(\d+)/)
                if(max) resize.max = Number(max[1])
            }
        }

        setTimeout(function() {
            for(var k = 0; k < drawers.length; k++) { drawers[k].animation = animation }
            tag.header.animation = animation
            tag.animation = animation
        }, 0)
        
        update()
        if(resize.min || resize.max) {
            handleResize()
            el.handleResize(handleResize)
        }
    }
    tag.on('update', update)

</script>
</w-container>