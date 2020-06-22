export type TMidiConnection = Readonly<{
    description?: string;

    gearogsSlug?: string;

    instrumentId?: string;

    isConnected: boolean;

    midiOutputId: string;

    midiOutputName: string;

    name: null | string;

    soundCloudUsername?: string;

    sourceId: string;
}>;
