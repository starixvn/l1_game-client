import WebViewGuide from "../../../common/webview-guide/WebViewGuide";
import AudioManager from "../../../common/audio/AudioManager";
import { MegaKeno1Id, MegaKeno2Id, MegaKeno3Id, MegaKeno4Id, MegaKeno5Id, MegaKeno6Id, MegaKeno7Id, MegaKeno8Id } from "./MegaKenoConfig";
import { getLanguage, getLocale } from "../../../common/auth/SessionManager";

const { ccclass, property } = cc._decorator;
@ccclass
export default class MegaKenoGuide extends cc.Component {
    @property(WebViewGuide)
    content: WebViewGuide = null;

    @property(cc.Node)
    mainFrame: cc.Node = null;

    // public miniKenos: MiniKeno[] = [];

    onLoad() {
        const commonDialog = this.mainFrame.getComponent("CommonDialog");
        commonDialog.addOnDidHide(() => {
            this.node.destroy();
        });
    }

    selectGame(event, game) {
        this.select(game);
    }

    select(gameId: number) {
        AudioManager.getInstance().playClick();

        // const minikeno = this.miniKenos.find((keno) => keno.gameId === gameId);
        // const { minBet, maxBet } = minikeno.getBetRange();
        // const locale = getLocale();
        // const language = getLanguage(locale !== "vi-VN" && locale !== "en-US" ? "en-US" : locale);
        // this.content.initURL(gameId, language, { minBet, maxBet, used: minikeno.isUsingMaxStakeLevel() });
        // this.content.sendDataToIframe(minikeno.gameConfigs);
        // this.content.loadWebView();
    }

    getGameId(game: string) {
        const dict = {
            megaKeno: MegaKeno1Id,
            megaKeno2: MegaKeno2Id,
            kenoMini: MegaKeno3Id,
            kenoMini2: MegaKeno4Id,
            kenoDong: MegaKeno5Id,
            kenoTay: MegaKeno6Id,
            kenoNam: MegaKeno7Id,
            kenoBac: MegaKeno8Id
        };

        return dict[game];
    }
}
