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
  /* ---------------- state ---------------- */
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postError, setPostError] = useState('');

  const [modalPost, setModalPost] = useState(null);
  const [showMonthly, setShowMonthly] = useState(false);

  /* -------- fetch posts from new API -------- */
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get('/api/posts/');
        if (!data.length) {
          setPostError('No posts available (yet).');
          return;
        }

        // map API ↔ front-end shape
        const mapped = data.map((p) => ({
          id: p.id,
          title: p.title,
          date: p.publish_date,            // back-end field
          content: p.body_md,
          excerpt:
            p.body_md.split('\n')[0].slice(0, 140) +    // first line, max 140
            (p.body_md.length > 140 ? '…' : ''),
        }));
        // sort by date ascending
        mapped.sort((a, b) => new Date(a.date) - new Date(b.date));
        setPosts(mapped);
      } catch (err) {
        console.error(err);
        setPostError('Could not reach the server.');
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchPosts();
  }, []);

  /* ---------- helpers ---------- */
  const jumpToDate = (date) => {
    setSelectedDate(date);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDay = (date) => {
    const todaysPosts = posts.filter((p) =>
      isSameDay(new Date(p.date), date)
    );
    if (todaysPosts.length) setModalPost(todaysPosts[0]);
    jumpToDate(date);
  };

  /* ---------- UI states ---------- */
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
        <Alert severity="info">{postError}</Alert>
      </Box>
    );
  }

  /* ---------- happy path ---------- */
  return (
    <>
      {/* Calendar wrapper */}
      <Box sx={{ px: { xs: 2, md: 4 }, pb: 6 }}>
        <Box sx={{ width: '85vw', maxWidth: 1700, mx: 'auto' }}>
          <CustomCalendar
            initialDate={selectedDate}
            onShowMonthly={() => setShowMonthly(true)}
            posts={posts}
            onSelectDay={handleSelectDay}
          />
        </Box>

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

      {/* Post list */}
      <Box sx={{ width: '85vw', maxWidth: 1700, mx: 'auto' }}>
        <PostList
          posts={posts}
          onJumpToDate={jumpToDate}
          onOpenPost={setModalPost}
        />
      </Box>

      {/* Month picker */}
      {showMonthly && (
        <MonthlyView
          initialDate={selectedDate}
          posts={posts}
          onClose={() => setShowMonthly(false)}
          onSelectDay={(d) => {
            handleSelectDay(d);
            setShowMonthly(false);
          }}
        />
      )}

      {/* Post modal */}
      <PostModal
        open={!!modalPost}
        post={modalPost}
        onClose={() => setModalPost(null)}
      />
    </>
  );
}
