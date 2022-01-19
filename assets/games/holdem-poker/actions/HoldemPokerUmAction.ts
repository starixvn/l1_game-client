import HoldemPoker from "../view-models/HoldemPoker";

export const handleUM = (main: HoldemPoker) => (message: string) => {
  const doActions = () => {
    main.showUmMessage({ um_message: message });
    main.stopGame();
  };
  doActions();
};
