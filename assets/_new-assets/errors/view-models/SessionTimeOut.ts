
import BaseSocketIOController from '../../BaseSocketIOController';

const { ccclass, property } = cc._decorator;

@ccclass
export default class SessionTimeOut extends cc.Component {
    onLoad() {
        BaseSocketIOController.getInstance().closeAllSocket();
    }
}
