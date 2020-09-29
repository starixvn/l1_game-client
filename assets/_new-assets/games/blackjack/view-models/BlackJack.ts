import AnimatedTime from "../../../common/animated-time/view-models/AnimatedTime";
import NewCard, { CardModel } from "../../../common/new-card/view-models/NewCard";
import GameBaseConfigsHandler from "../../_base/handlers/GameBaseConfigsHandler";
import GameBaseErrorHandler from "../../_base/handlers/GameBaseErrorHandler";
import GameBaseNoticeHandler from "../../_base/handlers/GameBaseNoticeHandler";
import GameBaseUmDataHandler from "../../_base/handlers/GameBaseUmHandler";
import NewSocketGameBase from "../../_base/NewSocketGameBase";
import RoomPlayer from "../../_base/RoomPlayer";
import DealHandler from "./handlers/DealHandler";
import IngameActionHandler from "./handlers/IngameActionHandler";
import HandPlace from "./HandPlace";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BlackJack extends NewSocketGameBase {

    @property({ type: cc.Node, visible: false, override: true })
    timeWaitNode: cc.Node = null;

    @property({ type: cc.Label, visible: false, override: true })
    timeWaitLabel: cc.Label = null;

    @property({ type: AnimatedTime, visible: false, override: true })
    animatedTime: AnimatedTime = null;

    @property({ type: cc.Label, visible: false, override: true })
    gameRound: cc.Label = null;

    @property({ type: RoomPlayer, visible: false, override: true })
    players: RoomPlayer[] = [];

    @property({ type: cc.Node, visible: false, override: true })
    otherPlayers: cc.Node = null;

    @property({ type: HandPlace })
    handPlaces: HandPlace[] = [];

    @property({ type: cc.Node })
    chipContainers: cc.Node[] = [];

    @property(cc.Prefab)
    cardPrefab: cc.Prefab = null;

    onLoad() {
        super.onLoad();
        this.initHandPlaces();
    }

    onEnable() {

    }

    start() {
        // cc.RedT.send({ scene: this.gameName, g: { [this.gameName]: { ingame: true } } });
    }

    protected initGameAudios() {
    }

    setGameRound(gameRoundId) {
    }

    setUpHandlers() {
        this.umHandler = new GameBaseUmDataHandler(this);
        this.noticeHandler = new GameBaseNoticeHandler(this);
        this.errorHandler = new GameBaseErrorHandler(this);
        this.configsHandler = new GameBaseConfigsHandler(this);

        const dealHander = new DealHandler(this);
        const ingameActionHander = new IngameActionHandler(this);

        this.addHandlers(
            this.umHandler,
            this.noticeHandler,
            this.errorHandler,
            this.configsHandler,
            dealHander,
            ingameActionHander
        );
    }

    initHandPlaces() {
        const chipFlyingDuration = 0.5;
        const chipOption = [1000, 500, 200, 100, 50, 10, 5, 1];
        this.handPlaces.forEach((handPlace, index) => {
            handPlace.betItemClickCallback = () => {
                // cc.RedT.audio.playClick();

                const chipNode = this.betChips.createChip(this.currentBet).node;
                const destNode = this.chipContainers[index];
                this.betChips.moveChipWithCallback(chipNode, this.currentBet, destNode, null, () => {
                    handPlace.addBetAmount(this.currentBet);
                    handPlace.clearBetButton.active = true;
                    destNode.getChildByName("stack")?.destroy();
                    const chipStack = this.betChips.createChipStack(handPlace.getBetAmount(), chipOption);
                    chipStack.name = "stack";
                    chipStack.zIndex = -1;
                    destNode.addChild(chipStack);
                }, 0, chipFlyingDuration, 0);
            }
            handPlace.clearBetClickCallback = () => {
                handPlace.clearBetAmount();
                this.chipContainers[index].destroyAllChildren();
            }
        })
    }

    createCard(card: CardModel): cc.Node {
        const node = cc.instantiate(this.cardPrefab);
        const cardComponent = node.getComponent(NewCard);
        cardComponent.setCard(card);
        return node;
    }
}
