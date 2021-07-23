import CommonDialog from "../../common/_base/view-models/CommonDialog";
import NoticeUtil from "../../common/utils/NoticeUtil";
import MainGame from "../main/view-models/MainGame";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Dialog extends cc.Component {
    @property(cc.Prefab)
    signNamePrefab: cc.Prefab = null;

    main: MainGame;
    currentDialog: CommonDialog;
    signName: any;

    init(main) {
        this.main = main;
        this.node.active = false;
    }

    onClickBack() {
        cc.RedT.audio.playUnClick();
        this.onBack();
    }

    onBack() {
        this.onCloseDialog();
    }

    onCloseDialog() {
        if (this.currentDialog != null) {
            this.currentDialog.closeDialog();
        } else {
            this.node.active = false;
        }
    }

    /**
     * Function Show Dialog
     */
    showSignName() {
        if (!this.signName) {
            const node = cc.instantiate(this.signNamePrefab);
            this.node.addChild(node);
            this.signName = node.getComponent("SignName");
            this.signName.init(this.handleSignName.bind(this));
        }
        this.node.active = this.signName.node.active = true;
        this.currentDialog = this.signName.dialogNode.getComponent(CommonDialog);
        this.currentDialog.addOnDidHide(() => (this.node.active = false));
    }

    handleSignName(response) {
        if (response.authorized) {
            this.main.handleUserData(response.user);
        } else {
            const errorCode = response.errorCode;
            const text = NoticeUtil.getLocalizedErrorMessage(errorCode, { errorCode });
            this.main.showNotice({ text: text });
        }

        this.main.serviceAuthorized(response.authorized);
    }
}
