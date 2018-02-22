import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { switchMap } from 'rxjs/operators';
import { PermissionStateService } from './permission-state';
import { WindowService } from './window.service';

@Injectable()
export class AudioInputMediaDevicesService {

    private _window: null | Window;

    constructor (
        private _permissionStateService: PermissionStateService,
        windowService: WindowService
    ) {
        this._window = windowService.nativeWindow;
    }

    /**
     * This property is true if the browser supports all the required APIs to use the
     * AudioInputMediaDevicesService.
     */
    get isSupported () {
        return (this._window !== null &&
            'mediaDevices' in this._window.navigator &&
            'enumerateDevices' in this._window.navigator.mediaDevices);
    }

    public watch (): Observable<MediaDeviceInfo[]> {
        const mediaDevices$ = new Observable<MediaDeviceInfo[]>((observer) => {
            if (this.isSupported) {
                let isUnsubscribed = false;

                const mediaDevices = (<Window> this._window).navigator.mediaDevices;

                const enumerateDevices = () => mediaDevices
                    .enumerateDevices()
                    .then((mediaDeviceInfos) => {
                        if (!isUnsubscribed) {
                            observer.next(mediaDeviceInfos.filter(({ kind, label }) => {
                                return (kind === 'audioinput' && label !== '');
                            }));
                        }
                    });

                const onStateChangeListener = () => enumerateDevices();

                mediaDevices.addEventListener('devicechange', onStateChangeListener);

                enumerateDevices();

                return () => {
                    if (mediaDevices !== null) {
                        isUnsubscribed = true;
                        mediaDevices.removeEventListener('devicechange', onStateChangeListener);
                    }
                };
            }

            observer.complete();

            // @todo The return statement is necessary to keep TypeScript happy.
            return;
        });

        return this._permissionStateService
            .watch('microphone')
            .pipe(
                switchMap((permissionState) => {
                    if (permissionState === 'granted') {
                        return mediaDevices$;
                    }

                    return of([ ]);
                })
            );
    }

}
