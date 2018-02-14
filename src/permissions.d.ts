type TPermissionName = 'accelerometer' |
    'ambient-light-sensor' |
    'background-sync' |
    'bluetooth' |
    'camera' |
    'clipboard' |
    'device-info' |
    'geolocation' |
    'gyroscope' |
    'magnetometer' |
    'microphone' |
    'midi' |
    'notifications' |
    'persistent-storage' |
    'push' |
    'speaker';

interface IPermissionDescriptor {

    name: TPermissionName;

}

type TPermissionState = 'denied' | 'granted' | 'prompt';

interface IPermissionStatusChangeEvent extends Event {

    target: IPermissionStatus;

}

type TPermissionStatusChangeEventListener = (evt: IPermissionStatusChangeEvent) => void | { handleEvent (evt: IPermissionStatusChangeEvent): void; };

interface IPermissionStatus extends EventTarget {

    onchange: TPermissionStatusChangeEventListener;

    readonly state: TPermissionState;

}

interface Navigator {

    permissions: {

        query (permissionDesc: IPermissionDescriptor) : Promise<IPermissionStatus>;

    }

}
