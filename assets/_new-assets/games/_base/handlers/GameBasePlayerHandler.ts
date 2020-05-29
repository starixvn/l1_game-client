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
        const players: PlayerData[] = _.values(playersData);
        const realPlayers = _.filter(players, player => !player.type);
        const botPlayers = _.filter(players, player => player.type);

        _.forEach(realPlayers, (player) => {
            this.addPlayer(player);
        })

        _.forEach(botPlayers, (player) => {
            this.addPlayer(player);
        })
    }

    addPlayer(player: PlayerData) {
        const playerSlot = this.getPlayerSlot(player.id);

        if (!playerSlot) {
            const emptySlot = this.getEmptySlot();

            if (emptySlot) {
                emptySlot.setInfo(player);

                return;
            }

            if (!player.type) {
                const botSlot = this.getBotSlot();

                if (botSlot) {
                    var botPlayerData = botSlot.data;
                    botSlot.setInfo(player);
                    botPlayerData && (this.otherPlayers[botPlayerData.id] = botPlayerData);

                    return;
                }
            }

            this.otherPlayers[player.id] = player;
        }

    }

    updateTablePlayers() {
        let otherPlayers: any[] = _.values(this.otherPlayers);
        const botsInTable = _.filter(this.main.players, player => player.data && player.data.type);
        const realPlayers: PlayerData[] = _.filter(otherPlayers, player => player && !player.type);

        _.forEach(botsInTable, (bot, index) => {
            if (index <= realPlayers.length - 1) {
                var realPlayer = realPlayers[0];
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

    getEmptySlot(): RoomPlayer {
        return _.find(this.main.players, (player) => !player.data);
    }

    getBotSlot(): RoomPlayer {
        return _.find(this.main.players, (player) => player.data && player.data.type);
    }
}