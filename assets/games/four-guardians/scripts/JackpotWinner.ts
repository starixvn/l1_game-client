import PopupMinigames from "../../../mini-games-panel/view-models/popup/PopupMinigames";
import * as SabaConfigs from "../../../SabaConfigs";
import { numberWithCommas } from "./../../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class JackpotWinner extends cc.Component {
    @property(cc.Label)
    username: cc.Label = null;

    @property(cc.Label)
    amount: cc.Label = null;

    @property(cc.Label)
    gameName: cc.Label = null;

    private readonly dataObserverKey = "JackpotWinner";
    popupMiniGame: PopupMinigames = null;

    onLoad() {
        this.addDataObserver();
        this.resetJackPotWinner();
    }

    resetJackPotWinner() {
        this.username.string = "";
        this.amount.string = "";
        this.gameName.string = "";
    }

    addDataObserver() {
        cc.RedT.addDataObserver(this.dataObserverKey, this.receivedData.bind(this));
    }

    receivedData(data) {
        if (data["jackpotWinner"]) {
            this.onData(data["jackpotWinner"]);
        }
    }

    onDestroy() {
        this.removeDataObserver();
    }

    removeDataObserver() {
        cc.RedT.removeDataObserver(this.dataObserverKey);
    }

    onData(data: any) {
        if (cc.RedT.user.name !== data.winnerName) {
            const jackPotContainer = this.popupMiniGame.jackPotContainer;
            jackPotContainer.width = this.node.width;
            jackPotContainer.height = this.node.height;

            const menuIcon = this.popupMiniGame.menuIcon;
            menuIcon.active = false;

            this.username.string = data.winnerName;
            this.amount.string = numberWithCommas(data.amount);

            const key = Object.keys(SabaConfigs.games).find((key) => SabaConfigs.games[key].id === data.gameId);
            this.gameName.string = SabaConfigs.games[key].name;

            jackPotContainer.active = true;

            cc.tween(this)
                .delay(6)
                .call(() => {
                    jackPotContainer.active = false;
                    menuIcon.active = true;
                })
                .start();
        }
    }
}
