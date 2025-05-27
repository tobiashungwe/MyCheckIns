import PropTypes from 'prop-types';
import { Dialog, DialogContent, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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
          <Typography variant="h4" gutterBottom>{post.title}</Typography>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {new Date(post.date).toLocaleDateString()}
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {post.content}
          </Typography>
        </DialogContent>
      )}
    </Dialog>
  );
}

PostModal.propTypes = {
  open: PropTypes.bool.isRequired,
  post: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};