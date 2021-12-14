import TexasHoldemPoker from "../view-models/texas-holdem-poker";

export const showUMInfo = (main: TexasHoldemPoker) => (message: string) => {
    const doActions = () => {
        main.showUmMessage({ um_message: message });
        main.stopGame();
    };
    doActions();
};
