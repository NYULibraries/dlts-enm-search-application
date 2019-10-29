module.exports = {
    'env'   : {
        'development' : {
            presets : [
                '@vue/cli-plugin-babel/preset',
            ],
        },
        'production' : {
            presets : [
                '@vue/cli-plugin-babel/preset',
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
