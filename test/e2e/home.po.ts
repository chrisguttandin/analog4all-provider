import { Locator, Page, Response } from '@playwright/test';

export class Home {
    constructor(private _page: Page) {}

    public getHeadline(): Locator {
        return this._page.locator('anp-app h1');
    }

    public getParagraph(): Locator {
        return this._page.locator('main p');
    }

    public getSubHeadline(): Locator {
        return this._page.locator('anp-app h2');
    }

    public navigateTo(): Promise<null | Response> {
        return this._page.goto('./');
    }
}
