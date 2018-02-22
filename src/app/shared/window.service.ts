import { Injectable } from '@angular/core';

@Injectable()
export class WindowService {

    get nativeWindow () {
        return (typeof window === 'undefined') ? null : window;
    }

}
