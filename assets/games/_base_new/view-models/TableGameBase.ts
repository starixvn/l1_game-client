import _ = require("lodash");

import GameUtils from "../../../common/GameUtils";
import { playWinningEffect } from "../../_base/action/PayChipsAction";
import RoomPlayer, { PlayerData } from "../../_base/view-models/RoomPlayer";
import { Durations } from "../../_new/_base/game-data-management/models/durations";
import { GameData } from "../../_new/_base/game-data-management/models/game-data";
import {
    handleAddPlayers,
    handlePlaceOwnChip,
    handlePlaceTotalChips,
    handlePlacingBet,
    handlePlayerChipAction,
    hanleAddPlayer,
    removePlayer,
    updateOtherPlayersBalance,
    updateTablePlayer
} from "../actions/CommonTableGameAction";
import { clearChipsForLostChoices, payChips, resetUIAndClearChips } from "../actions/NewPayChipsAction";
import { BetModel } from "../models/BetModel";
import NewTableGameData from "../models/NewTableGameData";
import PlayerModel from "../models/PlayerModel";
import { Settlement } from "../models/Settlement";
import MiniGameBase from "./MiniGameBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TableGameBase extends MiniGameBase {
    @property({ type: RoomPlayer })
    players: RoomPlayer[] = [];

    @property({ type: cc.Node })
    otherPlayers: cc.Node = null;

    @property(cc.Prefab)
    winningPlayerEffectPrefab: cc.Prefab = null;

    protected get WinningAnimationDuration() {
        return 3;
    }

    public isMiniGameInContainer = true;
    isPlacingFakeChip = false;
    otherPlayersCache = {};
    playerChips = [];
    readonly payChipFlyTime = 1.2;
    startRoundDuration = 1;
    showResultDuration = 1;
    public gameData: NewTableGameData;
    onCloseGameCallback = () => {};
    alternativeGameId?: number;

    onLoad() {
        super.onLoad();
        this.players.forEach((player) => (player.node.active = false));
    }

    grantSocket() {
        super.grantSocket();
        this.socket && this.initGameEvents(this.socket);
    }

    initGameEvents(socket) {
        socket.on("message", (data) => {
            if (!this.isAlive()) {
                return;
            }
            this.currentMiniPanel.onGeneralData(data);
        });
    }

    createGameData(): GameData {
        return new NewTableGameData();
    }

    initGameDataEvents() {
        super.initGameDataEvents();

        this.emitterListener(this.gameData.durations, this.startRoundEvent, updateTablePlayer);
        this.emitterListener(this.gameData.durations, this.startRoundEvent, resetUIAndClearChips);
        this.emitterListener(this.gameData.durations, Durations.Events.PLACING_BET, handlePlacingBet);
        this.emitterListener(this.gameData.betModel, BetModel.Events.CHANGE_OWN_CHIP, handlePlaceOwnChip);
        if (this.showOtherPlayerChips) {
            this.emitterListener(this.gameData.betModel, BetModel.Events.CHANGE_PLAYER_CHIP, handlePlayerChipAction);
            this.emitterListener(this.gameData.betModel, BetModel.Events.CHANGE_TOTAL_CHIPS, handlePlaceTotalChips);
        }
        this.emitterListener(this.gameData.playerModel, PlayerModel.Events.ADD_PLAYER, hanleAddPlayer);
        this.emitterListener(this.gameData.playerModel, PlayerModel.Events.ADD_PLAYERS, handleAddPlayers);
        this.emitterListener(this.gameData.playerModel, PlayerModel.Events.REMOVE_PLAYER, removePlayer);
        this.emitterListener(this.gameData.settlement, Settlement.Events.SHOW_RESULT, updateOtherPlayersBalance);
    }

    /**
     * Handling after showing settlement result
     */
    handleAfterSettlementResult(settlement: any, animated: boolean) {
        this.gameData.roundHistory.update();
        this.showWaittingTime(true);
        this.gameData.resultHash.updateUI();
        this.handlePayChips(settlement);
        this.betItems.forEach((betItem) => betItem.setHighlight(settlement.settlementResult[betItem.node.name.toLowerCase()], true));
    }

    handlePayChips(settlement) {
        if (!this.showOtherPlayerChips) {
            clearChipsForLostChoices(this, settlement.settlementResult);
            return;
        }
        if (!!settlement) {
            payChips(this, settlement.settlementResult, settlement.winningPlayers, this.payChipFlyTime, this.WinningAnimationDuration);
        }
    }

    showStatus(status: any) {
        const { win, bet } = status;

        if (win) {
            const playerNode = this.userProfile.userAvatar.node.parent;
            this.showWinningBet(bet);
            playWinningEffect(this, playerNode, this.WinningAnimationDuration);
            this.updateUserBalance();
        }
    }

    addPlayer(player: PlayerData) {
        const playerSlot = this.getPlayerSlot(player.id);

        const playerFromCache = RoomPlayer.getPlayerFromCache(player.id, this.getPlayerStorageKey());
        player.idleCount = playerFromCache ? playerFromCache.idleCount : 0;

        if (!playerSlot) {
            const emptySlot = this.getEmptySlot();

            if (emptySlot && player.idleCount <= RoomPlayer.MAX_IDLE_COUNT) {
                emptySlot.setInfo(player);

                return;
            }

            this.otherPlayersCache[player.id] = player;
        }
    }

    getPlayerSlot(playerId: string): RoomPlayer {
        return _.find(this.players, (player) => player.data && player.data.id === playerId);
    }

    getEmptySlot(): RoomPlayer {
        return _.find(this.players, (player) => !player.data);
    }

    getBotSlot(): RoomPlayer {
        return _.find(this.players, (player) => player.data && player.data.type);
    }

    placePlayerChip(data) {
        const { betChoice, amount, rate } = data;
        let startNode: cc.Node;
        const playerSlot = this.getPlayerSlot(data.playerId);
        const betItem = _.find(this.betItems, (item) => item.node.name.toLowerCase() === betChoice.toLowerCase());
        if (playerSlot) {
            this.updatePlayerSlotDataStorage(data, playerSlot);
            startNode = playerSlot.avatar.node;
        } else {
            startNode = this.otherPlayers;
            this.updateOtherDataStorage(data);
        }

        if (betItem) {
            const convertValue = GameUtils.getValueByCurrency(amount, rate);
            const chipValues = GameUtils.getChipQuantity(convertValue, this.betChips.chipValues);

            Object.keys(chipValues).forEach((chipValue) => {
                let count = chipValues[chipValue];
                for (; count > 0; count--) {
                    this.betChips.placeChipToChipBox(+chipValue, betItem.chipNode, startNode, null);
                }
            });
        }

        this.playerChips.pop();
    }

    getPlayerStorageKey(): string {
        const gameId = this.alternativeGameId ?? this.gameId;
        return gameId.toString();
    }

    updatePlayerSlotDataStorage(data: any, playerSlot: any) {
        playerSlot.setBalance(data.red);
        playerSlot.data.idleCount = 0;
        RoomPlayer.storePlayerToCache(playerSlot.data, this.getPlayerStorageKey());
    }

    updateOtherDataStorage(data: any) {
        const player = this.otherPlayersCache[data.playerId];

        if (player) {
            player.idleCount = 0;
            player.red = data.red;
            this.otherPlayersCache[data.playerId] = player;
            RoomPlayer.storePlayerToCache(player, this.getPlayerStorageKey());
        }
    }

    highlightLastResult() {
        if (this.currentTimeRemaining <= this.config.stopBetTime) {
            return;
        }
        const dataLog = this.currentDataLogs[0];
        dataLog && this.highlightWonItems(dataLog.settlementResult, false);
    }

    private highlightWonItems(settlementResult: any, isAnimated = true) {
        this.betItems.forEach((betItem) => {
            betItem.setHighlight(settlementResult[betItem.node.name], isAnimated);
        });
    }

    override showUmMessage(data: any) {
        if (this.isDisableGame) {
            return;
        }

        this.showUmMessagePopup(data);
    }

    override onCloseGame() {
        this.onCloseGameCallback();
    }
}
