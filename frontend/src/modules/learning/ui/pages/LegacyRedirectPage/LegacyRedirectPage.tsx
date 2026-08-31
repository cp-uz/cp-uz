import { Navigate, useParams } from 'react-router';

import { normalizeLegacySlug } from '../../../domain';

export default function LegacyRedirectPage() {
  const { category = 'misc', legacySlug = '' } = useParams();
  return <Navigate to={`/algoritmlar/${category}/${normalizeLegacySlug(legacySlug)}`} replace />;
}
