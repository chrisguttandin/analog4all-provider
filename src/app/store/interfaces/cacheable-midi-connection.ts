import { IMidiConnection } from '../../interfaces';

export interface ICacheableMidiConnection {

    description?: IMidiConnection['description'];

    gearogsSlug?: IMidiConnection['gearogsSlug'];

    midiOutputId: IMidiConnection['midiOutputId'];

    midiOutputName: IMidiConnection['midiOutputName'];

    name: IMidiConnection['name'];

    soundCloudUsername?: IMidiConnection['soundCloudUsername'];

    sourceId: IMidiConnection['sourceId'];

}
