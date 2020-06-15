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

    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

    onLoad() {
        this.initAllKeno();
        this.leftButton.active = false;
        this.childList = [...this.content.children];
        this.snappedScrollView.onScrollEnded = () => {
            var min = this.snappedScrollView.getMinDisplayIndex();
            if (this.selectedIndex < min) {
                this.selectedIndex = min;
            } else if (this.selectedIndex > min + this.displaySize - 1) {
                this.selectedIndex = min + this.displaySize - 1;
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
        } else if (this.selectedIndex >= this.childList.length - 1) {
            this.selectedIndex = this.childList.length - 1;
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
        this.updateArrowVisibility();

        var min = this.snappedScrollView.getMinDisplayIndex();
        if (this.selectedIndex <= min && min > 0) {
            this.snappedScrollView.scrollTo(min - 1);
        }
        if (this.selectedIndex >= min + this.displaySize - 1) {
            this.snappedScrollView.scrollTo(min + 1);
        }
    }

    openGame() {
        // this.node.active = true;
    }

    onSignIn() {

    }

    openHistory() {
       
        let node = cc.instantiate(this.historyPrefab);
        this.node.addChild(node);
    };
}
