/* global $:false */

import BrowseMenu from './BrowseMenu';

class Navbar {
    constructor() {
        this.browse = new BrowseMenu();
    }
    get about() {
        return $( 'a.navbar-item=About' );
    }

    get home() {
        return $( 'h1.enm-logo' );
    }

    get search() {
        return $( 'a.navbar-item=Search' );
    }
}

export default Navbar;
