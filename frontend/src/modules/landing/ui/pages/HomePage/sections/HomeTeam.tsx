import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { teamMembers } from './team-members';

export function HomeTeam() {
  return (
    <Box
      component="section"
      aria-labelledby="team-heading"
      sx={{
        py: { xs: 7, md: 9 },
        bgcolor: 'background.neutral',
        contentVisibility: 'auto',
        containIntrinsicSize: 'auto 1700px',
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ mb: { xs: 4, md: 5 }, maxWidth: 640 }}>
          <Typography component="span" variant="subtitle2" sx={{ color: 'primary.dark' }}>
            Platforma ortidagi insonlar
          </Typography>
          <Typography id="team-heading" component="h2" variant="h3" sx={{ mt: 1 }}>
            cp uz; jamoasi
          </Typography>
          <Typography sx={{ mt: 1.5, color: 'text.secondary' }}>
            O‘zbek sport dasturlash hamjamiyatini birga rivojlantirayotgan jamoa.
          </Typography>
        </Box>

        <Box
          sx={{
            gap: { xs: 4, sm: 3, md: 3.5 },
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(3, minmax(0, 1fr))',
            },
          }}
        >
          {teamMembers.map((member) => (
            <Box component="article" key={member.name}>
              <Box
                component="img"
                src={member.image}
                alt={`${member.name} portreti`}
                width={640}
                height={640}
                loading="lazy"
                decoding="async"
                sx={{
                  width: '100%',
                  display: 'block',
                  aspectRatio: '1 / 1',
                  objectFit: 'cover',
                  bgcolor: 'background.paper',
                }}
              />
              <Typography component="h3" variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
                {member.name}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                {member.role}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
