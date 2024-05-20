const path = require('path');

module.exports = {
    entry: './src/index.js',  // 源文件路径
    output: {
        filename: 'bundle.js',  // 输出的文件名
        path: path.resolve(__dirname, 'dist'),  // 输出的目录
    }
    //resolve: {
        //fallback: {
            ////util: require.resolve("util/")
            //util: false,
            //assert: false
        //}
    //}
};
