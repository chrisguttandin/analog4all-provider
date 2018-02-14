import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { WindowService } from './window.service';

@Injectable()
export class MicrophonePermissionStateService {

    private _window: Window;

    constructor (windowService: WindowService) {
        this._window = windowService.nativeWindow;
    }

    /**
     * This property is true if the browser supports all the required APIs to use the
     * MicrophonePermissionStateService.
     */
    get isSupported () {
        return ('navigator' in this._window &&
            'permissions' in this._window.navigator &&
            'query' in this._window.navigator.permissions);
    }

    public watch (): Observable<TPermissionState> {
        return new Observable<TPermissionState>((observer) => {
            if (this.isSupported) {
                let isUnsubscribed = false;
                let removeOnChangeListener: null | (() => void) = null;

                this._window.navigator.permissions
                    .query({ name: 'microphone' })
                    .then((status) => {
                        if (!isUnsubscribed) {
                            observer.next(status.state);

                            const onChangeListener = () => observer.next(status.state);

                            status.addEventListener('change', onChangeListener);

                            removeOnChangeListener = () => status.removeEventListener('change', onChangeListener);
                        }
                    });

                return () => {
                    isUnsubscribed = true;

                    if (removeOnChangeListener !== null) {
                        removeOnChangeListener();
                    }
                };
            }

            observer.complete();

            // @todo The return statement is necessary to keep TypeScript happy.
            return;
        });
    }

}
