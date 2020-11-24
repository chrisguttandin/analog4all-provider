import { browser, by, element } from 'protractor';

export class HomePage {
    public async getHeadline(): Promise<string> {
        return element(by.css('anp-app h1')).getText();
    }

    public async getParagraph(): Promise<string> {
        return element(by.css('main p')).getText();
    }

    public async getSubHeadline(): Promise<string> {
        return element(by.css('anp-app h2')).getText();
    }

    public async navigateTo(): Promise<unknown> {
        return browser.get(browser.baseUrl);
    }
}
