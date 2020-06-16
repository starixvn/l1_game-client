import GameRoomBase from "../../_base/GameRoomBase";
import { GameState } from "../../_base/GameBase";
import SnappedScrollView from "../../../common/bet-chips/view-models/SnappedScrollView";
import MiniKeno, { KenoType } from "../../mini-keno/view-models/MiniKeno";

const { ccclass, property } = cc._decorator;

@ccclass
export default class KenoProViet extends cc.Component {
    @property(cc.Prefab)
    kenoPrefab: cc.Prefab = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(SnappedScrollView)
    snappedScrollView: SnappedScrollView = null;

    @property(cc.Node)
    leftButton: cc.Node = null;

    @property(cc.Node)
    rightButton: cc.Node = null;

    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

    @property
    displaySize = 3;

    @property
    movingStep = 1;

    private selectedIndex = 0;
    private childList: cc.Node[] = [];
    private gameIndexes = [];

    private initAllKeno() {
        this.gameIndexes = [0, 1, 2, 3, 4, 5, 6, 7];

        this.gameIndexes.forEach(index => {
            const node = cc.instantiate(this.kenoPrefab);
            const keno = node.getComponent(MiniKeno);
            keno.kenoType = this.gameIndexes[index];
            keno.onFavoriteChanged = (favourite: boolean) => {
                if (favourite) {

                }
            };
            this.content.addChild(node);
        });
    }

    private updateFavourite() {

    }

    onLoad() {
        if (!cc.sys.isMobile) {
            this.node.scale = 1.25;
        }

        this.initAllKeno();
        this.leftButton.active = false;
        this.childList = [...this.content.children];
        this.snappedScrollView.onScrollEnded = () => {
            var min = this.snappedScrollView.getMinDisplayIndex();
            if (this.selectedIndex < min) {
                this.selectedIndex = min;
            } else if (this.selectedIndex > min + this.displaySize) {
                this.selectedIndex = min + this.displaySize;
            }
            this.updateArrowVisibility();
        };
    }

    onEnable() {
        this.selectedIndex = 0;
        this.snappedScrollView.scrollTo(0);
        this.scrollToSelectedIndex();
    }

    private updateArrowVisibility() {
        this.leftButton.active = true;
        this.rightButton.active = true;
        if (this.selectedIndex <= 0) {
            this.selectedIndex = 0;
            this.leftButton.active = false;
        } else if (this.selectedIndex >= this.childList.length - this.displaySize) {
            this.selectedIndex = this.childList.length - this.displaySize;
            this.rightButton.active = false;
        }
    }

    public onPrevious() {
        cc.RedT.audio.playClick();
        this.selectedIndex -= this.movingStep;
        this.scrollToSelectedIndex();
    }

    public onNext() {
        cc.RedT.audio.playClick();
        this.selectedIndex += this.movingStep;
        this.scrollToSelectedIndex();
    }

    private scrollToSelectedIndex() {
        this.snappedScrollView.scrollTo(this.selectedIndex);
        this.updateArrowVisibility();
    }

    openGame() {
        // this.node.active = true;
    }

    closeGame() {
        cc.RedT.audio.playClick();
        this.node.active = false;
    }

    onSignIn() {

    }

    openGuide() {
        cc.RedT.audio.playClick();
    }

    openHistory() {
        cc.RedT.audio.playClick();
        let node = cc.instantiate(this.historyPrefab);
        this.node.addChild(node);
    };
}
