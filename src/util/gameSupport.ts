import { app as appIn, remote } from 'electron';
import * as path from 'path';

const app = appIn || remote.app;

interface IGameSupport {
  fileFilter?: (fileName: string) => boolean;
  targetAge?: Date;
  bsaVersion?: number;
  mygamesPath: string;
  iniName: string;
  archiveListKey: string;
}

const gameSupport: { [gameId: string]: IGameSupport } = {
  skyrim: {
    fileFilter: (fileName: string) => {
      const fileNameL = fileName.toLowerCase();
      return (path.extname(fileNameL) === '.bsa')
        && (fileNameL.startsWith('skyrim - ')
            || (fileNameL.startsWith('hearthfires'))
            || (fileNameL.startsWith('dragonborn'))
            || (fileNameL.startsWith('highrestexturepack'))
          );
    },
    targetAge: new Date(2008, 10, 1),
    mygamesPath: 'skyrim',
    iniName: 'Skyrim.ini',
    archiveListKey: 'SResourceArchiveList',
  },
  skyrimse: {
    fileFilter: (fileName: string) =>
      fileName.startsWith('Skyrim - ')
      && path.extname(fileName).toLowerCase() === '.bsa',
    targetAge: new Date(2008, 10, 1),
    mygamesPath: 'Skyrim Special Edition',
    iniName: 'Skyrim.ini',
    archiveListKey: 'SResourceArchiveList',
  },
  skyrimvr: {
    fileFilter: (fileName: string) =>
      fileName.startsWith('Skyrim - ')
      && path.extname(fileName).toLowerCase() === '.bsa',
    targetAge: new Date(2008, 10, 1),
    mygamesPath: 'Skyrim VR',
    iniName: 'Skyrim.ini',
    archiveListKey: 'SResourceArchiveList',
  },
  fallout4: {
    fileFilter: (fileName: string) => {
      const fileNameL = fileName.toLowerCase();
      return path.extname(fileNameL) === '.ba2'
          && (fileNameL.startsWith('fallout4 - ')
              || fileNameL.startsWith('dlccoast - ')
              || fileNameL.startsWith('dlcrobot - ')
              || fileNameL.startsWith('dlcworkshop')
              || fileNameL.startsWith('dlcnukaworld - ')
        );
      },
    targetAge: new Date(2008, 10, 1),
    mygamesPath: 'Fallout4',
    iniName: 'Fallout4.ini',
    archiveListKey: 'SResourceArchiveList',
  },
  fallout4vr: {
    fileFilter: (fileName: string) =>
      (fileName.startsWith('Fallout4 - ') || (fileName.startsWith('Fallout4_VR - ')))
      && path.extname(fileName).toLowerCase() === '.ba2',
    targetAge: new Date(2008, 10, 1),
    mygamesPath: 'Fallout4VR',
    iniName: 'Fallout4Custom.ini',
    archiveListKey: 'SResourceArchiveList',
  },
  fallout3: {
    bsaVersion: 0x68,
    mygamesPath: 'Fallout3',
    iniName: 'Fallout.ini',
    archiveListKey: 'SArchiveList',
  },
  falloutnv: {
    bsaVersion: 0x68,
    mygamesPath: 'FalloutNV',
    iniName: 'Fallout.ini',
    archiveListKey: 'SArchiveList',
  },
  oblivion: {
    bsaVersion: 0x67,
    mygamesPath: 'Oblivion',
    iniName: 'Oblivion.ini',
    archiveListKey: 'SResourceArchiveList',
  },
};

export function isSupported(gameId: string): boolean {
  return gameSupport[gameId] !== undefined;
}

export function fileFilter(gameId: string): (fileName: string) => boolean {
  return gameSupport[gameId].fileFilter;
}

export function targetAge(gameId: string): Date {
  return gameSupport[gameId].targetAge;
}

export function bsaVersion(gameId: string): number {
  return gameSupport[gameId].bsaVersion;
}

export function mygamesPath(gameMode: string): string {
  return path.join(app.getPath('documents'), 'My Games',
                   gameSupport[gameMode].mygamesPath);
}

export function iniName(gameMode: string): string {
  return gameSupport[gameMode].iniName;
}

export function iniPath(gameMode: string): string {
  return path.join(mygamesPath(gameMode), gameSupport[gameMode].iniName);
}

export function archiveListKey(gameMode: string): string {
  return gameSupport[gameMode].archiveListKey;
}
