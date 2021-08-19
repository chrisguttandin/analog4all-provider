import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PermissionStateService } from './permission-state';
import { WindowService } from './window.service';

@Injectable({
    providedIn: 'root'
})
export class AudioInputMediaDevicesService {
    private _window: null | Window;

    constructor(private _permissionStateService: PermissionStateService, windowService: WindowService) {
        this._window = windowService.nativeWindow;
    }

    /**
     * This property is true if the browser supports all the required APIs to use the
     * AudioInputMediaDevicesService.
     */
    public get isSupported(): boolean {
        return (
            this._window !== null && 'mediaDevices' in this._window.navigator && 'enumerateDevices' in this._window.navigator.mediaDevices
        );
    }

    public watch(): Observable<MediaDeviceInfo[]> {
        const mediaDevices$ = this.isSupported
            ? new Observable<MediaDeviceInfo[]>((observer) => {
                  let isUnsubscribed = false;

                  const mediaDevices = (<Window>this._window).navigator.mediaDevices;
                  const enumerateDevices = () =>
                      mediaDevices.enumerateDevices().then((mediaDeviceInfos) => {
                          if (!isUnsubscribed) {
                              observer.next(mediaDeviceInfos.filter(({ kind, label }) => kind === 'audioinput' && label !== ''));
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
              })
            : EMPTY;

        return this._permissionStateService.watch('microphone').pipe(
            switchMap((permissionState) => {
                if (permissionState === 'granted') {
                    return mediaDevices$;
                }

                return of([]);
            })
        );
    }
}
