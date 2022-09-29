import * as path from 'path';
import * as Redux from 'redux';
import { selectors, types, util } from 'vortex-api';

interface IGameSupport {
  fileFilter?: (fileName: string) => boolean;
  targetAge?: Date;
  bsaVersion?: number;
  mygamesPath: string;
  iniName: string;
  archiveListKey: string;
  defaultArchives: string[];
}

const gameSupportGOG: { [gameId: string]: Partial<IGameSupport> } = {
  skyrimse: {
    mygamesPath: 'Skyrim Special Edition GOG',
  },
}

const gameSupportXboxPass: { [gameId: string]: any } = {
  skyrimse: {
    mygamesPath: 'Skyrim Special Edition MS',
  },
  fallout4: {
    mygamesPath: 'Fallout4 MS',
  },
};

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
    defaultArchives: ['Skyrim - Misc.bsa', 'Skyrim - Shaders.bsa', 'Skyrim - Textures.bsa',
                      'Skyrim - Interface.bsa', 'Skyrim - Animations.bsa', 'Skyrim - Meshes.bsa',
                      'Skyrim - Sounds.bsa'],
  },
  enderal: {
    fileFilter: (fileName: string) => {
      const fileNameL = fileName.toLowerCase();
      return (path.extname(fileNameL) === '.bsa')
        && (fileNameL.startsWith('skyrim - ')
            || (fileNameL.startsWith('E - '))
            || (fileNameL.startsWith('L - '))
          );
    },
    targetAge: new Date(2008, 10, 1),
    mygamesPath: 'enderal',
    iniName: 'enderal.ini',
    archiveListKey: 'SResourceArchiveList',
    defaultArchives: ['Skyrim - Misc.bsa', 'Skyrim - Shaders.bsa', 'Skyrim - Textures.bsa',
                      'Skyrim - Interface.bsa', 'Skyrim - Animations.bsa', 'Skyrim - Meshes.bsa',
                      'Skyrim - Sounds.bsa',
                      'E - Meshes.bsa', 'E - Music.bsa', 'E - Scripts.bsa', 'E - Sounds.bsa',
                      'E - Textures1.bsa', 'E - Textures2.bsa', 'E - Textures3.bsa',
                      'L - Textures.bsa', 'L - Voices.bsa'],
  },
  skyrimse: {
    fileFilter: (fileName: string) =>
      fileName.startsWith('Skyrim - ')
      && path.extname(fileName).toLowerCase() === '.bsa',
    targetAge: new Date(2008, 10, 1),
    mygamesPath: 'Skyrim Special Edition',
    iniName: 'Skyrim.ini',
    archiveListKey: 'SResourceArchiveList',
    defaultArchives: ['Skyrim - Misc.bsa', 'Skyrim - Shaders.bsa', 'Skyrim - Interface.bsa',
                      'Skyrim - Animations.bsa', 'Skyrim - Meshes0.bsa',
                      'Skyrim - Meshes1.bsa', 'Skyrim - Sounds.bsa'],
  },
  skyrimvr: {
    fileFilter: (fileName: string) =>
      fileName.startsWith('Skyrim - ')
      && path.extname(fileName).toLowerCase() === '.bsa',
    targetAge: new Date(2008, 10, 1),
    mygamesPath: 'Skyrim VR',
    iniName: 'SkyrimVR.ini',
    archiveListKey: 'SResourceArchiveList',
    defaultArchives: ['Skyrim - Misc.bsa', 'Skyrim - Shaders.bsa', 'Skyrim - Interface.bsa',
                      'Skyrim - Animations.bsa', 'Skyrim - Meshes0.bsa', 'Skyrim - Meshes1.bsa',
                      'Skyrim - Sounds.bsa'],
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
    defaultArchives: ['Fallout4 - Voices.ba2', 'Fallout4 - Meshes.ba2',
                      'Fallout4 - MeshesExtra.ba2', 'Fallout4 - Misc.ba2',
                      'Fallout4 - Sounds.ba2', 'Fallout4 - Materials.ba2'],
  },
  fallout4vr: {
    fileFilter: (fileName: string) =>
      (fileName.startsWith('Fallout4 - ') || (fileName.startsWith('Fallout4_VR - ')))
      && path.extname(fileName).toLowerCase() === '.ba2',
    targetAge: new Date(2008, 10, 1),
    mygamesPath: 'Fallout4VR',
    iniName: 'Fallout4Custom.ini',
    archiveListKey: 'SResourceArchiveList',
    defaultArchives: ['Fallout4 - Voices.ba2', 'Fallout4 - Meshes.ba2',
                      'Fallout4 - MeshesExtra.ba2', 'Fallout4 - Misc.ba2',
                      'Fallout4 - Sounds.ba2', 'Fallout4 - Materials.ba2'],
  },
  fallout3: {
    fileFilter: (fileName: string) =>
      path.extname(fileName) === '.bsa'
      && (fileName.startsWith('Fallout - ')
          || fileName.startsWith('BrokenSteel - ')
          || fileName.startsWith('Anchorage - ')
          || fileName.startsWith('PointLookout - ')
          || fileName.startsWith('Zeta - ')
          || fileName.startsWith('ThePitt - ')),
    targetAge: new Date(2006, 1, 1),
    bsaVersion: 0x68,
    mygamesPath: 'Fallout3',
    iniName: 'Fallout.ini',
    archiveListKey: 'SArchiveList',
    defaultArchives: ['Fallout - Textures.bsa', 'Fallout - Meshes.bsa', 'Fallout - Voices.bsa',
                      'Fallout - Sound.bsa', 'Fallout - MenuVoices.bsa', 'Fallout - Misc.bsa'],
  },
  falloutnv: {
    fileFilter: (fileName: string) =>
      path.extname(fileName) === '.bsa'
      && (fileName.startsWith('Fallout - ')
          || fileName.startsWith('DeadMoney -')
          || fileName.startsWith('HonestHearts - ')
          || fileName.startsWith('OldWorldBlues - ')
          || fileName.startsWith('LonesomeRoad - ')
          || fileName.startsWith('CaravanPack - ')
          || fileName.startsWith('ClassicPack - ')
          || fileName.startsWith('MercenaryPack - ')
          || fileName.startsWith('TribalPack - ')
          || fileName.startsWith('GunRunnersArsenal - ')),
    targetAge: new Date(2006, 1, 1),
    bsaVersion: 0x68,
    mygamesPath: 'FalloutNV',
    iniName: 'Fallout.ini',
    archiveListKey: 'SArchiveList',
    defaultArchives: ['Fallout - Textures.bsa', 'Fallout - Textures2.bsa', 'Fallout - Meshes.bsa',
                      'Fallout - Voices1.bsa', 'Fallout - Sound.bsa', 'Fallout - Misc.bsa'],
  },
  oblivion: {
    fileFilter: (fileName: string) =>
      path.extname(fileName) === '.bsa'
      && (fileName.startsWith('Oblivion - ')
          || fileName.startsWith('DLC')
          || fileName.startsWith('Knights')),
    targetAge: new Date(2006, 1, 1),
    bsaVersion: 0x67,
    mygamesPath: 'Oblivion',
    iniName: 'Oblivion.ini',
    archiveListKey: 'SArchiveList',
    defaultArchives: ['Oblivion - Meshes.bsa', 'Oblivion - Textures - Compressed.bsa',
                      'Oblivion - Sounds.bsa', 'Oblivion - Voices1.bsa',
                      'Oblivion - Voices2.bsa', 'Oblivion - Misc.bsa'],
  },
};

function isXboxPath(discoveryPath: string) {
  const hasPathElement = (element) =>
    discoveryPath.toLowerCase().includes(element);
  return ['modifiablewindowsapps', '3275kfvn8vcwc'].find(hasPathElement) !== undefined;
}

let gameStoreForGame: (gameId: string) => string = () => undefined;

export function initGameSupport(store: Redux.Store<types.IState>) {
  const state: types.IState = store.getState();
  gameStoreForGame = (gameId: string) => selectors.discoveryByGame(store.getState(), gameId)['store'];
  const { discovered } = state.settings.gameMode;

  Object.keys(gameSupportXboxPass).forEach(gameMode => {
    if (discovered[gameMode]?.path !== undefined) {
      if (isXboxPath(discovered[gameMode].path)) {
        gameSupport[gameMode].mygamesPath = gameSupportXboxPass[gameMode].mygamesPath;
      }
    }
  });
}

export function isSupported(gameId: string): boolean {
  return gameSupport[gameId] !== undefined;
}

export function fileFilter(gameId: string): (fileName: string) => boolean {
  if (gameSupport[gameId].fileFilter !== undefined) {
    return gameSupport[gameId].fileFilter;
  } else {
    return () => false;
  }
}

export function targetAge(gameId: string): Date {
  return gameSupport[gameId].targetAge;
}

export function bsaVersion(gameId: string): number {
  return gameSupport[gameId].bsaVersion;
}

export function mygamesPath(gameMode: string): string {
  const relPath = (gameStoreForGame(gameMode) === 'gog')
    ? gameSupportGOG[gameMode].mygamesPath
    : gameSupport[gameMode].mygamesPath;

  return path.join(util.getVortexPath('documents'), 'My Games', relPath);
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

export function defaultArchives(gameMode: string): string[] {
  return gameSupport[gameMode].defaultArchives;
}
