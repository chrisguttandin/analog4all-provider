// @todo For some reason this does only work when this file is outside of the e2e directory.

declare module 'midi' {
    export interface IMidiInput {
        closePort(): void;

        openVirtualPort(name: string): void;
    }

    export class input implements IMidiInput {
        closePort(): void;

        openVirtualPort(name: string): void;
    }
}
