import type { FeedbackInput } from '../domain/feedback';

import { requestJson } from 'shared/api/http';

export async function submitFeedback(input: FeedbackInput, signal?: AbortSignal): Promise<void> {
  const body = new FormData();
  body.append('full_name', input.fullName.trim());
  body.append('contact', input.contact.trim());
  body.append('note', input.note.trim());
  if (input.attachment) body.append('attachment', input.attachment);
  await requestJson('/api/v1/feedback/', { method: 'POST', body, signal });
}
