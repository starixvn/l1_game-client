import { GameIds } from '../../../configs/SabaConfigs';
import HeroesSlot from '../../AHCL/scripts/HeroesSlot';

const { ccclass, property } = cc._decorator;

@ccclass
export default class NightClub extends HeroesSlot {
    constructor() {
        super();
        this.gameId = GameIds.NightClub;
        this.setMiniPanelScale(1);
    }
}
