import React, { useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import BlogCalendar from './components/BlogCalendar';
import heroImg from './assets/hero.jpeg';
import Link from '@mui/material/Link';

const SECTIONS = ['intro', 'calendar', 'about'];
const heroAlt =
  'Lund, Sweden – Erasmus 2024-25';

/* ───────────── dot navigation ───────────── */
function DotNav({ active, onDotClick }) {
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
          onClick={() => onDotClick(idx)}
          sx={{
            width: 14,
            height: 14,
            bgcolor: idx === active ? 'white' : '#CFCFCF',
            boxShadow:
              idx === active
                ? '0 0 0 4px #6699FF'
                : 'none',
            transition: 'all .25s',
          }}
        />
      ))}
    </Box>
  );
}

/* ───────────── main app ───────────── */
export default function App() {
  /* refs & state */
  const containerRef = useRef(null);
  const sectionRefs = useRef(SECTIONS.map(() => React.createRef()));
  const [activeIdx, setActiveIdx] = React.useState(0);

  /* helper: scroll to a slide */
  const scrollTo = (idx) => {
    sectionRefs.current[idx].current?.scrollIntoView({
      behavior: 'smooth',
    });
    setActiveIdx(idx); // instant dot feedback
  };

  /* on-scroll: work out which slide is nearest the top */
  useEffect(() => {
    const container = containerRef.current;
    const handler = () => {
      const { scrollTop } = container;
      const idx = Math.round(scrollTop / window.innerHeight);
      if (idx !== activeIdx) setActiveIdx(idx);
    };
    container.addEventListener('scroll', handler, { passive: true });
    return () => container.removeEventListener('scroll', handler);
  }, [activeIdx]);

  return (
    <>
      <DotNav active={activeIdx} onDotClick={scrollTo} />

      {/* wrapper with scroll-snap */}
      <Box
        ref={containerRef}
        sx={{
          height: '100vh',
          overflowY: 'auto',
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth',
          width: '100vw',
        }}
      >
        {/* ───── Slide 1 – INTRO ───── */}
        <Box
          ref={sectionRefs.current[0]}
          id="intro"
          aria-label={heroAlt}
          sx={{
            scrollSnapAlign: 'start',
            minHeight: '100vh',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            px: 3,
            color: '#fff',
            backgroundImage: `url(${heroImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            '&::after': {
              content: `"${heroAlt}"`,
              position: 'absolute',
              bottom: 16,
              left: 16,
              fontSize: '0.75rem',
              color: '#FFF',
              opacity: 0.9,
              fontStyle: 'italic',
            },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45))',
            }}
          />
          <Container
            maxWidth="md"
            sx={{ position: 'relative', zIndex: 1 }}
          >
            {/* <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
              Erasmus&nbsp;Chronicles
            </Typography> */}
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
            Build · Reflect · Share
            </Typography>
            {/* <Typography variant="h5" mb={6}>
              Stories, tips &amp; candid notes from my year abroad.
            </Typography> */}
            <Typography variant="h5" mb={6}>
            A living journal of what I’m building, what I’m learning, and the experiences shaping me — from Erasmus moments to real-world dev work.
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

        {/* ───── Slide 2 – CALENDAR + POSTS ───── */}
        <Box
          ref={sectionRefs.current[1]}
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

        {/* ───── Slide 3 – ABOUT ───── */}
        <Box
          ref={sectionRefs.current[2]}
          id="about"
          sx={{
            scrollSnapAlign: 'start',
            minHeight: '100vh',
            bgcolor: '#D6F4FF',
            color: '#4B4B4B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 4,
          }}
        >
          <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
            <Typography variant="h4"  fontWeight={700}>
            This started as a school project.
            </Typography>
            <Typography variant="h4" mb={2} fontWeight={1000}>
            Now it's a bit more.
            </Typography>
            <Typography variant="body1" mb={4}>
            Originally part of my Professional Networking module at Howest, this blog became something I actually enjoy. I update it when there's something real to share — a project, an insight, or a moment that mattered.
            </Typography>
            <Typography variant="body2" mb={4}>
            No schedule. No pressure. Just honest, useful reflections. If that sounds good to you — welcome.
            </Typography>

            <Typography variant="overline" mb={4}>
            Check out:  <Link href="https://hungwevision.com" color="#7393B3">My portfolio</Link>
            </Typography>

            {/* <SubscriptionForm /> */}
          </Container>
        </Box>
      </Box>
    </>
  );
}
