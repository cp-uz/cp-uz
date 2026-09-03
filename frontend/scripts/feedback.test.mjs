import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const source = readFileSync(
  new URL('../src/modules/landing/ui/pages/HomePage/FeedbackSection.tsx', import.meta.url),
  'utf8'
);

test('landing feedback form posts multipart data to the canonical API endpoint', () => {
  assert.match(source, /new FormData\(\)/);
  assert.match(source, /apiUrl\('\/api\/v1\/feedback\/'\)/);
  assert.match(source, /body\.append\('full_name'/);
  assert.match(source, /body\.append\('contact'/);
  assert.match(source, /body\.append\('note'/);
});

test('attachment UX enforces five megabytes without exposing implementation notes', () => {
  assert.match(source, /5 \* 1024 \* 1024/);
  assert.match(source, /\.jpg,\.jpeg,\.png,\.webp,\.pdf,\.doc,\.docx,\.txt/);
  assert.doesNotMatch(source, /Telegram orqali yetkaziladi|Fayl serverda saqlanmaydi/);
  assert.match(source, /Aloqa \(ixtiyoriy\)/);
});
