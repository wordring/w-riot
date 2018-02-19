<w-pane-demo>
    <h1>w-pane</h1>

    <h2>Left Fill Right</h2>
    <w-pane>
        <span class="left">1 Left</span>
        <span class="fill">2 Fill</span>
        <span class="right">3 Right</span>
    </w-pane>

    <h2>Left Left Left</h2>
    <w-pane>
        <span class="left">1 Left</span>
        <span class="left">2 Left</span>
        <span class="left">3 Left</span>
    </w-pane>

    <h2>Fill Left</h2>
    <w-pane>
        <span class="fill">1 Fill</span>
        <span class="left">2 Left</span>
    </w-pane>

    <h2>Vertical</h2>
    <w-pane class="vertical">
        <span style="background-color:#BBDEFB;">1</span>
        <span style="background-color: #CFD8DC;">2</span>
        <span style="background-color: #F8BBD0;">3</span>
    </w-pane>
<style>
    span {
        padding: 1rem;
    }
    .left {
        background-color: #BBDEFB;
    }
    .right {
        background-color: #CFD8DC;
    }
    .fill {
        background-color: #F8BBD0;
    }
</style>
</w-pane-demo>