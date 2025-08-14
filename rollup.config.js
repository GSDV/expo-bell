import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import alias from '@rollup/plugin-alias';
import path from 'path';



const external = [
    'react',
    'react-native',
    'expo-notifications',
    'expo-device',
    'expo-constants'
];



const aliasConfig = {
    entries: [
        { find: '@', replacement: path.resolve(__dirname, 'src') },
    ]
};



export default [
    {
        input: 'src/index.tsx',
        output: [
        {
            file: 'lib/index.js',
            format: 'cjs',
            exports: 'named',
            sourcemap: true
        },
        {
            file: 'lib/index.esm.js',
            format: 'esm',
            sourcemap: true
        }
        ],
        external,
        plugins: [
            alias(aliasConfig),
            typescript({
                tsconfig: './tsconfig.json',
                declaration: false,
                declarationMap: false
            })
        ]
    },
    {
        input: 'src/index.tsx',
        output: {
            file: 'lib/index.d.ts',
            format: 'esm'
        },
        external,
        plugins: [
            alias(aliasConfig),
            dts()
        ]
    }
];