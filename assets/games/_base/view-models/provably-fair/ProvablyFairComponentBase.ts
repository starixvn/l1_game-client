import GameUtils from "../../../../common/GameUtils";
import CommonDialog from "../../../../common/_base/view-models/CommonDialog";
import WebViewGuide from "../../../../common/webview-guide/WebViewGuide";
import MiniPanel from "../../../../mini-games-panel/view-models/MiniPanel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ProvablyFairComponentBase extends cc.Component {
    @property(CommonDialog)
    commonDialog: CommonDialog = null;

    @property(cc.Prefab)
    guideProvablyFairPrefab: cc.Prefab = null;

    private _gameId = 0;
    private _themeGuide = "blue";
    private _gameConfigs = {};

    public miniPanel: MiniPanel = null;

    callbackHandle() {
        // handle
    }

    updateGameId(gameId: number) {
        this._gameId = gameId;
    }

    updateThemeGuide(theme: string) {
        this._themeGuide = theme;
    }

    updateGameConfigs(gameConfigs: unknown) {
        this._gameConfigs = gameConfigs;
    }

    onLoad() {
        this.commonDialog.addOnDidHide(() => {
            this.statusNode(false);
        });
    }

    onShow() {
        this.statusNode(true);
        this.commonDialog.showDialog();
    }

    onHide() {
        this.commonDialog.closeDialogWithoutAnim();
        this.statusNode(false);
    }

    statusNode(active: boolean) {
        this.node.active = active;
    }

    onCloseClick() {
        this.commonDialog.closeDialog();
    }

    onGuideClick() {
        const dialog = cc.instantiate(this.guideProvablyFairPrefab);
        const guide = dialog.getComponent(WebViewGuide);
        guide.setURL(GameUtils.getUrlBFGuide(this._gameId, this._themeGuide));
        guide.sendDataToIframe(this._gameConfigs);
        this.getContainerGuide().addChild(dialog);

        guide.loadWebView();
    }

    getContainerGuide() {
        return this.miniPanel?.dialog;
    }
}
