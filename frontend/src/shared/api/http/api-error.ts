function messageFrom(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) return value;
  if (Array.isArray(value)) return value.map(messageFrom).find(Boolean);
  if (value && typeof value === 'object') {
    const fields = value as Record<string, unknown>;
    return messageFrom(fields.detail) ?? Object.values(fields).map(messageFrom).find(Boolean);
  }
  return undefined;
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly payload: unknown,
    fallback = 'So‘rovni bajarib bo‘lmadi. Qayta urinib ko‘ring.'
  ) {
    super(messageFrom(payload) ?? fallback);
    this.name = 'ApiError';
  }
}

export class InvalidApiResponseError extends Error {
  constructor() {
    super('Server yaroqsiz ma’lumot qaytardi. Qayta urinib ko‘ring.');
    this.name = 'InvalidApiResponseError';
  }
}
