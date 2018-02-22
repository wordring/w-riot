<w-button-demo>
    <h1>w-button</h1>

    <h2>Flat Button</h2>
    <table>
        <tr>
        <td><w-button>Default</w-button></td>
        <td><w-button class="primary">Primary</w-button></td>
        <td><w-button class="secondary">Secondary</w-button></td>
        <td><w-button disabled>Disabled</w-button></td>
        </tr>
    </table>

    <h2>Raised Button</h2>
    <table>
        <tr>
        <td><w-button class="raised">Default</w-button></td>
        <td><w-button class="raised primary">Primary</w-button></td>
        <td><w-button class="raised secondary">Secondary</w-button></td>
        <td><w-button class="raised" disabled>Disabled</w-button></td>
        </tr>
    </table>

    <h2>Icon Button</h2>
    <table class="icon">
        <tr>
        <td>Default</td>
        <td>Primary</td>
        <td>Secondary</td>
        <td>Disabled</td>
        </tr>
        <tr>
        <td><w-button class="icon"><w-icon>menu</w-icon></w-button></td>
        <td><w-button class="icon primary"><w-icon>menu</w-icon></w-button></td>
        <td><w-button class="icon secondary"><w-icon>menu</w-icon></w-button></td>
        <td><w-button class="icon" disabled><w-icon>menu</w-icon></w-button></td>
        </tr>
    </table>
<style>
    :scope {
        overflow-x: hidden
    }
    .icon td {
        padding: 0 1em;
    }
</style>
</w-button-demo>