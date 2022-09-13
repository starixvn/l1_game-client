import _ = require("lodash");
import EventEmitterBase from "../../../common/emitter/EventEmitterBase";
import { PlayerData } from "../../_base/view-models/RoomPlayer";

export default class PlayerModel extends EventEmitterBase {
    static Events = {
        ADD_PLAYER: "PlayerModel:HAS_PLAYER",
        ADD_PLAYERS: "PlayerModel:HAS_PLAYERS",
        REMOVE_PLAYER: "PlayerModel:REMOVE_PLAYER"
    };
    player: any;
    players: any;

    receivedPlayer(playerData: PlayerData) {
        this.player = playerData;
        this.emit(PlayerModel.Events.ADD_PLAYER, playerData);
    }

    receivedPlayers(playersData) {
        this.players = playersData;
        this.emit(PlayerModel.Events.ADD_PLAYERS, playersData);
    }

    receivedRemovedPlayer(playerData: any) {
        playerData.playerId && this.emit(PlayerModel.Events.REMOVE_PLAYER, playerData.playerId);
    }
}
