import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, CircularProgress, Alert } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { isSameDay } from 'date-fns';
import CustomCalendar from './CustomCalendar';
import MonthlyView from './MonthlyView';
import PostList from './PostList';
import PostModal from './PostModal';

export default function BlogCalendar() {
  // calendar
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState([]);

  // posts
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postError, setPostError] = useState('');

  // modal
  const [modalPost, setModalPost] = useState(null);

  // monthly picker
  const [showMonthly, setShowMonthly] = useState(false);

  /* ------------------------------------------------
   * Fetch calendar events (visits OR any events you
   * still want to highlight in the blog view)
   * ------------------------------------------------ */
  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const res = await axios.get('/api/visits/');
        setCalendarEvents(
          res.data.map((v) => ({
            id: v.id,
            title: v.visitor_name,
            start: new Date(v.start_date),
            end: new Date(v.end_date),
            allDay: true,
          })),
        );
      } catch {
        /* silent for now – optional error ui */
      }
    };
    fetchVisits();
  }, []);

  /* ------------------------------------------------
   * Fetch posts (dummy fallback for now)
   * ------------------------------------------------ */
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('/api/posts/');
        setPosts(res.data);
      } catch {
        // Dummy data while there is no back-end
        setPosts([
          {
            id: 1,
            title: 'Landing in my Erasmus city ✈️',
            date: '2025-05-15',
            excerpt: 'Just arrived and the sunshine already feels amazing…',
            content: `Day 1 – the apartment hunt\n\nLorem ipsum dolor sit amet…`,
          },
          {
            id: 2,
            title: 'First week recap',
            date: '2025-05-22',
            excerpt: 'Classes started, met incredible people, and found the best local bakery.',
            content: `Here’s everything that happened during my first week…`,
          },
          {
            id: 3,
            title: 'Weekend trip to the mountains 🏔️',
            date: '2025-05-29',
            excerpt: 'Escaped the city for some fresh air and stunning views.',
            content: `A weekend well spent in nature…`,
          },
          {
            id: 4,
            title: 'Cultural experiences in my host country',
            date: '2025-06-05',
            excerpt: 'Exploring local traditions and festivals.',
            content: `From food to music, here’s what I’ve discovered…`,
          },
          {
            id: 5,
            title: 'Mid-year reflections',
            date: '2025-06-12',
            excerpt: 'Halfway through my Erasmus journey, here’s what I’ve learned.',
            content: `It’s been an incredible experience so far…`,
          },
          {
            id: 6,
            title: 'Planning my next adventures',
            date: '2025-06-19',
            excerpt: 'Thinking about where to go next during my time abroad.',
            content: `Here are some ideas I’m considering, so i went to the travel agency and booked a trip to Paris… Then i went to the travel agency and booked a trip to Paris …` ,
          },
          {
            id: 7,
            title: 'Farewell to my Erasmus city',
            date: '2025-06-26',
            excerpt: 'Saying goodbye to an unforgettable chapter of my life.',
            content: `As I prepare to leave, I reflect on all the amazing memories…`,
          },
        ]);

      } finally {
        setLoadingPosts(false);
      }
    };
    fetchPosts();
  }, []);

  /* ------------------------------------------------
   * Helpers
   * ------------------------------------------------ */
  const jumpToDate = (date) => {
    setSelectedDate(date);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // when a date-cell with posts is clicked
  const handleSelectDay = (date) => {
    const todaysPosts = posts.filter((p) =>
      isSameDay(new Date(p.date), date)
    );
    if (todaysPosts.length) openPost(todaysPosts[0]); // open first
    jumpToDate(date);
  };

  const openPost = (post) => setModalPost(post);
  const closePost = () => setModalPost(null);

  /* ------------------------------------------------
   * UI
   * ------------------------------------------------ */
  if (loadingPosts) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (postError) {
    return (
      <Box mt={2}>
        <Alert severity="error">{postError}</Alert>
      </Box>
    );
  }

  return (
    <>
      {/* Calendar wrapper – 80 vw up to 1600 px on ultra-wide */}
      <Box sx={{ px: { xs: 2, md: 4 }, pb: 6 }}>
        <Box sx={{ width: '80vw', maxWidth: 1600, mx: 'auto' }}>
          <CustomCalendar
            initialDate={selectedDate}
            onShowMonthly={() => setShowMonthly(true)}
            events={calendarEvents}
            posts={posts}                 
            onSelectDay={handleSelectDay}
          />
        </Box>

        {/* scroll cue */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <KeyboardArrowDownIcon
            sx={{
              fontSize: 40,
              animation: 'bounce 2s infinite',
              '@keyframes bounce': {
                '0%,20%,50%,80%,100%': { transform: 'translateY(0)' },
                '40%': { transform: 'translateY(-8px)' },
                '60%': { transform: 'translateY(-4px)' },
              },
            }}
          />
        </Box>
      </Box>

      {/* Post list – centred */}
      <Box sx={{ width: '80vw', maxWidth: 1600, mx: 'auto' }}>
        <PostList posts={posts} onJumpToDate={jumpToDate} onOpenPost={openPost} />
      </Box>

      {/* Month-picker modal */}
      {showMonthly && (
        <MonthlyView
          initialDate={selectedDate}
          posts={posts}                 // ⬅ new
          onClose={() => setShowMonthly(false)}
          onSelectDay={(d) => {
            handleSelectDay(d);
            setShowMonthly(false);
          }}
        />
      )}

      {/* Post reader modal */}
      <PostModal open={!!modalPost} post={modalPost} onClose={closePost} />
    </>
  );
}
