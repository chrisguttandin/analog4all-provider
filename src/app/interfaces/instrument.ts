export interface IInstrument {

    created: number;

    description?: string;

    gearogsSlug?: string;

    id: string;

    isAvailable: boolean;

    modified: number;

    name: string;

    sample?: {

        id: string;

    };

    socket: {

        url: string;

    };

    soundCloudUsername?: string;

}
