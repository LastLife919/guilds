module.exports = {
  css: {
    extract: false
  },

  publicPath: undefined,
  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: false,
  parallel: undefined,
  chainWebpack: config => {
  	config.optimization.delete('splitChunks')
	}
}