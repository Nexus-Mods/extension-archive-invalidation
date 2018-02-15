"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const path = require("path");
const vortex_api_1 = require("vortex-api");
function filesNewer(searchPath, nameFilter, minAge) {
    return vortex_api_1.fs.readdirAsync(searchPath)
        .then((files) => {
        const matches = files.filter(nameFilter);
        return Promise.map(matches, file => vortex_api_1.fs.statAsync(path.join(searchPath, file))
            .then((stats) => Promise.resolve({
            name: file,
            stats,
        })));
    })
        .then((fileStats) => fileStats.filter(file => file.stats.mtime > minAge)
        .map(file => file.name));
}
exports.default = filesNewer;
