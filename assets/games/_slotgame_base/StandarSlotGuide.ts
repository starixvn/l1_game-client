import * as config from "../../../assets/configs/Configs";
import GameUtils from "../../common/GameUtils";
import WebViewGuide from "../../common/webview-guide/WebViewGuide";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandarSlotGuide extends WebViewGuide {
    initURL(
        gameId: number,
        language: string,
        configStake: { minBet: number; maxBet: number; used: boolean },
        isInPromotionTime: boolean,
        fractionalOddsFormat: boolean | undefined,
        specialDirection = ""
    ) {
        const domain = config.guideDomain;
        const displayName = GameUtils.getGameNameString(gameId);
        let url = `${domain}/${language}?gId=${gameId}&displayName=${displayName}&t=${
            this.themeName
        }&p=${isInPromotionTime}&f=c&v=${Date.now()}&fof=${fractionalOddsFormat}`;
        this.url = url;
    }
}
