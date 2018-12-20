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
        $( 'a.navbar-link=Browse' ).moveToObject( 0, 0 );
    };
}

export default NavbarBrowseMenu;
