interface IMediaImage {

    sizes?: string;

    src: string;

    type?: string;

}

type TMediaSessionAction = 'nexttrack' | 'pause' | 'play' | 'previoustrack' | 'seekbackward' | 'seekforward';

type TMediaSessionActionHandler = () => void;

type TMediaSessionPlaybackState = 'none' | 'paused' | 'playing';

declare class MediaMetadata {

    album: string;

    artist: string;

    artwork: IMediaImage[];

    title: string;

    constructor (options?: { album?: string, artist?: string, artwork?: IMediaImage[], title?: string });

}

interface Navigator {

    mediaSession: {

        metadata?: MediaMetadata;

        playbackState: TMediaSessionPlaybackState;

        setActionHandler (type: TMediaSessionAction, callback: TMediaSessionActionHandler): void;

    }

}
