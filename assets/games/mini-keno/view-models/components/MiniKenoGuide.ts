import AudioManager from "../../../../common/audio/AudioManager";
import { getLanguage, getLocale } from "../../../../common/auth/SessionManager";
import WebViewGuide from "../../../../common/webview-guide/WebViewGuide";
import {
    KenoEastId,
    KenoMax2Id,
    KenoMaxId,
    KenoMini2Id,
    KenoMiniId,
    KenoNorthId,
    KenoSouthId,
    KenoWestId,
    MegaKeno2Id,
    MegaKenoId,
} from "../KenoUtils";
import MiniKeno from "../MiniKeno";

const { ccclass, property } = cc._decorator;
@ccclass
export default class MiniKenoGuide extends cc.Component {
    @property(cc.Node)
    sideBar: cc.Node = null;

    @property(WebViewGuide)
    content: WebViewGuide = null;

    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.Node)
    mainFrame: cc.Node = null;

    public miniKenos: MiniKeno[] = [];

    onLoad() {
        const commonDialog = this.mainFrame.getComponent("CommonDialog");
        commonDialog.addOnDidHide(() => {
            this.node.destroy();
        });
    }

    start() {
        this.select("megaKeno");
    }

    setLabelString(nodeLabel: any, replaceData: any) {
        nodeLabel.forEach((label) => {
            Object.keys(replaceData).forEach((key) => {
                label.string = label.string.replace(key, replaceData[key]);
            });
        });
    }

    selectGame(event, game) {
        this.select(game);
    }

    select(game: string) {
        AudioManager.getInstance().playClick();
        Promise.all(
            this.sideBar.children.map((obj) => {
                if (obj.name === game) {
                    obj.children[0].color = new cc.Color(244, 223, 109, 255);
                    obj.pauseSystemEvents(true);
                    this.title.string = obj.children[0].getComponent(cc.Label).string;
                } else {
                    obj.children[0].color = new cc.Color(255, 255, 255, 255);
                    obj.resumeSystemEvents(true);
                }
                return void 0;
            })
        );

        const id = this.getGameId(game);
        const minikeno = this.miniKenos.find((keno) => keno.gameId === id);
        const { minBet, maxBet } = minikeno.getBetRange();
        const locale = getLocale();
        const language = getLanguage(locale !== "vi-VN" && locale !== "en-US" ? "en-US" : locale);
        this.content.initURL(id, language, { minBet, maxBet, used: minikeno.isUsingMaxStakeLevel() });
        this.content.sendDataToIframe(minikeno.gameConfigs);
        this.content.loadWebView();
    }

    getGameId(game: string) {
        const dict = {
            kenoMax: KenoMaxId,
            kenoMax2: KenoMax2Id,
            megaKeno: MegaKenoId,
            megaKeno2: MegaKeno2Id,
            kenoMini: KenoMiniId,
            kenoMini2: KenoMini2Id,
            kenoDong: KenoEastId,
            kenoTay: KenoWestId,
            kenoNam: KenoSouthId,
            kenoBac: KenoNorthId
        };

        return dict[game];
    }
}
