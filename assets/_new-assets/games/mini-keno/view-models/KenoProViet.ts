import GameRoomBase from "../../_base/GameRoomBase";
import { GameState } from "../../_base/GameBase";
import SnappedScrollView from "../../../common/bet-chips/view-models/SnappedScrollView";
import MiniKeno, { KenoType } from "../../mini-keno/view-models/MiniKeno";
import MiniKenoProViet from "../../mini-keno-pro-viet/view-models/MiniKenoProViet";
import * as _ from "lodash";
import MiniKenoPresetBet from "./MiniKenoPresetBet";
import DraggableItem from "../../../common/draggable-layout/view-models/DraggableItem";
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

    @property(cc.Node)
    presetNode: cc.Node = null;

    @property(cc.Prefab)
    presetBetPrefab: cc.Prefab = null;

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
    private sortedGames = [];
    private miniKenos: MiniKeno[] = [];
    private contentLayout: cc.Layout;
    private presetBet: MiniKenoPresetBet;
    private presetBetValue = 0;

    private initAllKeno() {
        const content = cc.sys.localStorage.getItem('keno_favourites') || "[]";
        this.favouriteGames = JSON.parse(content);
        const otherGames = _.difference(this.allGames, this.favouriteGames);
        this.sortedGames = [...this.favouriteGames, ...otherGames];
        this.sortedGames.forEach((type, index) => {
            const node = cc.instantiate(type === 0 ? this.kenoProVietPrefab : this.kenoPrefab);
            const keno = node.getComponent(MiniKeno);
            keno.kenoType = type;
            keno.favourite.isChecked = index < this.favouriteGames.length;
            keno.onFavoriteChanged = (a, b) => this.onFavoriteChanged(a, b);
            keno.getPreset = () => this.presetBetValue;
            this.content.addChild(node);
            this.miniKenos.push(keno);
        });

        this.contentLayout = this.content.getComponent(cc.Layout);
        this.contentLayout.updateLayout();
        this.contentLayout.enabled = false;
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
        this.updateGameLayout(type);
    }

    private updateGameLayout(updatedType: number) {
        const left = this.contentLayout.paddingLeft;
        const spacing = this.contentLayout.spacingX;
        const otherGames = _.difference(this.allGames, this.favouriteGames);
        this.sortedGames = [...this.favouriteGames, ...otherGames];
        this.sortedGames.forEach((type, index) => {
            const keno = this.miniKenos.find(game => game.kenoType === type);
            keno.node.position = cc.v2(left + keno.node.width / 2 + index * (keno.node.width + spacing), 0);
            keno.favourite.isChecked = index < this.favouriteGames.length;
        });

        this.selectedIndex = this.sortedGames.indexOf(updatedType);
        this.scrollToSelectedIndex();
    }

    private initPresetBetBoard() {
        const node = cc.instantiate(this.presetBetPrefab);
        this.presetBet = node.getComponent(MiniKenoPresetBet);
        this.presetBet.onChangedBet = (betAmount: number) => { this.changedPresetBet(betAmount); }
        this.presetBet.show(false);
        this.presetBet.getPreset = () => this.presetBetValue;
        this.presetNode.addChild(node);

        this.presetBetValue = cc.sys.localStorage.getItem("keno_preset_bet") || 0;
    }

    private changedPresetBet(value: number) {
        this.presetBetValue = value;
        cc.sys.localStorage.setItem("keno_preset_bet", this.presetBetValue);
    }

    onLoad() {
        // if (cc.sys.isMobile) {
        //     this.node.scale = 1.2;
        // }
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
        this.initPresetBetBoard();
        const dragableItem = this.getComponent(DraggableItem);
        dragableItem.touchCallback.start = (node) => {
            this.node.parent.insertChild(this.node, this.node.parent.childrenCount - 1);
        }
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

    openPresetBetDialog() {
        cc.RedT.audio.playClick();
        this.presetBet.show();
    }
}
