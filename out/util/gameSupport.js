"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const gameSupport = {
    skyrim: {
        fileFilter: (fileName) => {
            const fileNameL = fileName.toLowerCase();
            return (path.extname(fileNameL) === '.bsa')
                && (fileNameL.startsWith('skyrim - ')
                    || (fileNameL.startsWith('hearthfires'))
                    || (fileNameL.startsWith('dragonborn'))
                    || (fileNameL.startsWith('highrestexturepack')));
        },
        targetAge: new Date(2008, 10, 1),
    },
    skyrimse: {
        fileFilter: (fileName) => fileName.startsWith('Skyrim - ')
            && path.extname(fileName).toLowerCase() === '.bsa',
        targetAge: new Date(2008, 10, 1),
    },
    fallout4: {
        fileFilter: (fileName) => {
            const fileNameL = fileName.toLowerCase();
            return path.extname(fileNameL) === '.ba2'
                && (fileNameL.startsWith('fallout4 - ')
                    || fileNameL.startsWith('dlccoast - ')
                    || fileNameL.startsWith('dlcrobot - ')
                    || fileNameL.startsWith('dlcworkshop')
                    || fileNameL.startsWith('dlcnukaworld - '));
        },
        targetAge: new Date(2008, 10, 1),
    },
    fallout4vr: {
        fileFilter: (fileName) => (fileName.startsWith('Fallout4 - ') || (fileName.startsWith('Fallout4_VR - ')))
            && path.extname(fileName).toLowerCase() === '.ba2',
        targetAge: new Date(2008, 10, 1),
    },
};
function isSupported(gameId) {
    return gameSupport[gameId] !== undefined;
}
exports.isSupported = isSupported;
function fileFilter(gameId) {
    return gameSupport[gameId].fileFilter;
}
exports.fileFilter = fileFilter;
function targetAge(gameId) {
    return gameSupport[gameId].targetAge;
}
exports.targetAge = targetAge;
