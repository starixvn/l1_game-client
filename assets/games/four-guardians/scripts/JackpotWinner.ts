import GameUtils from "../../../common/GameUtils";
import PopupMinigames from "../../../mini-games-panel/view-models/popup/PopupMinigames";
import { numberWithCommas } from "./../../../common/helpers/NumberHelper";
import NotificationService from "../../../common/auth/NotificationService";

const { ccclass, property } = cc._decorator;

@ccclass
export default class JackpotWinner extends cc.Component {
    @property(cc.Label)
    username: cc.Label = null;

    @property(cc.Label)
    amount: cc.Label = null;

    @property(cc.Label)
    gameName: cc.Label = null;

    private readonly dataKey = "jackpotWinner";
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
        NotificationService.getInstance().addDataObserver(this.dataKey, this.dataKey, this.onData.bind(this));
    }

    onDestroy() {
        NotificationService.getInstance().removeDataObserver(this.dataKey, this.dataKey);
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

            this.gameName.string = GameUtils.getGameNameString(data.gameId);

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
