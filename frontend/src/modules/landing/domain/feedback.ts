export const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024;
export const ACCEPTED_ATTACHMENT_TYPES = '.jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.txt';

export type FeedbackInput = {
  fullName: string;
  contact: string;
  note: string;
  attachment: File | null;
};

export function validateFeedback(input: FeedbackInput): string {
  if (!input.fullName.trim() || !input.note.trim()) return 'Ism-familiya va izohni kiriting.';
  if (
    input.fullName.trim().length > 160 ||
    input.contact.trim().length > 255 ||
    input.note.trim().length > 3000
  ) {
    return 'Murojaat maydonlaridagi matn juda uzun.';
  }
  if (input.attachment && input.attachment.size > MAX_ATTACHMENT_SIZE)
    return 'Fayl hajmi 5 MB dan oshmasligi kerak.';
  return '';
}
