import * as Configs from "../../configs/Configs";

const redirectToAppTimeoutPage = (language = "en-US"): void => {
    redirectToAppPage("/timeout", language);
};

const redirectToAppUMPage = (operatorId: string, language = "en-US"): void => {
    const otherQueryString = operatorId ? `operatorId=${operatorId}` : "";
    redirectToAppPage("/um", language, otherQueryString);
};

const redirectToLoginPage = (language = "en-US"): void => {
    redirectToAppPage("", language);
};

const redirectToAppPage = (path: string, language: string, otherQueryString = ""): void => {
    window.location.href = `${Configs.SGConnectDomain}${path}?language=${language}&${otherQueryString}`;
};

export { redirectToAppTimeoutPage, redirectToAppUMPage, redirectToLoginPage };
