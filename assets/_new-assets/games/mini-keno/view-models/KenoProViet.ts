import GameRoomBase from "../../_base/GameRoomBase";
import { GameState } from "../../_base/GameBase";
import SnappedScrollView from "../../../common/bet-chips/view-models/SnappedScrollView";
import MiniKeno, { KenoType } from "../../mini-keno/view-models/MiniKeno";
import MiniKenoProViet from "../../mini-keno-pro-viet/view-models/MiniKenoProViet";
import * as _ from "lodash";
const { ccclass, property } = cc._decorator;

@ccclass
export default class KenoProViet extends cc.Component {
    @property(cc.Prefab)
    kenoPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    kenoProVietPrefab: cc.Prefab = null;

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

    @property(cc.Prefab)
    guidePrefab: cc.Prefab = null;

    @property
    displaySize = 3;

    @property
    movingStep = 1;

    private selectedIndex = 0;
    private childList: cc.Node[] = [];
    private allGames = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    private favouriteGames = [];

    private initAllKeno() {
        const content = cc.sys.localStorage.getItem('keno_favourites') || "[]";
        this.favouriteGames = JSON.parse(content);
        const otherGames = _.difference(this.allGames, this.favouriteGames);
        const sortedGames = [...this.favouriteGames, ...otherGames];
        sortedGames.forEach(type => {
            const node = cc.instantiate(type === 0 ? this.kenoProVietPrefab : this.kenoPrefab);
            const keno = node.getComponent(MiniKeno);
            keno.kenoType = type;
            keno.onFavoriteChanged = (a, b) => this.onFavoriteChanged(a, b);
            this.content.addChild(node);
        });

        const layout = this.content.getComponent(cc.Layout);
        layout.updateLayout();
        layout.enabled = false;
    }

    private saveFavourites() {
        cc.sys.localStorage.setItem('keno_favourites', JSON.stringify(this.favouriteGames));
    }

    private onFavoriteChanged(favourite: boolean, type: number) {
        if (favourite) {
            this.favouriteGames.push(type);
        } else {
            _.remove(this.favouriteGames, (game) => game === type);
        }
        this.saveFavourites();
        console.log(`favourite list ${this.favouriteGames}`);
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
        let node = cc.instantiate(this.guidePrefab);
        this.node.addChild(node);
    }

    openHistory() {
        cc.RedT.audio.playClick();
        let node = cc.instantiate(this.historyPrefab);
        this.node.addChild(node);
    };
}
