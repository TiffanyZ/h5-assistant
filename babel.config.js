const plugins = [
  ['import', {
    libraryName: 'wui',
    libraryDirectory: 'es',
    style: true
  }, 'wui']
];

if (process.env.NODE_ENV === 'production') {
  // plugins.push('transform-remove-console');
}

module.exports = {
  presets: [['@vue/cli-plugin-babel/preset', { useBuiltIns: 'entry' }]],
  plugins,
};
