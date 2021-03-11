import { games } from '../../../configs/SabaConfigs';
import MiniPanel from '../../../mini-games-panel/view-models/MiniPanel';
import BigSmall from '../../tai-xiu/view-models/BigSmall';
import TurboBigSmallTimeHandler from '../../turbo-tai-xiu/view-models/handlers/TurboBigSmallTimeHandler';
import { TurboBigSmallConfigs } from '../../turbo-tai-xiu/view-models/TurboBigSmallConfigs';
import TurboOddEvenBetHistory from './TurboOddEvenBetHistory';
import TurboOddEvenGuide from './TurboOddEvenGuide';
import TurboOddEvenStatistic from './TurboOddEvenStatistic';

const { ccclass } = cc._decorator;

@ccclass
export default class TurboOddEven extends BigSmall {
    protected gameTitle = games.TurboOddEven.name;

    protected readonly choices = ["odd", "even"];

    get gameId() {
        return games.TurboOddEven.id;
    }

    initHandlers() {
        super.initHandlers();
        this.timeHandler = new TurboBigSmallTimeHandler(this);
    }

    initMiniPanel(miniPanel: MiniPanel) {
        this.init("OETurbo", new TurboBigSmallConfigs(), miniPanel);
    }

    public updateOddsFromConfigs() {
        if (this.gameConfigs.odds) {
            this.odds.string = `1:${this.gameConfigs.odds.even}`;
        }
    }

    public openGuide() {
        cc.RedT.audio.playClick();

        const guide = cc.instantiate(this.guidePrefab);
        const specialSedieGuide = guide.getComponent(TurboOddEvenGuide);
        specialSedieGuide.init(this.gameConfigs);
        this.currentMiniPanel.node.addChild(guide);
    }

    openBetHistory(roundId: number) {
        cc.RedT.audio.playClick();

        const node = cc.instantiate(this.betHistoryPrefab);
        this.betHistory = node.getComponent(TurboOddEvenBetHistory);
        this.betHistory.gameTitle = this.gameTitle;
        this.betHistory.init(this, roundId);
        this.currentMiniPanel.node.addChild(node);
    }

    public openStatistic() {
        cc.RedT.audio.playClick();

        const node = cc.instantiate(this.statisticPrefab);
        this.statistic = node.getComponent(TurboOddEvenStatistic);
        this.statistic.gameTitle = this.gameTitle;
        this.statistic.init(this.currentDataLogs);
        this.currentMiniPanel.node.addChild(node);
    }
}
