import type { LearningArticle } from '../../domain';

import { UiIcon } from 'shared/ui/UiIcon';
import { Link as RouterLink } from 'react-router';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { getArticlePath } from '../../domain';

type ArticleCardProps = {
  article: LearningArticle;
  compact?: boolean;
  bookmarked?: boolean;
  onBookmark?: (slug: string) => void;
};

export function ArticleCard({ article, compact, bookmarked, onBookmark }: ArticleCardProps) {
  const editorialStatus = article.editorialStatus ?? 'draft';
  const statusLabel = editorialStatus === 'published'
    ? 'Nashr qilingan'
    : editorialStatus === 'draft'
      ? 'Tarjima qoralamasi'
      : 'Tayyor · tekshiruvda';
  const statusColor = editorialStatus === 'published'
    ? 'success'
    : editorialStatus === 'draft'
      ? 'warning'
      : 'primary';
  const difficultyColor = article.difficulty === 'Boshlang‘ich'
    ? 'info'
    : article.difficulty === 'O‘rta'
      ? 'warning'
      : 'error';

  return (
    <Box
      component="article"
      sx={{
        px: { xs: 0, sm: 2 },
        py: 2.75,
        gap: 2.5,
        height: '100%',
        display: 'flex',
        borderBottom: 1,
        borderColor: 'divider',
        flexDirection: 'column',
        transition: (theme) => theme.transitions.create('background-color'),
        '&:hover': { bgcolor: 'background.neutral' },
        ...(compact && {
          display: 'grid',
          alignItems: 'center',
          gridTemplateColumns: { xs: '1fr auto', sm: 'minmax(0, 1fr) auto auto' },
        }),
      }}
    >
      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5, flexWrap: 'wrap' }}>
          <Stack direction="row" spacing={0.625} alignItems="center" sx={{ color: 'text.secondary' }}>
            <UiIcon icon="solar:folder-open-linear" width={16} />
            <Typography variant="caption" sx={{ color: 'inherit', fontWeight: 'fontWeightSemiBold' }}>
              {article.category}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.625} alignItems="center" sx={{ color: 'text.secondary' }}>
            <UiIcon icon="solar:clock-circle-linear" width={16} />
            <Typography variant="caption" sx={{ color: 'inherit' }}>{article.readTime} daqiqa</Typography>
          </Stack>
        </Stack>

        <Typography
          component={RouterLink}
          to={getArticlePath(article)}
          variant="h6"
          sx={{
            color: 'text.primary',
            textDecoration: 'none',
            '&:hover': { color: 'primary.main' },
          }}
        >
          {article.title}
        </Typography>

        {!compact && (
          <Typography
            variant="body2"
            sx={(theme) => ({
              mt: 1,
              color: 'text.secondary',
              ...theme.mixins.maxLine({ line: 2 }),
            })}
          >
            {article.summary}
          </Typography>
        )}

        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 2, flexWrap: 'wrap' }}>
          <Chip label={statusLabel} size="small" color={statusColor} variant="soft" />
          <Chip label={article.difficulty} size="small" color={difficultyColor} variant="soft" />
        </Stack>
      </Box>

      <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="space-between">
        <Button
          component={RouterLink}
          to={getArticlePath(article)}
          color="primary"
          size="small"
          endIcon={<UiIcon icon="solar:alt-arrow-right-linear" width={17} />}
        >
          O‘qish
        </Button>
        {onBookmark && (
          <Tooltip title={bookmarked ? 'Saqlanganlardan olib tashlash' : 'Saqlash'}>
            <IconButton
              size="small"
              color={bookmarked ? 'primary' : 'default'}
              aria-label={bookmarked ? 'Saqlanganlardan olib tashlash' : 'Keyinroq uchun saqlash'}
              onClick={() => onBookmark(article.sourceId ?? article.slug)}
            >
              <UiIcon icon={bookmarked ? 'solar:bookmark-bold' : 'solar:bookmark-linear'} width={19} />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      {typeof article.progress === 'number' && article.progress > 0 && article.progress < 100 && (
        <LinearProgress
          variant="determinate"
          value={article.progress}
          aria-label={`${article.progress}% o‘qilgan`}
          sx={{ gridColumn: '1 / -1', height: 4, borderRadius: 1 }}
        />
      )}
    </Box>
  );
}
