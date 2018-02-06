<w-app>

<script>
    this.component = 'app'
    this.mixin('Component')

    var tag = this
    var $ = tag.wordring
    var el = tag.root

    tag.leftDrawer = null // app-drawer
    tag.rightDrawer = null // app-drawer
    tag.appPane = null // app-pane

    onDrawerClose(drawer) {
        var pos = drawer.isLeft() ? 'left' : 'right'
    }

    onDrawerMount(drawer) {
        if(drawer.isLeft()) tag.leftDrawer = drawer
        else tag.rightDrawer = drawer
    }

    onDrawerOpen(drawer) {
        var pos = drawer.isLeft() ? 'left' : 'right'
    }

    onMount() {
    }

    onPaneMount(appPane) {
        tag.appPane = appPane
    }

    onUpdate() {
        ;
    }

    tag.on('drawer-close', tag.onDrawerClose)
    tag.on('drawer-mount', tag.onDrawerMount)
    tag.on('drawer-open', tag.onDrawerOpen)
    tag.on('pane-mount', tag.onPaneMount)

    tag.on('mount', tag.onMount)
</script>
</w-app>
