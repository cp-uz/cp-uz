import type { components } from './schema';

/** Backend serializer DTOs; domain objects are mapped at the repository boundary. */
export type ApiSchema<Name extends keyof components['schemas']> = components['schemas'][Name];

export type { paths, components, operations } from './schema';
