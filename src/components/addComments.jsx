import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import axios from 'axios';

const AddComments = ({
  variant,
  chapterNumber,
  volumeNumber,
  onCommentAdded,
}) => {
  const [AddState, setAddState] = useState('idle');
  const [Comment, setComment] = useState('');

  const submitComment = async (content) => {
    const res = await axios.post('/api/comments/add', {
      volume: volumeNumber,
      chapter: chapterNumber,
      author: 'Anonymous',
      content,
    });

    onCommentAdded({
      id: res.data.id ?? Date.now(), // fallback
      author: 'Anonymous',
      content,
      created_at: new Date().toISOString(),
    });

    setComment('');
    setAddState('idle');
  };
  const addCommentButton = () => {
    setAddState('writing');
  };

  const returnToIdle = () => {
    setAddState('idle');
  };

  switch (AddState) {
    case 'idle':
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '16px',
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: variant == 'grey' ? '#ADB0BA' : '#A8C5FF',
              color: variant == 'grey' ? '#303033' : '#0A42C2',
              border:
                variant == 'grey' ? '1px solid black' : '1px solid #0A42C2',
              marginBottom: '20px',
            }}
            onClick={addCommentButton}
          >
            Add Comment +
          </Button>
        </div>
      );

    case 'writing':
      return (
        <Container
          style={{
            padding: '12px',
            border: '1px solid #E4E4E7',
            borderRadius: '8px',
            background: '#FAFAFA',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            marginBottom: '20px',
            alignItems: 'center',
          }}
          maxWidth="lg"
        >
          <TextField
            id="outlined-multiline-static"
            label="Comment"
            placeholder="Enter your comment here"
            value={Comment}
            fullWidth
            rows={4}
            onChange={(e) => setComment(e.target.value)}
            multiline
            error={Comment.length > 0 && Comment.length < 3}
            helperText={
              Comment.length > 0 && Comment.length < 3
                ? 'Comment must be at least 3 characters'
                : ''
            }
          />
          <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#3DB83D',
                color: 'white',
                border: '1px solid #0E8C0E',
                marginBottom: '20px',
              }}
              onClick={() => submitComment(Comment)}
            >
              Submit
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: 'black',
                color: 'white',
                border: '1px solid black',
                marginBottom: '20px',
              }}
              onClick={returnToIdle}
            >
              Return
            </Button>
          </div>
        </Container>
      );

    default:
      return null;
  }
};

export default AddComments;
