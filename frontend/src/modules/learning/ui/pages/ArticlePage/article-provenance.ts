import type { LearningArticle } from '../../../domain';

function displayContributorName(name: string) {
  const automatedActor = /^(import[-_]|pipeline[-_])|openai|gpt[-_\d]|translation[-_]bot/i;
  return automatedActor.test(name.trim()) ? 'cp.uz tarjima jamoasi' : name;
}

export function articleProvenance(article: LearningArticle) {
  const isHumanReviewed =
    article.reviewState?.technical === 'approved' && article.reviewState?.language === 'approved';
  const reviewLabel = isHumanReviewed ? 'Tekshiruvdan o‘tgan tarjima' : 'AI-tarjima';
  const sourceLinks = [
    article.sourceUrl
      ? {
          label: 'Original maqola',
          site: 'cp-algorithms.com',
          href: article.sourceUrl,
        }
      : null,
    article.russianSourceUrl
      ? {
          label: 'Ruscha',
          site: 'e-maxx.ru',
          href: article.russianSourceUrl,
        }
      : null,
  ].filter((item): item is { label: string; site: string; href: string } => Boolean(item));
  const contributors = (article.contributors ?? [])
    .map((item) => ({ ...item, name: displayContributorName(item.name) }))
    .filter(
      (item, index, items) => items.findIndex((candidate) => candidate.name === item.name) === index
    );
  const revisions = (article.revisions ?? []).map((revision) => ({
    ...revision,
    author: displayContributorName(revision.author),
  }));
  return { isHumanReviewed, reviewLabel, sourceLinks, contributors, revisions };
}
