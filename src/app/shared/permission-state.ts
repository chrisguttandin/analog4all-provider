import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { WindowService } from './window.service';

@Injectable({
    providedIn: 'root'
})
export class PermissionStateService {
    private _window: null | Window;

    constructor(windowService: WindowService) {
        this._window = windowService.nativeWindow;
    }

    /**
     * This property is true if the browser supports all the required APIs to use the
     * PermissionStateService.
     */
    public get isSupported(): boolean {
        return this._window !== null && 'permissions' in this._window.navigator && 'query' in this._window.navigator.permissions;
    }

    public watch(name: 'microphone' | 'midi'): Observable<PermissionState> {
        if (this.isSupported) {
            return new Observable<PermissionState>((observer) => {
                let isUnsubscribed = false;
                let removeOnChangeListener: null | (() => void) = null;

                (<Window>this._window).navigator.permissions.query({ name }).then(
                    (status) => {
                        if (!isUnsubscribed) {
                            observer.next(status.state);

                            const onChangeListener = () => observer.next(status.state);

                            status.addEventListener('change', onChangeListener);

                            removeOnChangeListener = () => status.removeEventListener('change', onChangeListener);
                        }
                    },
                    () => {
                        observer.next('denied');
                    }
                );

                return () => {
                    isUnsubscribed = true;

                    if (removeOnChangeListener !== null) {
                        removeOnChangeListener();
                    }
                };
            });
        }

        return EMPTY;
    }
}
