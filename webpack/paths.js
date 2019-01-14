import path from 'path';
import fs from 'fs';

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
    root: resolveApp('/'),
    source: resolveApp('src'),
    build:  resolveApp('build'),
    public: resolveApp('public'),
};
