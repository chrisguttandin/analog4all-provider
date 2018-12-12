import { env } from 'process';
import { browser, by, element } from 'protractor';
import { promise } from 'selenium-webdriver'; // tslint:disable-line:no-implicit-dependencies

export class HomePage {

    public getHeadline (): promise.Promise<string> {
        return element(by.css('anp-app h1')).getText();
    }

    public getParagraph (): promise.Promise<string> {
        return element(by.css('main p')).getText();
    }

    public getSubHeadline (): promise.Promise<string> {
        return element(by.css('anp-app h2')).getText();
    }

    public navigateTo (): promise.Promise<any> {
        return browser.get((env.IS_SMOKE_TEST) ? '/analog4all-provider' : '/');
    }

}
