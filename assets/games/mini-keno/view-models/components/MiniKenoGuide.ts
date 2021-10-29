import AudioManager from "../../../../common/audio/AudioManager";
import { getLanguage, getLocale } from "../../../../common/auth/SessionManager";
import WebViewGuide from "../../../../common/webview-guide/WebViewGuide";
import { GameIds } from "../../../../configs/SabaConfigs";
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
        this.select("kenoMax");
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
        const language = getLanguage(locale);
        this.content.initURL(id, language, { minBet, maxBet, used: minikeno.isUsingMaxStakeLevel() });
        this.content.sendDataToIframe(minikeno.gameConfigs);
        this.content.loadWebView();
    }

    getGameId(game: string) {
        const dict = {
            kenoMax: GameIds.KenoMax,
            kenoMax2: GameIds.KenoMax2,
            kenoMini: GameIds.KenoMini,
            kenoMini2: GameIds.KenoMini2,
            kenoDong: GameIds.KenoEast,
            kenoTay: GameIds.KenoWest,
            kenoNam: GameIds.KenoSouth,
            kenoBac: GameIds.KenoNorth
        };

        return dict[game];
    }
}
