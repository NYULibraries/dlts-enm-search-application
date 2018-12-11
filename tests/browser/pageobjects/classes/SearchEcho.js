import SearchEchoSearchDCI from './SearchEchoSearchDCI';
import SearchEchoTopicDCIs from './SearchEchoTopicDCIs';

class SearchEcho {
    constructor() {
        this.searchDCI = new SearchEchoSearchDCI();
        this.topicDCIs = new SearchEchoTopicDCIs();
    }
}

export default SearchEcho;
