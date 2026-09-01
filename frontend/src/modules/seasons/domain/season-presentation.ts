import type {
  SeasonEvent,
  SeasonRoute,
  SeasonDetail,
  SeasonRouteColor,
  SeasonResourceType,
} from './entities';

export const SEASON_ROUTE_PRESENTATION: Record<
  SeasonRouteColor,
  { color: string; darkColor: string; icon: string; label: string }
> = {
  blue: {
    color: '#0874D9',
    darkColor: '#63AEF5',
    icon: 'solar:diploma-linear',
    label: 'Asosiy olimpiada',
  },
  red: {
    color: '#C94755',
    darkColor: '#F08490',
    icon: 'solar:medal-ribbon-star-linear',
    label: 'EGOI yo‘nalishi',
  },
  brown: {
    color: '#895A3A',
    darkColor: '#D7A47F',
    icon: 'solar:cup-star-linear',
    label: 'Al-Xorazmiy yo‘nalishi',
  },
  teal: {
    color: '#007E7B',
    darkColor: '#55C5C1',
    icon: 'solar:global-linear',
    label: 'APIO yo‘nalishi',
  },
  gold: {
    color: '#A87308',
    darkColor: '#F0BF52',
    icon: 'solar:cup-first-linear',
    label: 'Xalqaro olimpiada',
  },
  purple: {
    color: '#7253B7',
    darkColor: '#AD91EC',
    icon: 'solar:star-ring-linear',
    label: 'Muhim norasmiy musobaqa',
  },
  green: {
    color: '#257957',
    darkColor: '#6FC99D',
    icon: 'solar:running-round-linear',
    label: 'Rasmiy tayyorgarlik',
  },
  neutral: {
    color: '#647487',
    darkColor: '#AAB7C5',
    icon: 'solar:calendar-linear',
    label: 'Boshqa yo‘nalish',
  },
};

export const EVENT_TYPE_LABELS: Record<SeasonEvent['type'], string> = {
  stage: 'Olimpiada bosqichi',
  selection: 'Saralash bosqichi',
  training: 'Rasmiy tayyorgarlik',
  international: 'Xalqaro olimpiada',
  unofficial: 'Muhim norasmiy musobaqa',
};

export const EVENT_STATUS_LABELS: Record<SeasonEvent['status'], string> = {
  tba: 'Sana hali noma’lum',
  scheduled: 'Rejalashtirilgan',
  live: 'Hozir davom etmoqda',
  completed: 'Yakunlangan',
  postponed: 'Keyinga qoldirilgan',
  cancelled: 'Bekor qilingan',
};

export const RESOURCE_PRESENTATION: Record<SeasonResourceType, { label: string; icon: string }> = {
  official: { label: 'Rasmiy sahifa', icon: 'solar:verified-check-linear' },
  announcement: { label: 'Rasmiy e’lon', icon: 'solar:document-text-linear' },
  schedule: { label: 'Jadval', icon: 'solar:calendar-date-linear' },
  rules: { label: 'Nizom va qoidalar', icon: 'solar:document-add-linear' },
  registration: { label: 'Ro‘yxatdan o‘tish', icon: 'solar:pen-new-square-linear' },
  platform: { label: 'Platforma', icon: 'solar:monitor-smartphone-linear' },
  participants: { label: 'Ishtirokchilar', icon: 'solar:users-group-rounded-linear' },
  problems: { label: 'Masalalar', icon: 'solar:code-file-linear' },
  editorial: { label: 'Tahlillar', icon: 'solar:notebook-bookmark-linear' },
  scoreboard: { label: 'Natijalar jadvali', icon: 'solar:ranking-linear' },
  results: { label: 'Yakuniy natijalar', icon: 'solar:medal-ribbon-star-linear' },
  video: { label: 'Video', icon: 'solar:video-library-linear' },
  photos: { label: 'Suratlar', icon: 'solar:gallery-linear' },
  other: { label: 'Qo‘shimcha manba', icon: 'solar:link-linear' },
};

type SeasonAwardPresentation = {
  label: string;
  icon: string;
  color: string;
  darkColor: string;
};

const SEASON_AWARD_PRESENTATION: Record<string, SeasonAwardPresentation> = {
  gold: {
    label: 'Oltin medal',
    icon: 'solar:medal-ribbon-star-bold-duotone',
    color: '#A87308',
    darkColor: '#F0BF52',
  },
  silver: {
    label: 'Kumush medal',
    icon: 'solar:medal-ribbon-star-bold-duotone',
    color: '#6C7785',
    darkColor: '#AAB7C5',
  },
  bronze: {
    label: 'Bronza medal',
    icon: 'solar:medal-ribbon-star-bold-duotone',
    color: '#A65C2E',
    darkColor: '#D7A47F',
  },
  honourable_mention: {
    label: 'Faxriy e’tirof',
    icon: 'solar:star-bold-duotone',
    color: '#466B93',
    darkColor: '#82AAFF',
  },
  other: {
    label: 'Sovrin',
    icon: 'solar:cup-star-bold-duotone',
    color: '#647487',
    darkColor: '#AAB7C5',
  },
};

export function seasonAwardPresentation(award?: string) {
  const value = award?.trim();
  if (!value) return undefined;

  const normalized = value.toLocaleLowerCase('en').replace(/[\s-]+/g, '_');
  const canonical = normalized === 'honorable_mention' ? 'honourable_mention' : normalized;
  if (['participation', 'participant', 'contestant', 'ishtirokchi', 'none'].includes(canonical)) {
    return undefined;
  }
  const presentation = SEASON_AWARD_PRESENTATION[canonical];

  return presentation ?? { ...SEASON_AWARD_PRESENTATION.other, label: value };
}

export function formatSeasonLabel(slug: string) {
  return slug.replace(/^(\d{4})-(\d{4})$/, '$1–$2');
}

export function isFinalSeasonEvent(event: SeasonEvent) {
  return (
    event.type === 'international' ||
    event.routeMemberships.some((membership) => membership.nodeStyle === 'final')
  );
}

export function seasonEventPresentation(event: SeasonEvent, route?: SeasonRoute) {
  if (isFinalSeasonEvent(event)) return SEASON_ROUTE_PRESENTATION.gold;
  if (event.type === 'unofficial') return SEASON_ROUTE_PRESENTATION.purple;
  if (event.type === 'training') return SEASON_ROUTE_PRESENTATION.green;
  return route ? SEASON_ROUTE_PRESENTATION[route.color] : SEASON_ROUTE_PRESENTATION.neutral;
}

export function shouldDeriveSeasonRouteConnections(season: SeasonDetail, routeCode: string) {
  return !season.relations.some((relation) => relation.routeCode === routeCode);
}

export function seasonEventMonthKey(event: SeasonEvent) {
  if (event.datePrecision === 'tba') return 'tba';
  if (event.monthKey) return event.monthKey;
  return event.startDate?.slice(0, 7) || 'tba';
}

const SHORT_UZBEK_MONTHS = [
  'yan',
  'fev',
  'mar',
  'apr',
  'may',
  'iyun',
  'iyul',
  'avg',
  'sen',
  'okt',
  'noy',
  'dek',
] as const;

export function formatSeasonNodeDate(event: SeasonEvent) {
  if (event.datePrecision === 'tba' || !event.startDate) return 'TBA';
  const [, rawMonth, rawDay] = event.startDate.split('-');
  const month = SHORT_UZBEK_MONTHS[Number(rawMonth) - 1];
  if (!month) return EVENT_STATUS_LABELS[event.status];
  if (event.datePrecision === 'month') return month;
  const day = Number(rawDay);
  if (!Number.isFinite(day) || day <= 0) return month;
  if (!event.endDate || event.endDate === event.startDate) return `${day} ${month}`;

  const [, rawEndMonth, rawEndDay] = event.endDate.split('-');
  const endMonth = SHORT_UZBEK_MONTHS[Number(rawEndMonth) - 1];
  const endDay = Number(rawEndDay);
  if (!endMonth || !Number.isFinite(endDay) || endDay <= 0) return `${day} ${month}`;
  if (rawMonth === rawEndMonth) return `${day}–${endDay} ${month}`;
  return `${day} ${month} – ${endDay} ${endMonth}`;
}

export function sortedSeasonEvents(season: SeasonDetail) {
  return [...season.events].sort((left, right) => {
    if (left.order !== right.order) return left.order - right.order;
    if (left.startDate && right.startDate && left.startDate !== right.startDate) {
      return left.startDate.localeCompare(right.startDate);
    }
    return left.title.localeCompare(right.title, 'uz');
  });
}

export function seasonTimelineSlotIndexes(events: SeasonEvent[]) {
  const slotByDate = new Map<string, number>();
  const slotByEvent = new Map<SeasonEvent['id'], number>();
  let nextSlot = 0;

  events.forEach((event) => {
    const dateKey =
      event.datePrecision !== 'tba' && event.startDate ? `date:${event.startDate}` : undefined;
    const existingSlot = dateKey ? slotByDate.get(dateKey) : undefined;
    const slot = existingSlot ?? nextSlot;
    if (existingSlot === undefined) {
      if (dateKey) slotByDate.set(dateKey, slot);
      nextSlot += 1;
    }
    slotByEvent.set(event.id, slot);
  });

  return { slotByEvent, slotCount: nextSlot };
}

export function findCurrentSeasonEvent(season: SeasonDetail, now = new Date()) {
  const nowKey = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
  const events = sortedSeasonEvents(season);
  if (season.endsOn && nowKey > season.endsOn) {
    const completedWithDates = events
      .filter((event) => event.status === 'completed' && event.startDate)
      .sort((left, right) => {
        const leftDate = left.endDate || left.startDate || '';
        const rightDate = right.endDate || right.startDate || '';
        return leftDate.localeCompare(rightDate);
      });
    const latestCompleted = completedWithDates[completedWithDates.length - 1];
    if (latestCompleted) return latestCompleted;
  }
  return (
    events.find((event) => event.status === 'live') ??
    events.find((event) => {
      if (event.status === 'completed' || event.status === 'cancelled') return false;
      return event.datePrecision === 'tba' || !event.startDate || event.startDate >= nowKey;
    }) ??
    events[events.length - 1]
  );
}
