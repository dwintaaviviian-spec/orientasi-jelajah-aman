
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Dukungan file WebAssembly untuk SQLite Web
config.resolver.assetExts.push('wasm');

module.exports = config;
