import PropTypes from 'prop-types';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';

export default function PostList({ posts, onJumpToDate, onOpenPost }) {
  return (
    <Box sx={{ mt: 6, mx: 'auto', px: 2, maxWidth: 960, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {posts.map((post) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
        >
          <Card
            onClick={() => onJumpToDate(new Date(post.date))}
            onDoubleClick={() => onOpenPost(post)}
            sx={{ cursor: 'pointer', position: 'relative', width: '100%' }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>{post.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {new Date(post.date).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {post.excerpt}
              </Typography>

              {/* independent button for accessibility / single-click users */}
              <Button
                size="small"
                variant="outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPost(post);
                }}
              >
                Read post
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </Box>
  );
}

PostList.propTypes = {
  posts: PropTypes.array.isRequired,
  onJumpToDate: PropTypes.func.isRequired,
  onOpenPost: PropTypes.func.isRequired,
};
