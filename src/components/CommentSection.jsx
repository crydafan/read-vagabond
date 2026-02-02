import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { MdOutlineLoop } from 'react-icons/md';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from 'axios';
import AddComments from './addComments';
import Divider from '@mui/material/Divider';
import CommentItem from './CommentItem';

const CommentsSection = ({ mangaId, chapterNumber, volumeNumber }) => {
  const [loadingState, setLoadingState] = useState('idle');
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);

  const minimizeComments = () => {
    setLoadingState('idle');
  };

  const loadComments = async () => {
    setLoadingState('loading');
    setError(null);

    try {
      const response = await axios.get(
        `/api/mihon/mangas/${mangaId}/chapters/${chapterNumber}/comments`
      );

      const fetchedComments = response.data?.comments ?? [];
      setComments(fetchedComments);

      if (fetchedComments.length === 0) {
        setLoadingState('empty');
      } else {
        setLoadingState('loaded');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load comments');
      setLoadingState('error');
    }
  };

  const addReplyRecursive = (comments, parentId, newReply) => {
    return comments.map((comment) => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies ?? []), newReply],
        };
      }

      if (comment.replies?.length) {
        return {
          ...comment,
          replies: addReplyRecursive(comment.replies, parentId, newReply),
        };
      }

      return comment;
    });
  };

  const addReply = (parentId, newReply) => {
    setComments((prev) => addReplyRecursive(prev, parentId, newReply));
  };

  const updateLikesRecursive = (comments, commentId, likes, likedByMe) =>
    comments.map((c) => {
      if (c.id === commentId) return { ...c, likes, likedByMe };

      if (c.replies?.length) {
        return {
          ...c,
          replies: updateLikesRecursive(c.replies, commentId, likes, likedByMe),
        };
      }

      return c;
    });

  const updateLikes = (commentId, likes) => {
    setComments((prev) => updateLikesRecursive(prev, commentId, likes));
  };

  switch (loadingState) {
    case 'idle':
      return (
        <Button
          variant="outlined"
          color="#71717A"
          sx={{ marginTop: '20px', marginBottom: '20px  ' }}
          onClick={loadComments}
        >
          Click to load comments{' '}
        </Button>
      );
    case 'loading':
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            alignItems: 'center',
            marginTop: '20px',
            marginBottom: '20px',
          }}
        >
          <CircularProgress color="#71717A" />
          <p>Loading comments...</p>
        </div>
      );
    case 'empty':
      return (
        <Container
          style={{
            marginTop: '20px',
            color: 'red',
            padding: '15px',
            backgroundColor: '#A8C5FF',
            marginBottom: '20px',
            borderRadius: '1rem',
            borderWidth: '2px',
            borderColor: '#0A42C2',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            alignItems: 'center',
          }}
          maxWidth="md"
        >
          <div style={{ color: '#0A42C2', textAlign: 'center' }}>
            <h4>No comments added for this chapter yet</h4>
          </div>
          <Divider sx={{ my: 1 }} />
          <AddComments
            mangaId={mangaId}
            chapterNumber={chapterNumber}
            volumeNumber={volumeNumber}
            onCommentAdded={(newComment) => {
              setComments((prev) => [newComment, ...prev]);
              setLoadingState('loaded');
            }}
            variant="blue"
          />
        </Container>
      );
    case 'loaded':
      return (
        <Container
          style={{
            marginTop: '20px',
            p: '20px',
            backgroundColor: '#ADB0BA',
            borderRadius: '1rem',
            border: '2px solid #303033',
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '20px',
            gap: '20px',
          }}
          maxWidth="xl"
        >
          <div>
            <div
              style={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="h5" sx={{ margin: '10px' }}>
                Comments ({comments.length})
              </Typography>
              <Button
                sx={{
                  fontSize: '28px',
                  minWidth: '40px',
                  height: '40px',
                  color: '#303033',
                  borderColor: 'black',
                }}
                variant="outlined"
                onClick={minimizeComments}
              >
                -
              </Button>
            </div>
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReplyAdded={addReply}
                onLikeUpdate={updateLikes}
                parentId={0}
                chapterNumber={chapterNumber}
                volumeNumber={volumeNumber}
              />
            ))}
            <AddComments
              mangaId={mangaId}
              chapterNumber={chapterNumber}
              volumeNumber={volumeNumber}
              onCommentAdded={(newComment) => {
                setComments((prev) => [newComment, ...prev]);
                setLoadingState('loaded');
              }}
              variant="grey"
            />
          </div>
        </Container>
      );
    case 'error':
      return (
        <Container
          style={{
            marginTop: '20px',
            color: 'red',
            padding: '15px',
            backgroundColor: '#FFB4A8',
            marginBottom: '20px',
            borderRadius: '1rem',
            borderWidth: '2px',
            borderColor: 'red',
          }}
          maxWidth="md"
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              gap: '10px',
              alignItems: 'center',
            }}
          >
            <p>{error}</p>
            <Button
              onClick={loadComments}
              variant="outlined"
              startIcon={<MdOutlineLoop />}
            >
              Retry
            </Button>
          </div>
        </Container>
      );

    default:
      return null;
  }
};

export default CommentsSection;
