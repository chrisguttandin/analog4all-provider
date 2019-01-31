export type TIdentifiable<T, U extends keyof T> = { [ P in U ]: T[P]; } & Partial<T>;
