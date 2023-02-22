import * as Configs from "../../configs/Configs";

const redirectToAppTimeoutPage = (language = "en-US"): void => {
    redirectToAppPage("/timeout", language);
};

const redirectToAppUMPage = (language = "en-US"): void => {
    redirectToAppPage("/um", language);
};

const redirectToAppPage = (path: string, language: string): void => {
    window.location.href = `${Configs.SGConnectDomain}${path}?language=${language}`;
};

export { redirectToAppTimeoutPage, redirectToAppUMPage };
