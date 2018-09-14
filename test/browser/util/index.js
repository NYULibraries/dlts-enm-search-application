import stringify from 'json-stable-stringify';

function jsonStableStringify( data ) {
    return stringify(
        data,
        { space : '    ' }
    );
}

export { jsonStableStringify };
