import { createLocalVue } from '@vue/test-utils';
import EnmSolr from '@/plugins/enm-solr';

const ISBN                       = '9781111111111';
const QUERY                      = 'something';
const QUERY_FIELDS_FULL_TEXT     = 'pageText';
const QUERY_FIELDS_TOPIC_NAMES   = 'topicNames';
const QUERY_FIELDS_ALL           = Object.freeze( [ QUERY_FIELDS_FULL_TEXT, QUERY_FIELDS_TOPIC_NAMES ] );
const SELECTED_TOPIC_FACET_ITEMS = Object.freeze( [ 'topic 0', 'topic 1', 'topic 2', 'topic 3' ] );

describe( 'enm-solr plugin', () => {
    const ENM_SOLR_OPTIONS = Object.freeze(
        {
            solrCorePath : '/solr/enm-pages/',
            solrHost     : 'solr.dlib.nyu.edu',
            solrPort     : 8983,
            solrProtocol : 'http',
        } );

    let localVue;
    let mockFetch;

    beforeAll( () => {
        mockFetch = jest.fn().mockImplementation(
            () => Promise.resolve( { responseHeader : { status : 0 } } )
        );

        global.fetch = mockFetch;
    } );

    beforeEach( () => {
        mockFetch.mockClear();

        localVue = createLocalVue();

        localVue.use( EnmSolr, ENM_SOLR_OPTIONS );
    } );

    test( 'adds $solrPreviewEpub to the Vue prototype', () => {
        expect( typeof localVue.prototype.$solrPreviewEpub ).toBe( 'function' );
    } );

    test( '$solrPreviewEpub calls fetch with correct arguments', () => {
        localVue.prototype.$solrPreviewEpub(
            ISBN,
            QUERY,
            QUERY_FIELDS_ALL,
            SELECTED_TOPIC_FACET_ITEMS
        );

        // Using hardcoded, un-DRY value because a DRY value would basically require
        // reproducing the very code being tested.
        expect( mockFetch ).toHaveBeenCalledWith(
            'http://solr.dlib.nyu.edu:8983/solr/enm-pages/select?' +
            'q=something' +
            '&fl=pageLocalId,pageNumberForDisplay,pageSequenceNumber,epubNumberOfPages,score' +
            '&fq=isbn_facet%3A%229781111111111%22' +
            '&fq=topicNames_facet%3A%22topic%200%22' +
            '&fq=topicNames_facet%3A%22topic%201%22' +
            '&fq=topicNames_facet%3A%22topic%202%22' +
            '&fq=topicNames_facet%3A%22topic%203%22' +
            '&qf=pageText%20topicNames' +
            '&rows=999' +
            '&sort=pageSequenceNumber+asc' +
            '&defType=edismax&indent=on&wt=json',
        );
    } );

    test( 'adds $solrPreviewPage to the Vue prototype', () => {
        expect( typeof localVue.prototype.$solrPreviewPage ).toBe( 'function' );
    } );

    test( '$solrPreviewPage calls fetch with correct arguments', () => {
        localVue.prototype.$solrPreviewPage(
            ISBN,
            QUERY,
            QUERY_FIELDS_ALL,
            SELECTED_TOPIC_FACET_ITEMS
        );

        // Using hardcoded, un-DRY value because a DRY value would basically require
        // reproducing the very code being tested.
        expect( mockFetch ).toHaveBeenCalledWith(
            'http://solr.dlib.nyu.edu:8983/solr/enm-pages/select?' +
            'q=pageText%2CtopicNames' +
            '&fl=topicNames_facet,topicNamesForDisplay,pageText' +
            '&fq=isbn%3A9781111111111' +
            '&fq=pageNumberForDisplay%3A%20something' +
            '&hl=on' +
            '&hl.fl=topic 0%20topic 1%20topic 2%20topic 3' +
            '&hl.fragsize=0' +
            '&hl.simple.post=%3C%2Fmark%3E' +
            '&hl.simple.pre=%3Cmark%3E' +
            '&qf=topic 0%20topic 1%20topic 2%20topic 3' +
            '&rows=1' +
            '&sort=pageSequenceNumber+asc' +
            '&defType=edismax' +
            '&indent=on' +
            '&wt=json'
        );
    } );

    test( 'adds $solrSearch to the Vue prototype', () => {
        expect( typeof localVue.prototype.$solrSearch ).toBe( 'function' );
    } );

    test( '$solrSearch calls fetch with correct arguments', () => {
        localVue.prototype.$solrSearch(
            QUERY,
            QUERY_FIELDS_ALL,
            SELECTED_TOPIC_FACET_ITEMS
        );

        // Using hardcoded, un-DRY value because a DRY value would basically require
        // reproducing the very code being tested.
        expect( mockFetch ).toHaveBeenCalledWith(
            'http://solr.dlib.nyu.edu:8983/solr/enm-pages/select?q=something' +
            '&facet.field=topicNames_facet' +
            '&facet.limit=-1' +
            '&facet.mincount=1' +
            '&facet.sort=count' +
            '&facet=on' +
            '&fl=title,authors,publisher,yearOfPublication,score' +
            '&group.field=isbn' +
            '&group=true' +
            '&group.limit=999' +
            '&qf=pageText%20topicNames' +
            '&rows=1999' +
            '&sort=score%20desc,title_facet%20asc' +
            '&fq=topicNames_facet%3A%22topic%200%22' +
            '&fq=topicNames_facet%3A%22topic%201%22' +
            '&fq=topicNames_facet%3A%22topic%202%22' +
            '&fq=topicNames_facet%3A%22topic%203%22' +
            '&defType=edismax' +
            '&indent=on' +
            '&wt=json'
        );
    } );
} );
