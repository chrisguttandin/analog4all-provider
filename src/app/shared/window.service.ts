import { Injectable } from '@angular/core';

@Injectable()
export class WindowService {

    get nativeWindow (): null | Window {
        return (typeof window === 'undefined') ? null : window;
    }

}
