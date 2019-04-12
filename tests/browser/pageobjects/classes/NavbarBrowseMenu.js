/* global $:false */

class NavbarBrowseMenu {
    get _element() {
        return $( 'a.navbar-link=Browse' );
    }

    get allTopics() {
        return $( 'a.navbar-item=All topics' );
    }

    get featuredTopics() {
        return $( 'a.navbar-item=Featured topics' );
    }

    click() {
        this._element.click();
    };

    expand() {
        // Call .moveTo on some element other than Browse before calling
        // .moveToObject on Browse.  This fixes "Feature Topics" test failure in
        // Firefox.  The working theory is that the previous test also calls this
        // method and leaves the mouse cursor on the Browse menu, perhaps nullifying
        // the .moveTo in the subsequent test.
        // See https://jira.nyu.edu/jira/browse/NYUP-542
        $( 'a.navbar-item=About' ).moveTo( 0, 0 );
        $( 'a.navbar-link=Browse' ).moveTo( 0, 0 );
    };
}

export default NavbarBrowseMenu;
