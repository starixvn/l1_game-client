import HoldemPokerGameRoomConfigsHandler from "../../holdem-poker/event-handlers/HoldemPokerConfigsHandler";

export type ConfigsType<Choices> = {
    gameConfigs: {
        maxBet: number;
        minBet: number;
        odds: Choices;
        maxBetPerChoices: Choices;
        chips: any;
    };
};

export default class TexasConfigsHandler<Choices> extends HoldemPokerGameRoomConfigsHandler<Choices> {}
