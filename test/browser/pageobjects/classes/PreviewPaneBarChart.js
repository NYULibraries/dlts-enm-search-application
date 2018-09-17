/* global $:false $$:false */

class PreviewPaneBarChart {
    get data() {
        return $$( '.enm-pane-preview svg rect' ).map(
            ( bar ) => {
                return {
                    page   : bar.getAttribute( 'name' ),
                    x      : bar.getAttribute( 'x' ),
                    y      : bar.getAttribute( 'y' ),
                    width  : bar.getAttribute( 'width' ),
                    height : bar.getAttribute( 'height' ),
                    stroke : bar.getAttribute( 'stroke' ),
                };
            }
        );
    }

    barForPage( page ) {
        return $( '.enm-pane-preview svg rect[ name = "' + page + '"]' );
    }

    selectedPage() {
        let activeBar;

        try {
            activeBar = $( '.enm-page-active' );

            return activeBar.getAttribute( 'name' );
        } catch( e ) {
            console.error( e );

            return null;
        }
    }
}

export default PreviewPaneBarChart;
