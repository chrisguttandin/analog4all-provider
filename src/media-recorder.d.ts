// @todo Define the complete type declarations as defined by the MediaStream Recording specification.

// tslint:disable-next-line:interface-name
interface MediaRecorderOptions {
    audioBitsPerSecond?: number;

    bitsPerSecond?: number;

    mimeType?: string;

    videoBitsPerSecond?: number;
}

// tslint:disable-next-line:interface-name
interface MediaRecorder extends EventTarget {
    start(timeslice?: number): void;

    stop(): void;
}

declare var MediaRecorder: {
    prototype: MediaRecorder;

    new (stream: MediaStream, options: MediaRecorderOptions): MediaRecorder;

    isTypeSupported(mimeType: string): boolean;
};

// tslint:disable-next-line:interface-name
interface Window {
    MediaRecorder: typeof MediaRecorder;
}
