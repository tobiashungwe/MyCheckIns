import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';          // ⬅ allow inline HTML (optional)
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

const videoSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    'iframe',
    'video',
    'source',
  ],
  attributes: {
    ...(defaultSchema.attributes || {}),
    iframe: [
      'src',
      'width',
      'height',
      'allow',
      'allowfullscreen',
      'title',
      'frameborder',
    ],
    video: ['src', 'width', 'height', 'controls'],
    source: ['src', 'type'],
  },
}; // ⬅ strip unsafe tags

export default function PostModal({ open, post, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      sx={{
        '& .MuiDialog-container': { backdropFilter: 'blur(4px)' },
      }}
    >
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{ position: 'absolute', right: 16, top: 16, zIndex: 1 }}
      >
        <CloseIcon />
      </IconButton>

      {post && (
        <DialogContent sx={{ pt: 6 }}>
          <Typography variant="h4" gutterBottom>
            {post.title}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {new Date(post.date).toLocaleDateString()}
          </Typography>

          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, [rehypeSanitize, videoSchema]]}
            components={{
              /* paragraphs & headings via MUI */
              p: (props) => (
                <Typography variant="body1" gutterBottom {...props} />
              ),
              h2: (props) => (
                <Typography variant="h6" sx={{ mt: 3 }} {...props} />
              ),
              /* responsive images */
              img: ({ node, ...props }) => (
                <Box
                  component="img"
                  {...props}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 1,
                    mb: 2,
                  }}
                />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </DialogContent>
      )}
    </Dialog>
  );
}

PostModal.propTypes = {
  open: PropTypes.bool.isRequired,
  post: PropTypes.object, // null when closed
  onClose: PropTypes.func.isRequired,
};
