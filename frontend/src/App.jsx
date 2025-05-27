import React, { useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  useTheme,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import BlogCalendar from './components/BlogCalendar';

const SECTIONS = ['intro', 'calendar', 'about'];

/* ───────────── dot navigation ───────────── */
function DotNav({ onDotClick }) {
  return (
    <Box
      sx={{
        position: 'fixed',
        right: { xs: 12, md: 24 },
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        zIndex: 2000,
      }}
    >
      {SECTIONS.map((_, idx) => (
        <IconButton
          key={idx}
          className="dot-nav__dot"
          data-idx={idx}
          onClick={() => onDotClick(idx)}
          sx={{
            width: 14,
            height: 14,
            bgcolor: '#CFCFCF',
            '&.dot-nav__dot--active': {
              bgcolor: 'primary.main',
              boxShadow: '0 0 0 4px rgba(255,255,255,0.3)',
            },
          }}
        />
      ))}
    </Box>
  );
}

/* ───────────── main app ───────────── */
export default function App() {
  const theme = useTheme();

  /* refs for the three slides */
  const containerRef = useRef(null);
  const sectionRefs = useRef(SECTIONS.map(() => React.createRef()));

  /* click-dot → scroll */
  const scrollTo = (idx) =>
    sectionRefs.current[idx].current?.scrollIntoView({
      behavior: 'smooth',
    });

  /* observe which slide is in view → highlight that dot */
  useEffect(() => {
    const opts = { root: containerRef.current, threshold: 0.55 };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const idx = Number(entry.target.dataset.idx);
        document
          .querySelectorAll('.dot-nav__dot')
          .forEach((d) =>
            d.classList.toggle('dot-nav__dot--active', idx === Number(d.dataset.idx))
          );
      });
    }, opts);

    sectionRefs.current.forEach((r) => io.observe(r.current));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <DotNav onDotClick={scrollTo} />

      {/* wrapper with native scroll-snap */}
      <Box
        ref={containerRef}
        sx={{
          height: '100vh',
          overflowY: 'auto',
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth',
        }}
      >
        {/* ▸ Slide 1 – INTRO */}
        <Box
          ref={sectionRefs.current[0]}
          data-idx={0}
          id="intro"
          sx={{
            scrollSnapAlign: 'start',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            px: 3,
            background: `linear-gradient(180deg,#FFEFEF 0%,#FFE0E0 100%)`,
            color: '#fff',
          }}
        >
          <Container maxWidth="md">
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, color: 'primary.main' }}>
              Erasmus Chronicles
            </Typography>
            <Typography variant="h5" color="text.secondary" mb={6}>
              Stories, tips &amp; candid notes from my year abroad.
            </Typography>

            <IconButton
              aria-label="scroll to calendar"
              onClick={() => scrollTo(1)}
              sx={{
                bgcolor: 'primary.main',
                color: '#fff',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              <KeyboardArrowDownIcon fontSize="large" />
            </IconButton>
          </Container>
        </Box>

        {/* ▸ Slide 2 – CALENDAR + POSTS */}
        <Box
          ref={sectionRefs.current[1]}
          data-idx={1}
          id="calendar"
          sx={{
            scrollSnapAlign: 'start',
            minHeight: '100vh',
            bgcolor: '#FFFBFB',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <BlogCalendar />
        </Box>

        {/* ▸ Slide 3 – ABOUT / CTA */}
        <Box
          ref={sectionRefs.current[2]}
          data-idx={2}
          id="about"
          sx={{
            scrollSnapAlign: 'start',
            minHeight: '100vh',
            bgcolor: '#FAD7D0',
            color: '#4B4B4B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 4,
          }}
        >
          <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
            <Typography variant="h4" mb={2} fontWeight={700}>
              Stay in the loop
            </Typography>
            <Typography variant="body1" mb={4}>
              New posts every week. Pop your email below &amp; I’ll ping you when something cool
              happens!
            </Typography>
            {/* <SubscriptionForm /> */}
          </Container>
        </Box>
      </Box>
    </>
  );
}
