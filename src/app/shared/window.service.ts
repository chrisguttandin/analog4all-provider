import { Injectable } from '@angular/core';

@Injectable()
export class WindowService {

    get nativeWindow () {
        return window;
    }

}
