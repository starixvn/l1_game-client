import WebSocketTableGameBase from "../../_base/WebSocketTableGameBase";

export const handleUM = (main: WebSocketTableGameBase) => (message: string) => {
    const doActions = () => {
        main.showUmMessage({ um_message: message });
        main.stopGame();
    };
    doActions();
};
