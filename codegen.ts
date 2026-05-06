import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: {
        'http://localhost:3000/graphql': {
            headers: {
                'x-nonce': new Date().toISOString(),
            },
        },
    },
    documents: ['lib/graphql/queries/**/*.ts'],  // where your gql queries live
    generates: {
        'lib/graphql/generated/': {
            preset: 'client',
            config: {
                scalars: {
                    DateTime: 'string',
                    Int: 'number',
                },
            },
        },
    },
};

export default config;