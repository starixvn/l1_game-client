import { getStringDateByTime } from "./../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "./../../common/helpers/NumberHelper";
import PaginationCommon from "./../../common/helpers/Pagination/PaginationCommon";
import SlotGameTopWinnerItem from "./SlotGameTopWinnerItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotGameTopWinner extends cc.Component {
    @property(PaginationCommon)
    pagination: PaginationCommon = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    mainFrame: cc.Node = null;

    @property(cc.Sprite)
    topWinnerButton: cc.Sprite = null;

    @property(cc.Sprite)
    jackpotButton: cc.Sprite = null;

    @property(cc.SpriteFrame)
    activeButtonSprite: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    inActiveButtonSprite: cc.SpriteFrame = null;

    @property(cc.Node)
    bigWinningNode: cc.Node = null;

    @property(cc.Node)
    jackpotWinnerNode: cc.Node = null;

    @property(cc.Node)
    backgroundNode: cc.Node = null;

    @property(cc.Layout)
    mainLayout: cc.Layout = null;

    @property(cc.Node)
    tabContainer: cc.Node = null;

    private socket: SocketIOClient.Socket;
    private gameName: string;
    private jackpotEnabled = false;

    topWinnerView = "getBigWinningWinners";

    init(socket: SocketIOClient.Socket, gameName: string, jackpotEnabled = true) {
        this.socket = socket;
        this.gameName = gameName;
        this.jackpotEnabled = jackpotEnabled;
    }

    onLoad() {
        this.pagination.init(this);

        const commonDialog = this.mainFrame.getComponent("CommonDialog");
        commonDialog.onDidHide = () => {
            this.node.destroy();
        };

        this.showBigWinningView(true);

        this.socket.on(this.gameName, this.receivedData.bind(this));

        if (!this.jackpotEnabled) {
            this.tabContainer.active = false;
            this.mainLayout.updateLayout();
            this.mainLayout.enabled = false;

            this.backgroundNode.height = this.mainLayout.node.height;
        }
    }

    onDestroy() {
        this.socket.off(this.gameName, this.receivedData.bind(this));
    }

    onEnable() {
        this.get_data();
    }

    get_data(page = 1) {
        this.socket && this.socket.connected && this.socket.emit(this.topWinnerView, { page: page });
    }

    receivedData(data) {
        if (!this.node || !this.node.isValid) {
            return;
        }

        let topWinnerData = null;

        if (data.bigWinningWinners) {
            topWinnerData = data.bigWinningWinners;
        }

        if (data.jackpotWinners) {
            topWinnerData = data.jackpotWinners;
        }

        if (!topWinnerData) {
            return;
        }

        this.onData(topWinnerData);
    }

    onData(data) {
        const { page, pageSize, total, winners } = data;
        this.pagination.onSet(page, pageSize, total);
        this.content.destroyAllChildren();

        if (winners && winners.length) {
            winners.map((player, index) => {
                const itemNode = cc.instantiate(this.itemPrefab);
                const item = itemNode.getComponent(SlotGameTopWinnerItem);
                item.bg.active = index % 2 > 0;
                item.time.string = getStringDateByTime(player.time);
                item.player.string = player.name;

                if (this.topWinnerView === "getBigWinningWinners") {
                    item.amount.string = player.freeSpin ? "Free Spin" : numberWithCommas(player.totalAmount, 1);
                } else {
                    item.amount.string = numberWithCommas(player.bet, 1);
                }

                item.win.string = numberWithCommas(player.winningAmount);

                if (cc.RedT.user.name === player.name) {
                    item.time.node.color = cc.Color.YELLOW;
                    item.player.node.color = cc.Color.YELLOW;
                    item.amount.node.color = cc.Color.YELLOW;
                    item.win.node.color = cc.Color.YELLOW;
                }

                this.content.addChild(itemNode);
            });
        }
    }

    changeView(event, mode: number) {
        switch (+mode) {
            case 1:
                this.topWinnerView = "getBigWinningWinners";
                this.showBigWinningView(true);
                this.get_data();
                break;
            case 2:
                this.topWinnerView = "getJackpotWinners";
                this.showBigWinningView(false);
                this.get_data();
                break;
        }
        this.pagination.resetPageCurrent();
    }

    showBigWinningView(status: boolean) {
        this.topWinnerButton.spriteFrame = status ? this.activeButtonSprite : this.inActiveButtonSprite;
        this.jackpotButton.spriteFrame = status ? this.inActiveButtonSprite : this.activeButtonSprite;

        this.bigWinningNode.active = status;
        this.jackpotWinnerNode.active = !status;
    }
}
