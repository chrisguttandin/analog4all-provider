export interface IMidiConnection {

    // @todo When TypeScript 2.1 is ready use "instrument: Partial<IInstument>;".

    instrumentId?: string;

    midiOutputId: string;

    sourceId: string;

}
