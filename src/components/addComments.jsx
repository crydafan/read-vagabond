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
  const [Author, setAuthor] = useState('');

  const submitComment = async (comment, author) => {
    const normalizedAuthor =
      author === undefined || author === null ? '' : String(author);

    const res = await axios.post('/api/comments/add', {
      volume: volumeNumber,
      chapter: chapterNumber,
      author: normalizedAuthor,
      content: comment,
      parent_id: null,
    });

    onCommentAdded({
      id: res.data.id,
      author: res.data.author,
      content: res.data.content,
      created_at: new Date().toISOString(),
      likes: 0,
      likedByMe: 0,
      replies: [],
    });

    setComment('');
    setAddState('idle');
    setAuthor('');
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '20px',
              width: '100%',
            }}
          >
            <TextField
              id="outlined-multiline-static"
              label="Comment"
              placeholder="Enter your comment here"
              value={Comment}
              fullWidth
              rows={4}
              sx={{ flex: 3 }}
              onChange={(e) => setComment(e.target.value)}
              multiline
              error={Comment.length > 0 && Comment.length < 3}
              helperText={
                Comment.length > 0 && Comment.length < 3
                  ? 'Comment must be at least 3 characters'
                  : ''
              }
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.preventDefault();
                  returnToIdle();
                }
              }}
            />
            <TextField
              id="outlined-multiline-static"
              label="Author (Optional)"
              placeholder="Enter the name you want here"
              value={Author}
              sx={{ flex: 1 }}
              fullWidth
              onChange={(e) => setAuthor(e.target.value)}
              error={Author.length > 0 && Author.length < 3}
              helperText={
                Author.length > 0 && Author.length < 3
                  ? 'Author name must be at least 3 characters'
                  : ''
              }
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.preventDefault();
                  returnToIdle();
                }
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
            <Button
              variant="contained"
              accessKey="return"
              sx={{
                backgroundColor: '#3DB83D',
                color: 'white',
                border: '1px solid #0E8C0E',
                marginBottom: '20px',
              }}
              onClick={() => submitComment(Comment, Author)}
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
