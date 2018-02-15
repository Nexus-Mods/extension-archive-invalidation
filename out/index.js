"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filesNewer_1 = require("./util/filesNewer");
const gameSupport_1 = require("./util/gameSupport");
const Promise = require("bluebird");
const path = require("path");
const vortex_api_1 = require("vortex-api");
function testArchivesAge(store) {
    const gameId = vortex_api_1.selectors.activeGameId(store.getState());
    if (!gameSupport_1.isSupported(gameId)) {
        return Promise.resolve(undefined);
    }
    const gamePath = vortex_api_1.util.getSafe(store.getState(), ['settings', 'gameMode', 'discovered', gameId, 'path'], undefined);
    if (gamePath === undefined) {
        return Promise.resolve(undefined);
    }
    const game = vortex_api_1.util.getGame(gameId);
    const dataPath = game.getModPaths(gamePath)[''];
    const age = gameSupport_1.targetAge(gameId);
    return filesNewer_1.default(dataPath, gameSupport_1.fileFilter(gameId), age)
        .then((files) => {
        if (files.length === 0) {
            return Promise.resolve(undefined);
        }
        return Promise.resolve({
            description: {
                short: 'Loose files may not get loaded',
                long: 'Due to oddities in the game engine, some loose files will not ' +
                    'get loaded unless we change the filetime on the vanilla BSA files. ' +
                    'There is no drawback to doing this.',
            },
            severity: 'warning',
            automaticFix: () => new Promise((fixResolve, fixReject) => Promise.map(files, file => vortex_api_1.fs.utimesAsync(path.join(dataPath, file), age.getTime() / 1000, age.getTime() / 1000))
                .then((stats) => {
                fixResolve();
                return Promise.resolve(undefined);
            })),
        });
    })
        .catch((err) => {
        return Promise.resolve({
            description: {
                short: 'Failed to read bsa/ba2 files.',
                long: err.toString(),
            },
            severity: 'error',
        });
    });
}
function init(context) {
    context.registerTest('archive-backdate', 'gamemode-activated', () => testArchivesAge(context.api.store));
    return true;
}
exports.default = init;
