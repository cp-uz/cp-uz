export type SeasonStatus = 'draft' | 'published' | 'archived';

export type SeasonVerificationStatus = 'pending' | 'verified' | 'unverified' | 'disputed';

export type SeasonRouteColor =
  | 'blue'
  | 'red'
  | 'brown'
  | 'teal'
  | 'gold'
  | 'purple'
  | 'green'
  | 'neutral';

export type SeasonRouteKind =
  | 'official'
  | 'selection'
  | 'international'
  | 'unofficial'
  | 'training';

export type SeasonEventType = 'stage' | 'selection' | 'training' | 'international' | 'unofficial';

export type SeasonEventStatus =
  | 'tba'
  | 'scheduled'
  | 'live'
  | 'completed'
  | 'postponed'
  | 'cancelled';

export type DatePrecision = 'tba' | 'month' | 'day' | 'range';

export type SeasonNodeStyle = 'default' | 'final' | 'training';

export type SeasonRoute = {
  id: number | string;
  code: string;
  title: string;
  description: string;
  kind: SeasonRouteKind;
  color: SeasonRouteColor;
  lineStyle: 'solid' | 'dashed' | 'dotted';
  icon?: string;
  logoUrl?: string;
  order: number;
};

export type SeasonRouteMembership = {
  routeCode: string;
  order: number;
  nodeStyle: SeasonNodeStyle;
  label?: string;
};

export type SeasonResourceType =
  | 'official'
  | 'announcement'
  | 'schedule'
  | 'rules'
  | 'registration'
  | 'platform'
  | 'participants'
  | 'problems'
  | 'editorial'
  | 'scoreboard'
  | 'results'
  | 'video'
  | 'photos'
  | 'other';

export type SeasonSource = {
  id: number | string;
  type: string;
  title: string;
  url: string;
  publisher?: string;
  accessedOn?: string;
  primary: boolean;
  notes?: string;
};

export type SeasonResource = {
  id: number | string;
  type: SeasonResourceType;
  title: string;
  url: string;
  official: boolean;
  order: number;
};

export type SeasonResult = {
  id: number | string;
  participantId?: number | string;
  participantSlug?: string;
  participantName: string;
  teamName?: string;
  teamMembers?: string[];
  countryCode?: string;
  school?: string;
  region?: string;
  rank?: string;
  score?: string;
  award?: string;
  category?: string;
  local: boolean;
  sourceUrl?: string;
};

export type SeasonParticipantPlatformAccount = {
  id: number | string;
  platform: string;
  platformLabel: string;
  handle: string;
  url: string;
  title?: string;
  verified: boolean;
  order: number;
};

export type SeasonParticipantResult = {
  id: number | string;
  eventSlug: string;
  eventTitle: string;
  eventShortTitle?: string;
  eventStartDate?: string;
  eventEndDate?: string;
  rank?: string;
  score?: string;
  award?: string;
  category?: string;
  sourceUrl?: string;
};

export type SeasonParticipant = {
  id: number | string;
  slug: string;
  fullName: string;
  aliases: string[];
  countryCode?: string;
  region?: string;
  school?: string;
  bio?: string;
  photoUrl?: string;
  platformAccounts: SeasonParticipantPlatformAccount[];
  results: SeasonParticipantResult[];
};

export type SeasonEvent = {
  id: number | string;
  slug: string;
  code: string;
  title: string;
  shortTitle: string;
  summary: string;
  description: string;
  type: SeasonEventType;
  status: SeasonEventStatus;
  datePrecision: DatePrecision;
  startDate?: string;
  endDate?: string;
  dateLabel: string;
  timezone?: string;
  monthKey?: string;
  location?: string;
  venue?: string;
  mode?: string;
  platform?: string;
  organizer?: string;
  eligibility?: string;
  gradeMin?: number;
  gradeMax?: number;
  verificationStatus?: SeasonVerificationStatus;
  verifiedAt?: string;
  order: number;
  routeMemberships: SeasonRouteMembership[];
  resources: SeasonResource[];
  sources: SeasonSource[];
  results: SeasonResult[];
};

export type SeasonRelation = {
  id: number | string;
  fromEventCode: string;
  toEventCode: string;
  relationType: 'qualifies_to' | 'feeds_into' | 'training_for' | 'related_to';
  routeCode?: string;
  lineStyle: 'solid' | 'dashed' | 'dotted';
  label?: string;
};

export type SeasonSummary = {
  id: number | string;
  slug: string;
  title: string;
  summary: string;
  startsOn?: string;
  endsOn?: string;
  status: SeasonStatus;
  verificationStatus?: SeasonVerificationStatus;
  verifiedAt?: string;
  featured: boolean;
  eventCount: number;
};

export type SeasonDetail = SeasonSummary & {
  routes: SeasonRoute[];
  events: SeasonEvent[];
  relations: SeasonRelation[];
  lastVerifiedAt?: string;
};
