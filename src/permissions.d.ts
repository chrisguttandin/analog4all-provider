// eslint-disable-next-line @typescript-eslint/naming-convention, no-unused-vars
interface Permissions {
    // @todo TypeScript v4.4.2 removed a few properties from the PermissionDescriptor interface.
    query(permissionDesc: { name: 'microphone' | PermissionName } | { name: 'midi'; sysex?: boolean }): Promise<PermissionStatus>;
}
