import { getLocale } from "../../../../common/auth/SessionManager";
import WebViewGuide from "../../../../common/webview-guide/WebViewGuide";
import { games } from "../../../../configs/SabaConfigs";
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
        commonDialog.onDidHide = () => {
            this.node.destroy();
        };
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
        cc.RedT.audio.playClick();
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
        this.content.initURL(id, minBet, maxBet, getLocale());
        this.content.loadWebView();
    }

    getGameId(game: string) {
        const dict = {
            kenoMax: games.KenoMax,
            kenoMax2: games.KenoMax2,
            kenoMini: games.KenoMini,
            kenoMini2: games.KenoMini2,
            kenoDong: games.KenoEast,
            kenoTay: games.KenoWest,
            kenoNam: games.KenoSouth,
            kenoBac: games.KenoNorth
        };

        return dict[game].id;
    }
}
