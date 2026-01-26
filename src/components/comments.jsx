import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { MdOutlineLoop } from 'react-icons/md';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from 'axios';
import AddComments from './addComments';

const Comments = ({ mangaId, chapterNumber, volumeNumber }) => {
  const [loadingState, setLoadingState] = useState('idle');
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);

  const submitComment = async (content) => {
    await axios.post('/api/comments/add', {
      volume: volumeNumber,
      chapter: chapterNumber,
      author: 'Anonymous', // or user name later
      content,
    });

    // Reload comments after posting
    loadComments();
  };

  const loadComments = async () => {
    setLoadingState('loading');
    setError(null);

    try {
      const response = await axios.get(
        `/api/mihon/mangas/${mangaId}/chapters/${chapterNumber}/comments`
        // REMOVEME
        //'https://www.httpbin.org/status/500'
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
          }}
          maxWidth="md"
        >
          <div style={{ color: '#0A42C2', textAlign: 'center' }}>
            <h4>No comments added for this chapter yet</h4>
          </div>
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
            <Typography variant="h5" sx={{ margin: '10px' }}>
              Comments ({comments.length})
            </Typography>
            <ul
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                margin: '10px',
                padding: 0,
                listStyle: 'none',
              }}
            >
              {comments.map((comment) => (
                <li
                  key={comment.id}
                  style={{
                    padding: '12px',
                    border: '1px solid #E4E4E7',
                    borderRadius: '8px',
                    background: '#FAFAFA',
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{comment.author}</div>
                  <div style={{ fontSize: '14px', marginTop: '4px' }}>
                    {comment.content}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#71717A',
                      marginTop: '6px',
                    }}
                  >
                    {new Date(comment.created_at).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
            <AddComments />
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

export default Comments;
