module.exports = {
    'env'   : {
        'development' : {
            presets : [
                '@vue/app',
            ],
        },
        'production' : {
            presets : [
                '@vue/app',
            ],
        },
        'test' : {
            presets : [
                [
                    '@babel/preset-env', {
                        targets : {
                            node : 'current',
                        },
                    },
                ],
            ],
        },
    },
};
