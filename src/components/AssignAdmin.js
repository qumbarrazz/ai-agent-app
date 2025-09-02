import React, { useState } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

function AssignAdmin() {
  const [uid, setUid] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAssign = async () => {
    try {
      await setDoc(doc(db, 'users', uid), { role: 'admin' }, { merge: true });
      setSuccess('Admin role assigned!');
      setError('');
    } catch (err) {
      setError(err.message);
      setSuccess('');
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h5" gutterBottom>Assign Admin Role</Typography>
      <TextField label="User UID" fullWidth margin="normal" value={uid} onChange={e => setUid(e.target.value)} />
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="primary">{success}</Typography>}
      <Button variant="contained" color="primary" onClick={handleAssign}>Assign Admin</Button>
    </Container>
  );
}

export default AssignAdmin;
