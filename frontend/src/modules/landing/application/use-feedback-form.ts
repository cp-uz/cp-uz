import type { FormEvent, ChangeEvent } from 'react';

import { useRef, useState, useEffect } from 'react';

import { submitFeedback } from '../data-access/feedback.repository';
import { validateFeedback, MAX_ATTACHMENT_SIZE } from '../domain/feedback';

export function useFeedbackForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const [fullName, setFullName] = useState('');
  const [contact, setContact] = useState('');
  const [note, setNote] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentError, setAttachmentError] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => () => controllerRef.current?.abort(), []);

  const selectAttachment = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (file && file.size > MAX_ATTACHMENT_SIZE) {
      setAttachment(null);
      setAttachmentError('Fayl hajmi 5 MB dan oshmasligi kerak.');
      event.target.value = '';
      return;
    }
    setAttachment(file);
    setAttachmentError('');
  };

  const removeAttachment = () => {
    setAttachment(null);
    setAttachmentError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (controllerRef.current || attachmentError) return;
    const input = { fullName, contact, note, attachment };
    const error = validateFeedback(input);
    if (error) {
      setSubmitError(error);
      setStatus('error');
      return;
    }
    const controller = new AbortController();
    controllerRef.current = controller;
    setStatus('submitting');
    setSubmitError('');
    try {
      await submitFeedback(input, controller.signal);
      if (controller.signal.aborted) return;
      setFullName('');
      setContact('');
      setNote('');
      removeAttachment();
      setStatus('success');
    } catch (reason) {
      if (!controller.signal.aborted) {
        setSubmitError(reason instanceof Error ? reason.message : 'Murojaatni yuborib bo‘lmadi.');
        setStatus('error');
      }
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null;
    }
  };

  return {
    fileInputRef,
    fullName,
    setFullName,
    contact,
    setContact,
    note,
    setNote,
    attachment,
    attachmentError,
    status,
    submitError,
    selectAttachment,
    removeAttachment,
    submit,
  };
}
