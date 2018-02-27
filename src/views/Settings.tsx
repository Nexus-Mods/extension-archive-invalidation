import { isSupported, targetAge } from '../util/gameSupport';

import { toggleInvalidation } from '../bsaRedirection';
import { REDIRECTION_MOD } from '../constants';

import * as React from 'react';
import { FormGroup, HelpBlock, ControlLabel } from 'react-bootstrap';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import * as Redux from 'redux';
import { ComponentEx, selectors, Toggle, types } from 'vortex-api';

export interface IBaseProps {
}

interface IConnectedProps {
  gameMode: string;
  mods: { [id: string]: types.IMod };
}

interface IActionProps {
}

type IProps = IBaseProps & IActionProps & IConnectedProps;

class Settings extends ComponentEx<IProps, {}> {
  public render(): JSX.Element {
    const { t, gameMode, mods } = this.props;

    if (!isSupported(gameMode) || (targetAge(gameMode) !== undefined)) {
      return null;
    }

    return (
      <form>
        <FormGroup controlId='redirection'>
          <ControlLabel>{t('Archive Invalidation')}</ControlLabel>
          <Toggle
            checked={mods[REDIRECTION_MOD] !== undefined}
            onToggle={this.toggle}
          >
            {t('BSA redirection')}
          </Toggle>
          <HelpBlock>
            {t('This adds a mod to vortex that provides Archive Invalidation '
             + 'similar to mods like "Archive Invalidation Invalidated".')}
          </HelpBlock>
        </FormGroup>
      </form>
    );
  }

  private toggle = (enabled: boolean) => {
    const { gameMode } = this.props;
    toggleInvalidation(this.context.api, gameMode)
    .then(() => null);
  }
}

function mapStateToProps(state: types.IState): IConnectedProps {
  const gameMode = selectors.activeGameId(state);
  return {
    gameMode,
    mods: state.persistent.mods[gameMode],
  };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>): IActionProps {
  return {
  };
}

export default
  translate(['common'], { wait: false })(
    connect(mapStateToProps, mapDispatchToProps)(Settings),
  ) as React.ComponentClass<{}>;
