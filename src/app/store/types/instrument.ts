export type TInstrument = Readonly<{

    created: number;

    description?: string;

    gearogsSlug?: string;

    id: string;

    isAvailable: boolean;

    modified: number;

    name: string;

    sample?: Readonly<{

        id: string;

    }>;

    socket: Readonly<{

        url: string;

    }>;

    soundCloudUsername?: string;

}>;
