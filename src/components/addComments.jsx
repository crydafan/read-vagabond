import React, { useState } from 'react';
import Button from '@mui/material/Button';

const AddComments = () => {
  const [AddState, setAddState] = useState('idle');

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
              backgroundColor: '#ADB0BA',
              color: '#303033',
              border: '1px solid black',
              marginBottom: '20px',
            }}
          >
            Add Comment +
          </Button>
        </div>
      );

    case 'writing':
      return (
        <div>
          <div>Hello</div>
        </div>
      );

    default:
      return null;
  }
};

export default AddComments;
