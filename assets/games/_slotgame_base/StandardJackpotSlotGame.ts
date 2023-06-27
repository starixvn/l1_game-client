import { getLocale } from "../../common/auth/SessionManager";
import GameUtils from "../../common/GameUtils";
import WebViewGuide from "../../common/webview-guide/WebViewGuide";
import JackpotPoolInfoBase from "../../lobby/main/view-models/JackpotPoolInfoBase";
import { uiManager } from "../../managers/GameUIManager";
import { InternalEvents } from "../../managers/InternalEvents";
import StandardSlotGame from "./StandardSlotGame";
import StandarSlotGuide from "./StandarSlotGuide";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardJackpotSlotGame extends StandardSlotGame {
    @property(cc.Node)
    jackpotPoolNode: cc.Node = null;

    @property(cc.Node)
    topWinnersButton: cc.Node = null;

    private jackpotPoolPrefab: cc.Prefab;
    private jackpotSymbolIndex = 10;

    onLoad() {
        super.onLoad();
        uiManager.emitterListener(
            InternalEvents.RECEIVED_JACKPOT_POOLS_IN_GAME,
            (data) => {
                this.jackpotEnabled = data.length > 0;
                this.receiviedJackpotPools = data;
                this.handleJackotSymbol();
                this.loadJackpotPoolInfo();
                this.showHideTopWinnersButton();
            },
            this
        );
    }

    protected getPrefabsList() {
        const normalPrefabs = super.getPrefabsList();
        const jackpotPrefabs = {
            // prefab name : prefab property
            "effect-jackpot": "effectJackpot",
            "jackpot-pool": "jackpotPoolPrefab"
        };
        return Object.assign({}, normalPrefabs, jackpotPrefabs);
    }

    protected getSymbolName(index): string {
        const path = `preload/symbol-spines/`;
        let symbolName = `${path}symbol-${index}`;

        if (index === this.jackpotSymbolIndex) {
            if (!this.receiviedJackpotPools) {
                symbolName = `${path}symbol-loading`;
            } else {
                if (this.jackpotEnabled) {
                    const language = getLocale() === "vi-VN" ? `.${getLocale()}` : "";
                    symbolName = `${path}symbol-${index}.jackpot${language}`;
                }
            }
        }

        return symbolName;
    }

    private async handleJackotSymbol() {
        await this.updateJackpotSymbolCache();
        this.updateCorrectJackpotSymbol();
    }

    private async updateJackpotSymbolCache() {
        const prefabCache = uiManager.prefabCache.slotSymbols[this.gameId] || {};
        prefabCache[this.jackpotSymbolIndex] = await this.addSymbolCache(this.jackpotSymbolIndex);
        uiManager.prefabCache.slotSymbols[this.gameId] = prefabCache;
    }

    private updateCorrectJackpotSymbol() {
        this.slotBoard.reels.forEach((reel) => {
            reel.items.forEach((item) => {
                if (item.index === this.jackpotSymbolIndex) {
                    item.replaceItem(this.jackpotSymbolIndex);
                }
            });
        });
    }

    protected async loadJackpotPoolInfo() {
        if (!this.jackpotEnabled || !this.jackpotPoolNode) {
            return;
        }

        if (!this.jackpotPoolPrefab) {
            try {
                this.jackpotPoolPrefab = await GameUtils.loadResource(`shared/slot-game/jackpot-pool`);
            } catch (e) {
                cc.warn(`Missing jackpot pool`, e);
            }
        }
        const node = cc.instantiate(this.jackpotPoolPrefab);
        this.jackpotPoolInfo = node.getComponent(JackpotPoolInfoBase);
        this.jackpotPoolNode.addChild(node);
        this.updateJackpotPoolList();
    }

    override updateJackpotPool() {
        // override
    }

    showHideTopWinnersButton() {
        if (!this.topWinnersButton) {
            return;
        }
        this.topWinnersButton.active = this.jackpotEnabled;
    }

    protected getJackpotAmountByCurrency(amount) {
        return GameUtils.getValueByCurrency(amount);
    }

    handleGameGuide(guide: WebViewGuide, language, minBet, maxBet, isInPromotionTime) {
        const jackpotGuide = guide as StandarSlotGuide;
        jackpotGuide.enableJackpot = this.jackpotEnabled;
        super.handleGameGuide(guide, language, minBet, maxBet, isInPromotionTime);
    }
}
