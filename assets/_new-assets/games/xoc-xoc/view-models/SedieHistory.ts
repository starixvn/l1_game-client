const { ccclass, property } = cc._decorator;

@ccclass
export default class SedieHistory extends cc.Component {

    @property(cc.Prefab)
    page: cc.Prefab = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.SpriteFrame)
    iconRed: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    iconWhite: cc.SpriteFrame = null;

    private socket: SocketIOClient.Socket;

    init(socket: SocketIOClient.Socket) {
        this.socket = socket;
    }

    onEnable() {
        this.get_data();
    }

    get_data(page = 1) {
        this.socket.emit('getHistory', { page: page });
    }
}