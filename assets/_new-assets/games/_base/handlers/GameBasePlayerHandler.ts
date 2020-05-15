import DataHandler from "./DataHandler";
import GameRoomBase from "../GameRoomBase";
import RoomPlayer, { PlayerData } from "../RoomPlayer";
import * as _ from "lodash";

export default interface IGameBasePlayerHandler extends DataHandler {
    getPlayerSlot(playerId: string): RoomPlayer;
}
export default class GameBasePlayerHandler implements IGameBasePlayerHandler {
    otherPlayers = {};

    constructor(protected readonly main: GameRoomBase) {
    }

    handle(data: any): boolean {
        if (data.player) {
            this.addPlayer(data.player);
        }

        if (data.players) {
            this.addPlayers(data.players);
        }

        if (data.outgame) {
            this.removePlayer(data.outgame);
        }

        return true;
    }

    removePlayer(playerData: any) {
        if (playerData.playerId) {
            var slot = this.getPlayerSlot(playerData.playerId);

            if (slot) {
                slot.setInfo(null);
                let keys = Object.keys(this.otherPlayers);

                // Move player from others to slot
                if (keys.length > 0) {
                    let newPlayer = this.otherPlayers[keys[0]];
                    this.addPlayer(newPlayer);
                    delete this.otherPlayers[newPlayer.id];
                }
            } else {
                delete this.otherPlayers[playerData.playerId];
            }
        }
    }

    addPlayers(playersData) {
        var players: PlayerData[] = _.values(playersData);
        var realPlayers = _.filter(players, player => !player.type);
        var botPlayers = _.filter(players, player => player.type);

        _.forEach(realPlayers, (player) => {
            this.addPlayer(player);
        })

        _.forEach(botPlayers, (player) => {
            this.addPlayer(player);
        })
    }

    addPlayer(player: PlayerData) {
        var playerSlot = this.getPlayerSlot(player.id);

        if (!playerSlot) {
            let emptySlots = this.getEmptySlots();

            if (emptySlots.length > 0) {
                var emptySlot = emptySlots[0];
                emptySlot.setInfo(player);
            } else {
                this.otherPlayers[player.id] = player;
            }
        }

    }

    updateTablePlayers() {
        var otherPlayers: any[] = _.values(this.otherPlayers);
        var botsInTable = _.filter(this.main.players, player => player.data && player.data.type);
        var realPlayers: PlayerData[] = _.filter(otherPlayers, player => player.data && !player.type);

        _.forEach(botsInTable, (bot, index) => {
            if (index <= realPlayers.length - 1) {
                var realPlayer = realPlayers[index];
                var botData = bot.data;
                this.otherPlayers[botData.id] = botData;

                bot.setInfo(realPlayer);
                delete this.otherPlayers[realPlayer.id];
            }
        })
    }

    getPlayerSlot(playerId: string): RoomPlayer {
        return _.find(this.main.players, (player) => player.data && player.data.id === playerId);
    }

    getEmptySlots() {
        return _.filter(this.main.players, (player) => !player.data);
    }
}