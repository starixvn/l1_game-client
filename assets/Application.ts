import { Container } from "inversify";
import "reflect-metadata";
import SocketController from "./SocketController";

export interface IApplication {
    startup();
    configureServices();
}

export class Application implements IApplication {
    constructor(private readonly appContainer = new Container()) {}

    startup() {
        this.configureServices();
    }

    configureServices() {
        this.appContainer.bind<SocketController>(SocketController).toSelf().inSingletonScope();
    }
}
