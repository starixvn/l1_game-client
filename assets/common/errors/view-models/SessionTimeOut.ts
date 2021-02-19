import { lazyInject } from "../../../Application";
import SocketIOController from "../../../SocketIOController";

const { ccclass } = cc._decorator;

@ccclass
export default class SessionTimeOut extends cc.Component {
    @lazyInject(SocketIOController)
    private readonly socketIOController: SocketIOController;

    onLoad() {
        this.socketIOController.closeAllSocket();
    }
}
