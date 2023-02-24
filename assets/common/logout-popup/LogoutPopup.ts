import { redirectToLoginPage } from "../auth/SGConnectAPI";
import CommonDialog from "../_base/view-models/CommonDialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LogoutPopup extends cc.Component {
    @property(CommonDialog)
    commonDialog: CommonDialog = null;

    onLoad() {
        //    super.onLoad();
        console.log("on load", this.commonDialog);
        if (this.commonDialog) {
            this.commonDialog.addOnDidHide(() => {
                console.log("destroy");
                this.node.destroy();
            });
        }
    }

    public logout() {
        console.log("logout");
        redirectToLoginPage();
    }
}
