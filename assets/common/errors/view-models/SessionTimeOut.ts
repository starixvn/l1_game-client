import SocketController from "../../../SocketController";

const { ccclass } = cc._decorator;

@ccclass
export default class SessionTimeOut extends cc.Component {
    onLoad() {
        SocketController.getInstance().closeAllSocket();
    }
}
