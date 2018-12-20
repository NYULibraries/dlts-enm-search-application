import ResultsPaneHeader from './ResultsPaneHeader';
import ResultsPaneSearchResults from './ResultsPaneSearchResults';

class ResultsPane {
    constructor() {
        this.header = new ResultsPaneHeader();
        this.results = new ResultsPaneSearchResults();
    }
}

export default ResultsPane;
