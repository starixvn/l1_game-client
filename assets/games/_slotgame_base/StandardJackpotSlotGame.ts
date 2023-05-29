import { getLocale } from "../../common/auth/SessionManager";
import GameUtils from "../../common/GameUtils";
import { userManager } from "../../common/user/UserManager";
import JackpotPoolInfoBase from "../../lobby/main/view-models/JackpotPoolInfoBase";
import { uiManager } from "../../managers/GameUIManager";
import { InternalEvents } from "../../managers/InternalEvents";
import StandardSlotGame from "./StandardSlotGame";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardJackpotSlotGame extends StandardSlotGame {
    @property(cc.Node)
    jackpotPoolNode: cc.Node = null;
    @property(cc.Node)
    topWinnersButton: cc.Node = null;

    private readonly jackpotPoolPrefab: cc.Prefab;

    onLoad() {
        super.onLoad();
        uiManager.emitterListener(InternalEvents.CLICK_HAMBURGER_MENU, this.hideTopWinnersButton.bind(this), this);
    }

    getPrefabsList() {
        const normalPrefabs = super.getPrefabsList();
        const jackpotPrefabs = {
            // prefab name : prefab property
            "effect-jackpot": "effectJackpot",
            "jackpot-pool": "jackpotPoolPrefab"
        };
        return Object.assign({}, normalPrefabs, jackpotPrefabs);
    }

    getSymbolName(index): string {
        let symbolName = `preload/symbol-spines/symbol-${index}`;
        if (index === 10 && this.jackpotEnabled) {
            const language = getLocale();
            symbolName = `preload/symbol-spines/symbol-${index}.jackpot${language === "vi-VN" ? `.${language}` : ""}`;
        }
        return symbolName;
    }

    loadJackpotPoolInfo() {
        if (!this.jackpotEnabled || !this.jackpotPoolNode) {
            return;
        }
        const node = cc.instantiate(this.jackpotPoolPrefab);
        this.jackpotPoolInfo = node.getComponent(JackpotPoolInfoBase);
        this.jackpotPoolNode.addChild(node);
        this.updateJackpotPoolList();
    }

    updateJackpotPool() {
        // empty
    }

    hideTopWinnersButton() {
        if (!this.topWinnersButton) {
            return;
        }
        this.topWinnersButton.active = this.jackpotEnabled;
    }

    public get jackpotEnabled() {
        return !userManager.disableJackpotGames;
    }

    protected getJackpotAmountByCurrency(amount) {
        return GameUtils.getValueByCurrency(amount);
    }
}
