import AnimatedTime from "../../../common/animated-time/view-models/AnimatedTime";
import ChipStack from "../../../common/chip-stack/views/ChipStack";
import NewButton from "../../../common/custom-button/NewButton";
import * as helper from "../../../common/helpers/Helper";
import NewCard, { CardAnimation, CardModel } from "../../../common/new-card/view-models/NewCard";
import { games } from "../../../SabaConfigs";
import DataHandler from "../../_base/handlers/DataHandler";
import GameBaseBetHandler from "../../_base/handlers/GameBaseBetHandler";
import GameBaseConfigsHandler from "../../_base/handlers/GameBaseConfigsHandler";
import GameBaseErrorHandler from "../../_base/handlers/GameBaseErrorHandler";
import GameBaseNoticeHandler from "../../_base/handlers/GameBaseNoticeHandler";
import GameBaseUmDataHandler from "../../_base/handlers/GameBaseUmHandler";
import NewSocketGameBase from "../../_base/NewSocketGameBase";
import RoomPlayer from "../../_base/RoomPlayer";
import BlackJackGuide from "./BlackJackGuide";
import BlackJackHistory from "./BlackJackHistory";
import BlackJackUtils from "./BlackJackUtils";
import BlackJackFinishHandler from "./handlers/BlackJackFinishHandler";
import BlackJackIngameHandler from "./handlers/BlackJackIngameHandler";
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

    @property(HandPlace)
    dealerHand: HandPlace = null;

    @property({ type: cc.Node })
    chipContainers: cc.Node[] = [];

    @property(cc.Prefab)
    cardPrefab: cc.Prefab = null;

    @property(cc.Node)
    cardBox: cc.Node = null;

    @property(cc.Node)
    cardDropPlace: cc.Node = null;

    @property(cc.Node)
    dealerChipTray: cc.Node = null;

    @property(cc.Node)
    smallSplitButton: cc.Node = null;

    @property(cc.Node)
    bigSplitButton: cc.Node = null;

    @property(cc.Node)
    doubleButton: cc.Node = null;

    @property(cc.Node)
    standButton: cc.Node = null;

    @property(cc.Node)
    hitButton: cc.Node = null;

    @property(cc.Node)
    newBetButton: cc.Node = null;

    @property(cc.Node)
    rebetButton: cc.Node = null;

    @property(cc.Node)
    clearButton: cc.Node = null;

    @property(cc.Node)
    dealButton: cc.Node = null;

    @property(cc.Label)
    totalBetLabel: cc.Label = null;

    @property(cc.Label)
    minBetLabel: cc.Label = null;

    @property(cc.Label)
    maxBetLabel: cc.Label = null;

    @property(cc.Label)
    blackjackOddLabel: cc.Label = null;

    @property(cc.Prefab)
    blackjackHistory: cc.Prefab = null;

    @property(cc.Prefab)
    blackjackGuide: cc.Prefab = null;

    dealHander: DataHandler;
    ingameActionHander: DataHandler;
    ingameHander: DataHandler;
    activeHand: HandPlace = null;
    lastHandBets: any[] = [];
    historyComponent: BlackJackHistory;

    public chipOption = [1000, 500, 200, 100, 50, 10, 5, 1];
    public configDuration = {
        drawingCardDelay: 0.7,
        delaySwitchHand: 1,
    }
    private priorityHands = [];
    private roundFinished = false;

    constructor() {
        super();
        this.init("BlackJack", null, null, 1, games.BlackJack.id);
    }

    onLoad() {
        super.onLoad();
        this.initHandPlaces();
        this.hideAllButtons();

        this.bigSplitButton.getComponent(NewButton).callback.selected = () => this.onSplitClick();
        this.smallSplitButton.getComponent(NewButton).callback.selected = () => this.onSplitClick();
        this.doubleButton.getComponent(NewButton).callback.selected = () => this.onDoubleClick();
        this.standButton.getComponent(NewButton).callback.selected = () => this.onStandClick();
        this.hitButton.getComponent(NewButton).callback.selected = () => this.onHitClick();
        this.newBetButton.getComponent(NewButton).callback.selected = () => this.onNewBetClick();
        this.rebetButton.getComponent(NewButton).callback.selected = () => this.onRebetClick();
        this.clearButton.getComponent(NewButton).callback.selected = () => this.onClearClick();
        this.dealButton.getComponent(NewButton).callback.selected = () => this.onDealClick()
    }

    onEnable() {

    }

    onDisable() {

    }

    start() {
        cc.RedT.send({ scene: this.gameName });
        this.socket.emit("inGame");
    }

    stopGame() {
        // this.gameState = GameState.Stopped;
        // this.clearIntervalAndTimeout();
        // this.resetDataAndUI();
    }


    protected onGameHide() {
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
        this.betHandler = new GameBaseBetHandler(this);

        this.dealHander = new DealHandler(this);
        this.ingameActionHander = new IngameActionHandler(this);
        this.finishHandler = new BlackJackFinishHandler(this);
        this.ingameHander = new BlackJackIngameHandler(this);

        this.addHandlers(
            this.umHandler,
            this.noticeHandler,
            this.betHandler,
            this.errorHandler,
            this.configsHandler,
            this.finishHandler,
            this.dealHander,
            this.ingameActionHander,
            this.ingameHander,
        );
    }

    getCurrentTotalAmount(): number {
        let total = 0;
        this.handPlaces.forEach(place => {
            total += place.getBetAmount();
        })
        return total;
    }

    updateTotalBetLabel() {
        const total = this.getCurrentTotalAmount();
        this.totalBetLabel.string = helper.numberWithCommas(total);
    }

    initHandPlaces() {
        const chipFlyingDuration = 0.5;
        this.handPlaces.forEach((handPlace, index) => {
            handPlace.betItemClickCallback = () => {
                cc.RedT.audio.playClick();
                if (handPlace.getBetAmount() + this.currentBet > this.gameConfigs.maxbet) {
                    this.showMiniWarning(`Tổng tiền cược tối đa của tay bài này là ${helper.numberWithCommas(this.gameConfigs.maxbet)}`);
                    return;
                }

                if (this.getCurrentTotalAmount() + this.currentBet > cc.RedT.user.red) {
                    this.showMiniWarning("Bạn hiện không có đủ tiền để cược.");
                    return;
                }
                handPlace.showBetText(false);
                if (!this.priorityHands.includes(index)) {
                    this.priorityHands.push(index);
                }
                this.dealButton.active = true;
                this.clearButton.active = true;

                this.handPlaces.forEach(place => place.highlightPlace(false));
                handPlace.highlightPlace(true);
                const chipNode = BlackJackUtils.createChip(this.currentBet, this.betChips.chipAltas);
                const destNode = this.chipContainers[index];
                handPlace.addBetAmount(this.currentBet);

                const startNode = this.betChips.getChipNode(this.currentBet);
                chipNode.position = destNode.convertToNodeSpaceAR(startNode.convertToWorldSpaceAR(cc.v2(0, 0)));;
                destNode.addChild(chipNode);

                let destPosition = cc.v2(0, 0);
                if (destNode.childrenCount > 0) {
                    const stack = destNode.children[0].getComponent(ChipStack);
                    if (stack) {
                        destPosition = cc.v2(0, stack.getCurrentHeight());
                    }
                }

                chipNode.runAction(cc.sequence(
                    cc.jumpTo(chipFlyingDuration, destPosition, 150, 1),
                    cc.callFunc(() => {
                        handPlace.updateDisplayBetValue();
                        handPlace.clearBetButton.active = true;
                        destNode.destroyAllChildren();
                        const chipStack = BlackJackUtils.createChipStack(handPlace.getBetAmount(), this.betChips.chipAltas, this.chipOption);
                        chipStack.zIndex = -1;
                        destNode.addChild(chipStack);
                        this.updateTotalBetLabel();
                    })));
            }
            handPlace.clearBetClickCallback = () => {
                handPlace.showBetText(true);
                this.chipContainers[index].destroyAllChildren();
                const location = this.priorityHands.indexOf(index);
                if (location > -1) {
                    this.priorityHands.splice(location, 1);
                }

                const existChip = this.checkExistChipOnTable();
                this.dealButton.active = existChip;
                this.clearButton.active = existChip;
                this.updateTotalBetLabel();
            }
        })
    }

    checkExistChipOnTable(): boolean {
        return this.handPlaces.find(place => place.getBetAmount() > 0) != undefined;
    }

    createCard(card: CardModel): cc.Node {
        const node = cc.instantiate(this.cardPrefab);
        const cardComponent = node.getComponent(NewCard);
        cardComponent.setCard(card);
        return node;
    }

    drawingCardToPlayer(card: CardModel, pos: number, onComplete = () => { }) {
        const cardNode = this.createCard(card);
        const handPlace = this.handPlaces[pos];
        handPlace.addCard(cardNode);

        const cardComponent = cardNode.getComponent(NewCard);
        const startWorldPos = this.cardBox.convertToWorldSpaceAR(cc.v2(0, 0));
        const startLocalPos = handPlace.cardLayout.content.convertToNodeSpaceAR(startWorldPos);
        const nextPosition = handPlace.cardLayout.getNextPosition();
        const rotationX = this.dealerHand.cardLayout.selectedRotationX;
        cardNode.position = startLocalPos;

        const pullDuration = 0.2;
        const moveDuration = 0.45;
        cardComponent.playAnimation(CardAnimation.PullCard, pullDuration);
        cc.tween(cardNode)
            .delay(pullDuration)
            .call(() => {
                cardComponent.playAnimation(CardAnimation.DealerToHand, moveDuration);
            })
            .to(moveDuration, { position: nextPosition, rotationX: rotationX })
            .call(() => {
                handPlace.cardLayout.updateLayout();
                onComplete();
            })
            .start();
    }

    drawingCardToDealer(card: CardModel, faceDown: boolean, onComplete = () => { }) {
        const cardNode = this.createCard(card);
        this.dealerHand.addCard(cardNode);

        const cardComponent = cardNode.getComponent(NewCard);
        const startWorldPos = this.cardBox.convertToWorldSpaceAR(cc.v2(0, 0));
        const startLocalPos = this.dealerHand.cardLayout.content.convertToNodeSpaceAR(startWorldPos);
        const nextPosition = this.dealerHand.cardLayout.getNextPosition();
        const rotationX = this.dealerHand.cardLayout.selectedRotationX;
        cardNode.position = startLocalPos;

        const pullDuration = 0.2;
        const moveDuration = 0.45;
        cardComponent.playAnimation(CardAnimation.PullCard, pullDuration);
        cc.tween(cardNode)
            .delay(pullDuration)
            .call(() => cardComponent.playAnimation(faceDown ? CardAnimation.DealerDrawingFaceDown : CardAnimation.DealerToHand, moveDuration))
            .to(moveDuration, { position: nextPosition, rotationX: rotationX })
            .call(() => {
                // this.dealerHand.cardLayout.updateLayout();
                onComplete();
            })
            .start();
    }

    dealerOpenSecondCard(card: CardModel, duration: number) {
        const cardNode = this.dealerHand.getCards()[1];
        const cardComponent = cardNode.getComponent(NewCard);
        cardComponent.setCard(card);
        cardComponent.playAnimation(CardAnimation.DealerOpenCard, duration);
    }

    finishRound() {
        if (!this.roundFinished) {
            return;
        }
        const finishHandler = this.finishHandler as BlackJackFinishHandler;
        if (!finishHandler.finishDataCache) {
            return;
        }
        finishHandler.processFinish();
    }

    startRound() {
        this.switchToNextHand();
    }

    switchToNextHand() {
        const sortIndices = [0, 3, 1, 4, 2, 5];
        const places = sortIndices.map(i => this.handPlaces[i])
        const nextHand = places.find(hand => hand.isActive && !hand.isStand);
        if (nextHand) {
            this.activeHand = nextHand;
            nextHand.selected = true;
        } else {
            this.switchToDealer();
        }
        this.updateAvailableActions();
    }

    switchToDealer() {
        this.roundFinished = true;
        this.finishRound();
    }

    canSendRequest(): boolean {
        if (this.waitingProcessing) {
            this.showProcessingWarning(true);
            return false;
        } else {
            this.waitingProcessing = true;
            return true;
        }
    }

    onDealClick() {
        cc.RedT.audio.playClick();

        if (!this.canSendRequest()) {
            return;
        }

        const hands = [];

        this.priorityHands.forEach(i => {
            const betAmount = this.handPlaces[i].getBetAmount()
            if (betAmount > 0) {
                hands.push({ pos: i + 1, bet: betAmount })
            }
        });

        this.lastHandBets = hands;
        this.rebet();
    }

    rebet() {
        const data = {
            deal: {
                hands: this.lastHandBets
            }
        };
        this.socket && this.socket.emit("bet", data);
    }

    onSplitClick() {
        cc.RedT.audio.playClick();
        if (!this.canSendRequest()) {
            return;
        }

        const data = {
            split: {
                id: this.activeHand.idValue
            }
        }
        this.socket && this.socket.emit("bet", data);
    }

    onDoubleClick() {
        cc.RedT.audio.playClick();
        if (!this.canSendRequest()) {
            return;
        }

        const data = {
            double: {
                id: this.activeHand.idValue
            }
        }
        this.socket && this.socket.emit("bet", data);
    }

    onStandClick() {
        cc.RedT.audio.playClick();
        if (!this.canSendRequest()) {
            return;
        }

        const data = {
            stand: {
                id: this.activeHand.idValue
            }
        }
        this.socket && this.socket.emit("bet", data);
    }

    onHitClick() {
        cc.RedT.audio.playClick();
        if (!this.canSendRequest()) {
            return;
        }

        const data = {
            hit: {
                id: this.activeHand.idValue
            }
        }
        this.socket && this.socket.emit("bet", data);
    }

    onNewBetClick() {
        cc.RedT.audio.playClick();
        this.collectCardsOnTable();
    }

    collectCardsOnTable(complete = () => { }) {
        this.newGame();
        const worldPositon = this.cardDropPlace.convertToWorldSpaceAR(cc.v2(0, 0));

        let count = 0;
        const dealerCardsNodes = this.dealerHand.getCards();
        const destPosition = dealerCardsNodes[0].parent.convertToNodeSpaceAR(worldPositon);
        dealerCardsNodes.forEach(cardNode => {
            cc.tween(cardNode)
                .to(0.3, { position: cc.v2(0, 0) })
                .delay(count * 0.05)
                .call(() => {
                    const cardComponent = cardNode.getComponent(NewCard);
                    cardComponent.playAnimation(CardAnimation.DropCard, 0.5);
                })
                .to(0.5, { position: destPosition })
                .delay(0.2)
                .call(() => cardNode.destroy())
                .start();
        });
        count++;
        this.handPlaces.forEach(place => {
            const cardNodes = place.getCards();
            if (cardNodes.length === 0) {
                return;
            }

            count++;
            const destPosition = cardNodes[0].parent.convertToNodeSpaceAR(worldPositon);
            cardNodes.forEach(cardNode => {
                cc.tween(cardNode)
                    .to(0.3, { position: cc.v2(0, 0) })
                    .delay(count * 0.05)
                    .call(() => {
                        const cardComponent = cardNode.getComponent(NewCard);
                        cardComponent.playAnimation(CardAnimation.DropCard, 0.7);
                    })
                    .to(0.7, { position: destPosition })
                    .delay(0.2)
                    .call(() => cardNode.destroy())
                    .start();
            })
        });

        cc.tween(this.node)
            .delay(1)
            .call(() => complete())
            .start();
    }

    onRebetClick() {
        cc.RedT.audio.playClick();
        if (!this.canSendRequest()) {
            return;
        }

        this.collectCardsOnTable(() => {
            let total = 0;
            this.lastHandBets.forEach(hand => total += hand.bet);
            if (total > cc.RedT.user.red) {
                this.showMiniWarning("Bạn hiện không có đủ tiền để cược.");
                return;
            }

            this.rebet();
        });

        //restore chip value
        this.lastHandBets.forEach(hand => {
            const chipStack = BlackJackUtils.createChipStack(hand.bet, this.betChips.chipAltas, this.chipOption);
            this.chipContainers[hand.pos - 1].addChild(chipStack);
            const place = this.handPlaces[hand.pos - 1];
            place.updateDisplayBetValue(hand.bet);
            place.showBetText(false);
        });
        this.updateTotalBetLabel();
    }

    onClearClick() {
        cc.RedT.audio.playClick();
        this.handPlaces.forEach(place => place.onClearBetClick());
    }

    onLobbyClick() {
        cc.RedT.audio.playClick();

        this.onCloseGameClick();
    }

    onHistoryClick() {
        cc.RedT.audio.playClick();
        let history = cc.instantiate(this.blackjackHistory);
        this.historyComponent = history.getComponent(BlackJackHistory);
        this.historyComponent.init(this.socket);
        this.currentMiniPanel.node.addChild(history);
    }

    onGuideClick() {
        cc.RedT.audio.playClick();
        let guide = cc.instantiate(this.blackjackGuide);
        let guideComponent = guide.getComponent(BlackJackGuide);
        guideComponent.init(this.gameConfigs);
        this.currentMiniPanel.node.addChild(guide);
    }

    hideAllButtons() {
        this.smallSplitButton.active = false;
        this.bigSplitButton.active = false;
        this.doubleButton.active = false;
        this.standButton.active = false;
        this.hitButton.active = false;
        this.newBetButton.active = false;
        this.rebetButton.active = false;
        this.clearButton.active = false;
        this.dealButton.active = false;
    }

    newGame() {
        this.hideAllButtons();
        this.handPlaces.forEach(place => {
            place.onClearBetClick();
            place.enablePlaceChip(true);
        });
        this.handPlaces[1].highlightPlace(true);
        this.dealerHand.resetView();
        this.roundFinished = false;
        (this.finishHandler as BlackJackFinishHandler).clearCache();
    }

    updateAvailableActions() {
        this.hideAllButtons();

        this.hitButton.active = this.standButton.active = !this.activeHand.isStand;
        this.doubleButton.active = this.activeHand.canDouble && !this.activeHand.isStand;
        this.smallSplitButton.active = !this.activeHand.isStand && this.activeHand.canSplit && this.doubleButton.active;
        this.bigSplitButton.active = !this.activeHand.isStand && this.activeHand.canSplit && !this.doubleButton.active;
    }

    updateDisplayForRemoteConfig() {
        super.updateDisplayForRemoteConfig();
        this.minBetLabel.string = this.gameConfigs.minbet.toString();
        this.maxBetLabel.string = helper.numberWithCommas(this.gameConfigs.maxbet);
        this.blackjackOddLabel.string = this.gameConfigs.odds.blackjack;
    }

    onDataGameRoom(data) {
        if (data.history) {
            this.historyComponent.onData(data.history);
        }

        super.onDataGameRoom(data);
    }
}
