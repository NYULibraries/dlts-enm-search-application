# DLTS Enhanced Networked Monographs: Search

> Vue.js/D3 search SPA for the DLTS Enhanced Networked Monographs website.

## Project setup
```
# Install dependencies including devDependencies
# If NODE_ENV is not set to production, can leave out --production=false
yarn install --production=false
```

### Compile and hot-reload for development
```
# Serve with hot reload at localhost:8080
yarn run serve
```

### Compile and minify for production
```
yarn run build
```

### Run all tests
```
yarn run test
```

### Run browser (e2e) tests
```
# Run Selenium tests against localhost ENM
yarn test:browser:local

# Debugging Selenium tests in Chrome only
# Timeout is set to very hight value to allow for pausing at breakpoints
yarn test:browser:local:debug:chrome

# Debugging Selenium tests in Firefox only
# Timeout is set to very hight value to allow for pausing at breakpoints
yarn test:browser:local:debug:firefox

# Update golden files for Selenium tests
UPDATE_GOLDEN_FILES=1 yarn test:browser:local
```

### Run unit tests
```
yarn run test:unit
```

### Lint and fix files
```
yarn run lint
```

### Lint but do not fix files
```
yarn run lint --no-fix
```

### Run unit tests
```
yarn run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### Tests

#### Solr: using the live servers, not fakes

Currently Solr is not stubbed out for the tests.  ENM data will be frozen so in
theory there should be no data volatility when using the live Solr instances.
Also, the live Solr indexes are tested using the [ENM Verifier](https://github.com/nyulibraries/dlts-enm-verifier).
Nevertheless, in principle the Solr dependency should be replaced with a fake.
This might be done in the future by adding a `testmode` query parameter that when
set to true shifts the application to a fake Solr running on a pre-defined host and port.

If it is decided that the tests will only run against a local build (that is the
case now, but it wouldn't be hard to make conf files for dev, stage, and prod),
then another option would be to have a test build that has the fake Solr responses
baked into the application.  This would eliminate the need for a fake Solr server
running as a separate backend process.  This build would be quite large however
as some of the Solr responses have a lot of data in them.

#### Golden files

The initial golden files were created by scripts which ran queries against the
verified Solr indexes and used the responses to create the JSON golden files.

In the future, if the Solr indexes change, the golden files can be updated by
re-running all tests with an environment variable `UPDATE_GOLDEN_FILES` set to `1`.
The new golden files should then be checked into the repo.  There should be certainty
that the new actual data being written out to the new golden files is correct.
If the following pre-conditions are met, the generation of new golden files using
UPDATE_GOLDEN_FILES=1 can proceed with confidence:

* There have been no code changes since the last successful full test suite run. 
* The Solr indexes have been verified, either by the [ENM Verifier](https://github.com/nyulibraries/dlts-enm-verifier)
or some other process.  In theory this may not need to be a pre-condition if the
test suite is considered a test of the correctness of the code, and not the data.
Ideally though the golden files should have clean and correct data. 

Note that there may be some tests that do not verify against golden files but
have check data directly hardcoded into the scripts.  These will need to be updated
manually if they are broken by the Solr index changes. 

