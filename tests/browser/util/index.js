/* global browser:false */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import stringify from 'json-stable-stringify';
import { sync as commandExistsSync } from 'command-exists';

const ACTUAL_FILES_ROOT = path.resolve( __dirname, '../tests/testdata/actual/' );
const DIFF_FILES_ROOT = path.resolve( __dirname, '../tests/testdata/diffs/' );
const GOLDEN_FILES_ROOT = path.resolve( __dirname, '../tests/testdata/golden/' );

const DIFF = 'diff';
const DIFF_EXISTS = commandExistsSync( DIFF );

function clearActualFilesDirectory( suiteNameArg ) {
    if ( Object.values( SUITE_NAME ).includes( suiteNameArg ) ) {
        const actualFilesDirectory = getActualFilesDirectory( suiteNameArg );

        try {
            rimraf.sync( path.resolve( actualFilesDirectory, './*' ) );
        } catch( error ) {
            console.error( `ERROR clearing actual files directory: ${ error }` );

            process.exit( 1 );
        }
    } else {
        throw new Error( `Invalid suiteArg "${ suiteNameArg }` );
    }
}

function clearDiffFilesDirectory( suiteNameArg ) {
    if ( Object.values( SUITE_NAME ).includes( suiteNameArg ) ) {
        const diffFilesDirectory = getDiffFilesDirectory( suiteNameArg );

        try {
            rimraf.sync( path.resolve( diffFilesDirectory, './*' ) );
        } catch( error ) {
            console.error( `ERROR clearing diff files directory: ${ error }` );

            process.exit( 1 );
        }
    } else {
        throw new Error( `Invalid suiteArg "${ suiteNameArg }` );
    }
}

function diffActualVsGoldenAndReturnMessage( suiteName, actualFile, goldenFile, id ) {
    let message = 'Actual search results do not match expected.';

    if ( DIFF_EXISTS ) {
        // Create the diff file for later inspection
        const diffFile = getDiffFilePath( suiteName, id );
        const command = `diff ${ goldenFile } ${ actualFile } > ${ diffFile }`;

        // Note that this will always throw an exception because `diff`
        // throws when files are different.
        try {
            execSync( command );
        } catch( e ) {
            if ( ! e.stderr.toString() ) {
                // This is what is expected -- diff command succeeds.
                message += `  See diff file: ${ diffFile }`;
            } else {
                // This is unexpected -- diff command failed to create
                // the diff file.
                message += `  Diff command \`${ command }\` failed:

${ e.stderr.toString() }`;
            }
        }
    } else {
        message += `  \`${ DIFF }\` command not available.  Compare actual file vs golden file for details:
${ goldenFile }
${ actualFile }`;
    }

    return message;
}

function getActualFilePath( suiteName, id ) {
    return path.resolve( getActualFilesDirectory( suiteName ), `./${ id }.json` );
}

function getActualFilesDirectory( suiteNameArg ) {
    return path.resolve(
        ACTUAL_FILES_ROOT,
        `${ suiteNameArg }/`,
        getBrowserName(),
    );
}

function getBrowserName() {
    return browser.options.desiredCapabilities.browserName;
}

function getDiffFilePath( suiteName, id ) {
    return path.resolve( getDiffFilesDirectory( suiteName ), `./${ id }.txt` );
}

function getDiffFilesDirectory( suiteNameArg ) {
    return path.resolve( DIFF_FILES_ROOT, `${ suiteNameArg }/` );
}

function getGoldenFilePath( suiteName, id ) {
    return path.resolve( getGoldenFilesDirectory( suiteName ), `./${ id }.json` );
}

function getGoldenFiles( suiteName ) {
    const goldenFilesDirectory = getGoldenFilesDirectory( suiteName );
    const goldenFiles = fs.readdirSync( goldenFilesDirectory )
        .map( ( file ) => {
            return path.resolve( goldenFilesDirectory, `./${ file }` );
        } );

    return goldenFiles;
}

function getGoldenFilesDirectory( suiteNameArg ) {
    return path.resolve( GOLDEN_FILES_ROOT, `${ suiteNameArg }/` );
}

function jsonStableStringify( data ) {
    return stringify(
        data,
        { space : '    ' }
    );
}

export const SUITE_NAME = {
    limitByTopicPane : 'limit-by-topic-pane',
    previewPane      : 'preview-pane',
    searchEcho       : 'search-echo',
    searchResults    : 'search-results',
};

export {
    clearActualFilesDirectory,
    clearDiffFilesDirectory,
    diffActualVsGoldenAndReturnMessage,
    getActualFilePath,
    getActualFilesDirectory,
    getDiffFilesDirectory,
    getGoldenFilePath,
    getGoldenFiles,
    getGoldenFilesDirectory,
    jsonStableStringify,
};
