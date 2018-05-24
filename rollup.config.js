// import uglify from 'rollup-plugin-uglify';

export default [
	// iife , for older browsers
	{
		input: 'src/render-mixin.js',
		output: {
			file: 'render-mixin.js',
      name: 'RenderMixin',
			format: 'iife',
			sourcemap: false
		},
		experimentalCodeSplitting: false,
		experimentalDynamicImport: false,
    // plugins: [
    //   uglify
    // ]
	}
]
