import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { FaRegThumbsUp } from 'react-icons/fa';

const CommentItem = ({
  comment,
  onReplyAdded,
  onLikeUpdate,
  parentId,
  chapterNumber,
  volumeNumber,
}) => {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [likes, setLikes] = useState(comment.likes);
  const [Author, setAuthor] = useState('');
  const [liked, setLiked] = useState(comment.likedByMe === 1);
  const [showReplies, setShowReplies] = useState(false);

  const returnToIdle = () => {
    setReplyOpen(false);
  };

  const toggleLike = async () => {
    setLiked(!liked);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));

    try {
      const res = liked
        ? await axios.delete(`/api/comments/${comment.id}/like`)
        : await axios.post(`/api/comments/${comment.id}/like`);

      setLikes(res.data.likes);
      onLikeUpdate(comment.id, res.data.likes, !!parentId, parentId);
    } catch {
      setLiked(liked);
      setLikes((prev) => (liked ? prev + 1 : prev - 1));
    }
  };

  const submitReply = async () => {
    if (replyText.length < 3) return;
    if (Author != '' && Author.length < 3) return;

    const res = await axios.post('/api/comments/add', {
      volume: volumeNumber,
      chapter: chapterNumber,
      author: Author || 'test',
      content: replyText,
      parent_id: comment.id,
    });

    onReplyAdded(comment.id, {
      ...res.data,
      replies: [],
    });
    setReplyText('');
    setReplyOpen(false);
    setAuthor('');
    setShowReplies(true);
  };

  return (
    <div
      style={{
        border: '1px solid #E4E4E7',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '12px',
        background: '#FAFAFA',
      }}
    >
      <Typography fontWeight={600}>{comment.author}</Typography>
      <Typography fontSize={14} mt={0.5}>
        {comment.content}
      </Typography>

      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginTop: '8px',
        }}
      >
        <Button
          size="small"
          startIcon={<FaRegThumbsUp />}
          onClick={toggleLike}
          sx={{
            color: liked ? '#0A42C2' : '#303033',
            fontWeight: liked ? 600 : 400,
          }}
        >
          {likes}
        </Button>

        <div style={{ display: 'flex', gap: 12 }}>
          <Button
            size="small"
            onClick={() => setReplyOpen(!replyOpen)}
            sx={{ color: '#303033' }}
          >
            Reply
          </Button>
        </div>

        {comment.replies.length > 0 && (
          <Button
            size="small"
            onClick={() => setShowReplies((v) => !v)}
            style={{ color: '#303033' }}
          >
            {showReplies
              ? 'Hide replies'
              : `View ${comment.replies.length} replies`}
          </Button>
        )}
      </div>

      {replyOpen && (
        <div style={{ marginTop: '12px' }}>
          <div
            style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'space-between',
            }}
          >
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Write a reply…"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              sx={{ flex: 3 }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.preventDefault();
                  returnToIdle();
                }
              }}
            />
            <TextField
              fullWidth
              sx={{ flex: 1 }}
              placeholder="Enter your name (Optional)"
              value={Author}
              onChange={(e) => setAuthor(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.preventDefault();
                  returnToIdle();
                }
              }}
            />
          </div>
          <Button
            variant="contained"
            size="small"
            sx={{ mt: 1 }}
            onClick={submitReply}
          >
            Submit
          </Button>
        </div>
      )}

      {showReplies && (
        <div style={{ marginLeft: '24px', marginTop: '12px' }}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              parentId={comment.id}
              onLikeUpdate={onLikeUpdate}
              onReplyAdded={onReplyAdded}
              chapterNumber={chapterNumber}
              volumeNumber={volumeNumber}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
