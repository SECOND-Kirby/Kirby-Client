const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 확장자 우선순위
config.resolver.sourceExts = [
    'tsx',
    'ts',
    'jsx',
    'js',
    'json',
    'cjs',
];

// nanoid 문제 해결
config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (moduleName === 'nanoid/non-secure') {
        try {
            return {
                filePath: require.resolve('nanoid/non-secure'),
                type: 'sourceFile',
            };
        } catch (e) {
            // fallback to default
        }
    }
    return context.resolveRequest(context, moduleName, platform);
};

// 불필요한 재빌드 방지
config.watchFolders = [__dirname];

module.exports = config;