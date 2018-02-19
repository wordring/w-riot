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
        <tr>
            <td>Anchor:</td>
            <td>
                <w-button onclick={left}>
                    <w-icon>chevron_left</w-icon>
                </w-button>
            </td>
            <td>
                <w-button onclick={right}>
                    <w-icon>chevron_right</w-icon>
                </w-button>
            </td>
            <td>
                <w-button onclick={top}>
                    <w-icon>expand_less</w-icon>
                </w-button>
            </td>
            <td>
                <w-button onclick={bottom}>
                    <w-icon>expand_more</w-icon>
                </w-button>
            </td>
        </tr>
        <tr>
            <td>Toggle:</td>
            <td>
                <w-button  onclick={refs.panel.toggle}>
                    <w-icon>sync</w-icon>
                </w-button>
            </td>
        </tr>
    </table>

<script>
    left() { this.refs.panel.anchor='left' }
    right() { this.refs.panel.anchor='right' }
    top() { this.refs.panel.anchor='top' }
    bottom() { this.refs.panel.anchor='bottom' }
</script>
<style>
    #default {
        background-color: #BBDEFB;
    }
    #default>p {
        padding: 1rem;
    }
</style>
</w-panel-demo>