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
        // This method has historically been tricky to implement for Firefox.
        // See:
        //    * https://jira.nyu.edu/jira/browse/NYUP-542
        //    * https://jira.nyu.edu/jira/browse/NYUP-619
        $( 'a.navbar-link=Browse' ).moveTo();
    };
}

export default NavbarBrowseMenu;
