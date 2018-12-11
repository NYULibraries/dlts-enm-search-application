/* global $:false $$:false */

class SearchEchoTopicDCIs {
    get topics() {
        return $$( 'span.enm-topic' ).map( ( topicDCI ) => {
            return topicDCI.getText();
        } );
    }

    dismiss( topic ) {
        $( 'button[ id="' + topic + '" ]' ).click();
    }
}

export default SearchEchoTopicDCIs;
