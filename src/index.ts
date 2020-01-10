import filesNewer from './util/filesNewer';
import { bsaVersion, fileFilter, iniPath, isSupported, targetAge } from './util/gameSupport';
import Settings from './views/Settings';

import { toggleInvalidation } from './bsaRedirection';
import { REDIRECTION_MOD } from './constants';

import Promise from 'bluebird';
import I18next from 'i18next';
import * as path from 'path';
import {} from 'redux-thunk';
import { actions, fs, log, selectors, types, util } from 'vortex-api';
import {IniFile} from 'vortex-parse-ini';

function testArchivesAge(api: types.IExtensionApi) {
  const state: types.IState = api.store.getState();
  const gameId = selectors.activeGameId(state);

  if (!isSupported(gameId)) {
    return Promise.resolve(undefined);
  }

  const gamePath: string = util.getSafe(
      state,
      ['settings', 'gameMode', 'discovered', gameId, 'path'], undefined);

  if (gamePath === undefined) {
    // TODO: happened in testing, but how does one get here with no path configured?
    return Promise.resolve(undefined);
  }

  const game = util.getGame(gameId);
  const dataPath = game.getModPaths(gamePath)[''];

  const age = targetAge(gameId);
  if (age === undefined) {
    return Promise.resolve(undefined);
  }

  return filesNewer(dataPath, fileFilter(gameId), age)
      .then((files: string[]) => {
        if (files.length === 0) {
          return Promise.resolve(undefined);
        }

        return Promise.resolve({
          description: {
            short: 'Loose files may not get loaded',
            long:
                'Due to oddities in the game engine, some loose files will not ' +
                'get loaded unless we change the filetime on the vanilla BSA/BA2 files. ' +
                'There is no drawback to doing this.',
          },
          severity: 'warning',
          automaticFix: () => new Promise<void>(
                  (fixResolve, fixReject) =>
                      Promise.map(files, file => fs.utimesAsync(
                                             path.join(dataPath, file),
                                             age.getTime() / 1000,
                                             age.getTime() / 1000))
                          .then((stats: any) => {
                            fixResolve();
                            return Promise.resolve(undefined);
                          })
                          .catch(err => {
                            api.store.dispatch(actions.addNotification({
                              type: 'error',
                              title: 'Failed to change file times',
                              message: err.code === 'EPERM'
                                ? 'Game files are write protected'
                                : err.message,
                            }) as any);
                            fixResolve();
                          })),
        });
      })
      .catch(util.UserCanceled, () => Promise.resolve(undefined))
      .catch((err: Error) => {
        api.showErrorNotification('Failed to read bsa/ba2 files.', err, {
          allowReport: (err as any).code !== 'ENOENT',
        });
        return Promise.resolve(undefined);
      });
}

function applyIniSettings(api: types.IExtensionApi,
                          profile: types.IProfile,
                          iniFile: IniFile<any>) {
  if (iniFile.data.Archive === undefined) {
    iniFile.data.Archive = {};
  }
  iniFile.data.Archive.bInvalidateOlderFiles = 1;
  iniFile.data.Archive.sResourceDataDirsFinal = '';
}

interface IToDoProps {
  gameMode: string;
  mods: { [id: string]: types.IMod };
}

function useBSARedirection(gameMode: string) {
  return isSupported(gameMode) && (targetAge(gameMode) === undefined);
}

function init(context: types.IExtensionContext): boolean {
  context.registerTest('archive-backdate', 'gamemode-activated',
                       () => testArchivesAge(context.api));

  context.registerToDo(
    'bsa-redirection', 'workaround',
    (state: types.IState): IToDoProps => {
      const gameMode = selectors.activeGameId(state);
      return {
        gameMode,
        mods: util.getSafe(state, ['persistent', 'mods', gameMode], {}),
      };
    }, 'workaround',
    'Archive Invalidation', (props: IToDoProps) => toggleInvalidation(context.api, props.gameMode),
    (props: IToDoProps) => isSupported(props.gameMode) && bsaVersion(props.gameMode) !== undefined,
    (t: typeof I18next.t, props: IToDoProps) => (
      (props.mods[REDIRECTION_MOD] !== undefined) ? t('Yes') : t('No')
    ),
    undefined,
  );

  (context.registerSettings as any)('Workarounds', Settings, undefined, () =>
    useBSARedirection(selectors.activeGameId(context.api.store.getState())),
  );

  context.once(() => {
    context.api.onAsync('apply-settings',
      (profile: types.IProfile, filePath: string, ini: IniFile<any>) => {
        log('debug', 'apply AI settings', { gameId: profile.gameId, filePath });
        if (isSupported(profile.gameId)
            && (filePath.toLowerCase() === iniPath(profile.gameId).toLowerCase())) {
          applyIniSettings(context.api, profile, ini);
        }
        return Promise.resolve();
      });
  });

  return true;
}

export default init;
