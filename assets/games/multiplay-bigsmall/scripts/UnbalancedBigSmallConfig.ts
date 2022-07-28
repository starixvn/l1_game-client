export const UnbalancedBigSmall1Id = 50;
export const UnbalancedBigSmall2Id = 51;
export const UnbalancedBigSmall3Id = 54;
export const UnbalancedBigSmall4Id = 55;

const normalConfig = {
    minBetTime: 1,
    fullTime: 60,
    betTime: 50,
    stopBetTime: 5,
    waitTime: 5
};

const turboConfig = {
    minBetTime: 1,
    fullTime: 40,
    betTime: 30,
    stopBetTime: 5,
    waitTime: 5
};

export const unbalancedBigSmallConfigs = {
    [UnbalancedBigSmall1Id]: normalConfig,
    [UnbalancedBigSmall2Id]: turboConfig,
    [UnbalancedBigSmall3Id]: normalConfig,
    [UnbalancedBigSmall4Id]: turboConfig
};

export const tableGameColor = {
    [UnbalancedBigSmall1Id]: "#1b747d",
    [UnbalancedBigSmall2Id]: "#3ec062",
    [UnbalancedBigSmall3Id]: "#8d45d4",
    [UnbalancedBigSmall4Id]: "#c93c44"
};
