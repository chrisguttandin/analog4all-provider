interface IMediaImage {
    sizes?: string;

    src: string;

    type?: string;
}

type TMediaSessionAction = 'nexttrack' | 'pause' | 'play' | 'previoustrack' | 'seekbackward' | 'seekforward';

type TMediaSessionActionHandler = () => void;

type TMediaSessionPlaybackState = 'none' | 'paused' | 'playing';

declare class MediaMetadata {
    album: string; // eslint-disable-line @typescript-eslint/explicit-member-accessibility

    artist: string; // eslint-disable-line @typescript-eslint/explicit-member-accessibility

    artwork: IMediaImage[]; // eslint-disable-line @typescript-eslint/explicit-member-accessibility

    title: string; // eslint-disable-line @typescript-eslint/explicit-member-accessibility

    constructor(options?: { album?: string; artist?: string; artwork?: IMediaImage[]; title?: string });
}

// eslint-disable-next-line @typescript-eslint/naming-convention, no-unused-vars
interface Navigator {
    mediaSession: {
        metadata?: MediaMetadata;

        playbackState: TMediaSessionPlaybackState;

        setActionHandler(type: TMediaSessionAction, callback: TMediaSessionActionHandler): void;
    };
}
