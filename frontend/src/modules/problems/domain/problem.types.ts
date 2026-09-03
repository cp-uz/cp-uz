export type ProblemTranslationStatus =
  | 'ai_translation'
  | 'reviewed_translation'
  | 'original_uzbek';

export type ProblemLink = {
  id: string;
  kind: 'original' | 'practice' | 'editorial' | 'package' | 'solution';
  kindLabel: string;
  title: string;
  url: string;
  platform?: string;
  official: boolean;
  primary: boolean;
  order: number;
};

export type ProblemSummary = {
  id: string;
  slug: string;
  code: string;
  title: string;
  originalTitle?: string;
  translationStatus: ProblemTranslationStatus;
  translationStatusLabel: string;
  problemType: string;
  problemTypeLabel: string;
  rating?: number;
  difficultyLabel?: string;
  order: number;
};

export type ProblemSet = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  dateLabel?: string;
  order: number;
  problems: ProblemSummary[];
};

export type ProblemSeason = {
  title: string;
  slug: string;
  startDate?: string;
  endDate?: string;
};

export type ProblemEvent = {
  code: string;
  slug: string;
  title: string;
  shortTitle?: string;
  summary?: string;
  description?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  dateLabel?: string;
  location?: string;
  venue?: string;
  mode?: string;
  organizer?: string;
};

export type ProblemCatalogEvent = {
  season: ProblemSeason;
  event: ProblemEvent;
  sets: ProblemSet[];
  problemCount: number;
};

export type ProblemCatalog = {
  seasons: ProblemSeason[];
  events: ProblemCatalogEvent[];
};

export type ProblemEventDetail = {
  season: ProblemSeason;
  event: ProblemEvent;
  sets: ProblemSet[];
};

export type ProblemDetail = ProblemSummary & {
  statementMarkdown: string;
  sourcePath: string;
  timeLimitMs?: number;
  memoryLimitMb?: number;
  maxScore?: string;
  tags: string[];
  lastVerifiedOn?: string;
  links: ProblemLink[];
  attachments: Array<{
    id: string;
    title: string;
    url: string;
    contentType?: string;
    sizeBytes?: number;
    order: number;
  }>;
  problemSet: Omit<ProblemSet, 'id' | 'description' | 'problems'>;
  season: ProblemSeason;
  event: ProblemEvent;
  sets: ProblemSet[];
};
