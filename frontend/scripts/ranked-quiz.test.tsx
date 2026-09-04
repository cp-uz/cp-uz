import React, { StrictMode } from 'react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../src/shared/api/http';
import { safeStorage } from '../src/shared/storage';
import { glossaryLeaderboardApi } from '../src/modules/learning/application/glossary-leaderboard';
import { useRankedQuiz } from '../src/modules/learning/application/use-ranked-quiz';
import { QuizQuestion } from '../src/modules/learning/ui/pages/GlossaryPage/QuizQuestion';
import {
  enqueueGlossaryScore,
  flushGlossaryScoreOutbox,
  readGlossaryScoreOutbox,
  GLOSSARY_QUIZ_OUTBOX_STORAGE_KEY,
} from '../src/modules/learning/application/glossary-score-outbox';
import type {
  RankedQuestion,
  ScoreResult,
} from '../src/modules/learning/domain/entities/quiz.types';

vi.mock('../src/modules/learning/application/glossary-leaderboard', () => ({
  glossaryLeaderboardApi: { getQuestion: vi.fn(), submitScore: vi.fn() },
}));
const question: RankedQuestion = {
  id: 'question-1',
  mode: 'english_to_uzbek',
  modeLabel: 'Tarjima',
  instruction: 'Tanlang',
  prompt: 'array',
  options: ['massiv', 'satr', 'son', 'graf'],
  expiresAt: '2030-01-01T00:00:00Z',
};
const score: ScoreResult = {
  answer: { questionId: question.id, isCorrect: false, correctAnswer: 'satr' },
  leaderboard: [],
  personal: null,
  participantCount: 1,
};
const pending = (id: string) => ({ id, questionId: `q-${id}`, selectedAnswer: 'massiv' });
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(glossaryLeaderboardApi.getQuestion).mockResolvedValue(question);
  vi.mocked(glossaryLeaderboardApi.submitScore).mockResolvedValue(score);
});
afterEach(() => {
  cleanup();
  safeStorage
    .keys()
    .filter((key) => key.startsWith(GLOSSARY_QUIZ_OUTBOX_STORAGE_KEY))
    .forEach((key) => safeStorage.removeItem(key));
  vi.restoreAllMocks();
});

describe('owned quiz outbox', () => {
  it('deduplicates question retries and never flushes another owner', async () => {
    enqueueGlossaryScore('A', pending('one'));
    enqueueGlossaryScore('A', { ...pending('two'), questionId: 'q-one' });
    enqueueGlossaryScore('B', pending('three'));
    const submit = vi.fn().mockResolvedValue('ok');
    await flushGlossaryScoreOutbox('A', submit);
    expect(submit).toHaveBeenCalledExactlyOnceWith(pending('one'));
    expect(readGlossaryScoreOutbox('A')).toEqual([]);
    expect(readGlossaryScoreOutbox('B')).toEqual([pending('three')]);
  });
  it('removes acknowledged answers individually and retains the failing answer', async () => {
    enqueueGlossaryScore('A', pending('one'));
    enqueueGlossaryScore('A', pending('two'));
    const submit = vi.fn().mockResolvedValueOnce('ok').mockRejectedValueOnce(new Error('offline'));
    await expect(flushGlossaryScoreOutbox('A', submit)).rejects.toThrow('offline');
    expect(readGlossaryScoreOutbox('A')).toEqual([pending('two')]);
    await flushGlossaryScoreOutbox('A', async () => 'retry');
    expect(readGlossaryScoreOutbox('A')).toEqual([]);
  });
  it('rejects corrupt stored rows and reports memory-only persistence', () => {
    localStorage.setItem(
      `${GLOSSARY_QUIZ_OUTBOX_STORAGE_KEY}:A`,
      JSON.stringify([{ id: 'legacy', isCorrect: true }, pending('valid'), pending('valid')])
    );
    expect(readGlossaryScoreOutbox('A')).toEqual([pending('valid')]);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    expect(enqueueGlossaryScore('B', pending('memory'))).toBe(false);
    expect(readGlossaryScoreOutbox('B')).toEqual([pending('memory')]);
  });
});

describe('server-ranked React quiz', () => {
  it('loads once in StrictMode and reveals correctness only after server acknowledgement', async () => {
    const reply = deferred<ScoreResult>();
    vi.mocked(glossaryLeaderboardApi.submitScore).mockReturnValue(reply.promise);
    const changed = vi.fn();
    const { result } = renderHook(() => useRankedQuiz('A', changed), {
      wrapper: ({ children }) => <StrictMode>{children}</StrictMode>,
    });
    await waitFor(() => expect(result.current.question).toEqual(question));
    expect(glossaryLeaderboardApi.getQuestion).toHaveBeenCalledExactlyOnceWith('A');
    act(() => result.current.submit('massiv'));
    expect(result.current.answer).toBeNull();
    expect(changed).not.toHaveBeenCalled();
    act(() => result.current.submit('satr'));
    expect(glossaryLeaderboardApi.submitScore).toHaveBeenCalledTimes(1);
    expect(glossaryLeaderboardApi.submitScore).toHaveBeenCalledWith(
      'A',
      expect.objectContaining({ questionId: question.id, selectedAnswer: 'massiv' })
    );
    await act(async () => reply.resolve(score));
    expect(result.current.answer).toEqual(score.answer);
    expect(changed).toHaveBeenCalledTimes(1);
    expect(readGlossaryScoreOutbox('A')).toEqual([]);
  });
  it('retains offline answers and retries the same id when connectivity returns', async () => {
    vi.mocked(glossaryLeaderboardApi.submitScore)
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(score);
    const { result } = renderHook(() => useRankedQuiz('A', vi.fn()));
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.submit('massiv'));
    await waitFor(() => expect(result.current.error).toBe('offline'));
    const queued = readGlossaryScoreOutbox('A')[0];
    expect(queued.selectedAnswer).toBe('massiv');
    act(() => window.dispatchEvent(new Event('online')));
    await waitFor(() => expect(result.current.answer).toEqual(score.answer));
    expect(glossaryLeaderboardApi.submitScore).toHaveBeenNthCalledWith(2, 'A', queued);
  });
  it('warns separately when an offline answer cannot survive a reload', async () => {
    vi.mocked(glossaryLeaderboardApi.submitScore)
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(score);
    const { result } = renderHook(() => useRankedQuiz('A', vi.fn()));
    await waitFor(() => expect(result.current.loading).toBe(false));
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    act(() => result.current.submit('massiv'));
    await waitFor(() => expect(result.current.error).toBe('offline'));
    expect(result.current.storageWarning).toContain('sahifani yangilasangiz');
    const queued = readGlossaryScoreOutbox('A')[0];
    // Retrying the same question must not claim the memory-only row is durable.
    act(() => window.dispatchEvent(new Event('online')));
    await waitFor(() => expect(result.current.answer).toEqual(score.answer));
    expect(glossaryLeaderboardApi.submitScore).toHaveBeenNthCalledWith(2, 'A', queued);
    expect(result.current.storageWarning).toBe('');
  });
  it('keeps the displayed submitted choice aligned with the immutable offline answer', async () => {
    vi.mocked(glossaryLeaderboardApi.submitScore)
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(score);
    const { result } = renderHook(() => useRankedQuiz('A', vi.fn()));
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.submit('massiv'));
    await waitFor(() => expect(result.current.error).toBe('offline'));
    expect(result.current.submittedAnswer).toBe('massiv');
    act(() => result.current.submit('satr'));
    await waitFor(() => expect(result.current.answer).toEqual(score.answer));
    expect(result.current.submittedAnswer).toBe('massiv');
    expect(glossaryLeaderboardApi.submitScore).toHaveBeenNthCalledWith(
      2,
      'A',
      expect.objectContaining({ selectedAnswer: 'massiv' })
    );
  });
  it('locks pending radio choices and retries the visible submitted answer', () => {
    const submit = vi.fn();
    render(
      <QuizQuestion
        question={question}
        answered={null}
        submittedAnswer="massiv"
        onSubmit={submit}
        onNext={vi.fn()}
      />
    );
    const selected = screen.getByRole('radio', { name: 'massiv' }) as HTMLInputElement;
    expect(selected.checked).toBe(true);
    expect(
      screen.getAllByRole('radio').every((radio) => (radio as HTMLInputElement).disabled)
    ).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Qayta yuborish' }));
    expect(submit).toHaveBeenCalledExactlyOnceWith('massiv');
  });
  it('discards expired questions explicitly and allows a fresh question', async () => {
    vi.mocked(glossaryLeaderboardApi.submitScore).mockRejectedValueOnce(
      new ApiError(400, { detail: 'Expired' }, 'Expired')
    );
    const { result } = renderHook(() => useRankedQuiz('A', vi.fn()));
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.submit('massiv'));
    await waitFor(() => expect(result.current.error).toContain('Yangi savol'));
    expect(result.current.question).toBeNull();
    expect(readGlossaryScoreOutbox('A')).toEqual([]);
    await act(async () => result.current.retry());
    expect(result.current.question).toEqual(question);
  });
  it('ignores late UI updates after leaving a session', async () => {
    const reply = deferred<ScoreResult>();
    vi.mocked(glossaryLeaderboardApi.submitScore).mockReturnValue(reply.promise);
    const changed = vi.fn();
    const { result, unmount } = renderHook(() => useRankedQuiz('A', changed));
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.submit('massiv'));
    unmount();
    await act(async () => reply.resolve(score));
    expect(changed).not.toHaveBeenCalled();
  });
  it('recovers a persisted answer while no question could load offline', async () => {
    enqueueGlossaryScore('A', pending('previous'));
    vi.mocked(glossaryLeaderboardApi.submitScore)
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(score);
    const { result } = renderHook(() => useRankedQuiz('A', vi.fn()));
    await waitFor(() => expect(result.current.error).toBe('offline'));
    expect(result.current.question).toBeNull();
    act(() => window.dispatchEvent(new Event('online')));
    await waitFor(() => expect(result.current.question).toEqual(question));
  });
});
