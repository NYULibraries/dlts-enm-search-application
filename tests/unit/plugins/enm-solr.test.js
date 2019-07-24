import { createLocalVue } from '@vue/test-utils';
import EnmSolr from '@/plugins/enm-solr';

describe( 'enm-solr plugin', () => {
    const ENM_SOLR_OPTIONS = Object.freeze(
        {
            solrCorePath : '/solr/enm-pages/',
            solrHost     : 'discovery.dlib.nyu.edu',
            solrPort     : 8983,
            solrProtocol : 'http',
        } );

    let localVue;

    beforeEach( () => {
        localVue = createLocalVue();

        localVue.use( EnmSolr, ENM_SOLR_OPTIONS );
    } );

    test( 'adds $solrPreviewEpub to the Vue prototype', () => {
        expect( typeof localVue.prototype.$solrPreviewEpub ).toBe( 'function' );
    } );

    test( 'adds $solrPreviewPage to the Vue prototype', () => {
        expect( typeof localVue.prototype.$solrPreviewPage ).toBe( 'function' );
    } );

    test( 'adds $solrSearch to the Vue prototype', () => {
        expect( typeof localVue.prototype.$solrSearch ).toBe( 'function' );
    } );
} );
