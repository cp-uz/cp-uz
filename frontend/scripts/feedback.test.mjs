import assert from 'node:assert/strict';
import test from 'node:test';
import { validateFeedback, MAX_ATTACHMENT_SIZE, ACCEPTED_ATTACHMENT_TYPES } from '../src/modules/landing/domain/feedback.ts';

test('feedback validation requires nonblank author and note while keeping contact optional', () => {
  assert.equal(validateFeedback({ fullName: 'Ali', contact: '', note: 'Xato topdim', attachment: null }), '');
  assert.notEqual(validateFeedback({ fullName: '  ', contact: '', note: 'Xato', attachment: null }), '');
  assert.notEqual(validateFeedback({ fullName: 'Ali', contact: '', note: '  ', attachment: null }), '');
});

test('feedback attachment and text limits reject oversize requests', () => {
  const input = { fullName: 'Ali', contact: '', note: 'Xato', attachment: null };
  assert.equal(MAX_ATTACHMENT_SIZE, 5 * 1024 * 1024);
  assert.ok(ACCEPTED_ATTACHMENT_TYPES.includes('.pdf'));
  assert.notEqual(validateFeedback({ ...input, attachment: { size: MAX_ATTACHMENT_SIZE + 1 } }), '');
  assert.notEqual(validateFeedback({ ...input, note: 'a'.repeat(3001) }), '');
});
