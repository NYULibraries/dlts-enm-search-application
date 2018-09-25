import { execSync } from 'child_process';
import path from 'path';
import stringify from 'json-stable-stringify';
import { sync as commandExistsSync } from 'command-exists';

const DIFF = 'diff';
const DIFF_EXISTS = commandExistsSync( DIFF );
const DIFF_FILES_DIRECTORY = path.resolve( __dirname, '../diffs' );

function diffActualVsGoldenAndReturnMessage( actualFile, goldenFile, id ) {
    let message = 'Actual search results do not match expected.';

    if ( DIFF_EXISTS ) {
        // Create the diff file for later inspection
        const diffFile = `${DIFF_FILES_DIRECTORY}/${id}.txt`;
        const command = `diff ${goldenFile} ${actualFile} > ${diffFile}`;

        // Note that this will always throw an exception because `diff`
        // throws when files are different.
        try {
            execSync( command );
        } catch( e ) {
            if ( ! e.stderr.toString() ) {
                // This is what is expected -- diff command succeeds.
                message += `  See diff file: ${diffFile}`;
            } else {
                // This is unexpected -- diff command failed to create
                // the diff file.
                message += `  Diff command \`${command}\` failed:

${e.stderr.toString()}`;
            }
        }
    } else {
        message += `  \`${DIFF}\` command not available.  Compare actual file vs golden file for details:
${goldenFile}
${actualFile}`;
    }

    return message;
}

function jsonStableStringify( data ) {
    return stringify(
        data,
        { space : '    ' }
    );
}

export {
    diffActualVsGoldenAndReturnMessage,
    jsonStableStringify,
};
