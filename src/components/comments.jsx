import React, { useState } from 'react';
import Button from '@mui/material/Button';
import '@material/web/buttons/elevated';
import axios from 'axios';

const Comments = ({ mangaId, chapterNumber }) => {
  const [Loading, setLoading] = useState('idle');

  const [Comments, setComments] = useState([]);

  const loadComments = async () => {
    setLoading('loading');

    //Add API Fetch logic
    const comments = await axios.get('https://httpbin.org/delay/5');

    if (comments == []) {
      setLoading('empty');
    } else {
      setLoading('loaded');
    }
    return comments;
  };

  switch (Loading) {
    case 'idle':
      return <Button onClick={loadComments}>Click to load comments</Button>;
    case 'loading':
      return <h2>Loading comments....</h2>;
    case 'empty':
      return <p>No comments added for this chapter yet T_T </p>;
    case 'loaded':
      return (
        <div>
          <div>Comment sections goes here</div>
        </div>
      );

    default:
      break;
  }
};

export default Comments;
