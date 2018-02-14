import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { switchMap } from 'rxjs/operators';
import { MicrophonePermissionStateService } from './microphone-permission-state';
import { WindowService } from './window.service';

@Injectable()
export class AudioInputMediaDevicesService {

    private _window: Window;

    constructor (
        private _microphonePermissionStateService: MicrophonePermissionStateService,
        windowService: WindowService
    ) {
        this._window = windowService.nativeWindow;
    }

    /**
     * This property is true if the browser supports all the required APIs to use the
     * AudioInputMediaDevicesService.
     */
    get isSupported () {
        return ('navigator' in this._window &&
            'mediaDevices' in this._window.navigator &&
            'enumerateDevices' in this._window.navigator.mediaDevices);
    }

    public watch (): Observable<MediaDeviceInfo[]> {
        const $mediaDevices = new Observable<MediaDeviceInfo[]>((observer) => {
            if (this.isSupported) {
                let isUnsubscribed = false;

                const mediaDevices =  this._window.navigator.mediaDevices;

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

        return this._microphonePermissionStateService
            .watch()
            .pipe(
                switchMap((permissionState) => {
                    if (permissionState === 'granted') {
                        return $mediaDevices;
                    }

                    return of([ ]);
                })
            );
    }

}
