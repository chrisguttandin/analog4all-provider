import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { WindowService } from './window.service';

@Injectable()
export class AudioInputMediaDevicesService {

    private _window: Window;

    constructor (windowService: WindowService) {
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
        return new Observable((observer: Observer<MediaDeviceInfo[]>) => {
            if (this.isSupported) {
                let isUnsubscribed = false;

                const mediaDevices =  this._window.navigator.mediaDevices;

                const enumerateDevices = () => mediaDevices
                    .enumerateDevices()
                    .then((mediaDeviceInfos: any) => {
                        if (!isUnsubscribed) {
                            observer.next(mediaDeviceInfos.filter(({ kind }: any) => kind === 'audioinput'));
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
    }

}
