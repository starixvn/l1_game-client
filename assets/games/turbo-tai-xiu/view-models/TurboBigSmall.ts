import { games } from '../../../configs/SabaConfigs';
import SabaConfigs = require('../../../configs/SabaConfigs');
import MiniPanel from '../../../mini-games-panel/view-models/MiniPanel';
import BigSmall from '../../tai-xiu/view-models/BigSmall';
import TurboBigSmallTimeHandler from './handlers/TurboBigSmallTimeHandler';
import { TurboBigSmallConfigs } from './TurboBigSmallConfigs';

const { ccclass } = cc._decorator;

@ccclass
export default class TurboBigSmall extends BigSmall {
    protected gameTitle = SabaConfigs.games.TurboBigSmall.name;

    get gameId() {
        return games.TurboBigSmall.id;
    }

    initMiniGame(miniPanel: MiniPanel) {
        this.init("TXTurbo", new TurboBigSmallConfigs(), miniPanel);
    }

    initHandlers() {
        super.initHandlers();

        this.timeHandler = new TurboBigSmallTimeHandler(this);
    }
}
