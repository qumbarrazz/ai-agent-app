import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import AssignAdmin from './AssignAdmin';

function AdminPanel() {
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState('gpt');
  const [data, setData] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists() || userSnap.data().role !== 'admin') {
        navigate('/');
      } else {
        setLoading(false);
        // Load config
        const configRef = doc(db, 'config', 'ai');
        const configSnap = await getDoc(configRef);
        if (configSnap.exists()) {
          const config = configSnap.data();
          setApiKey(config.apiKey || '');
          setProvider(config.provider || 'gpt');
          setData(config.data || '');
        }
      }
    };
    checkAdmin();
  }, [navigate]);

  const handleSave = async () => {
    try {
      await setDoc(doc(db, 'config', 'ai'), { apiKey, provider, data });
      setError('');
      alert('Configuration saved!');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return null;

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Admin Panel</Typography>
      <TextField label="API Key" fullWidth margin="normal" value={apiKey} onChange={e => setApiKey(e.target.value)} />
      <TextField label="Provider (gpt/gemini)" fullWidth margin="normal" value={provider} onChange={e => setProvider(e.target.value)} />
      <TextField label="Data (text, CSV, JSON, etc.)" fullWidth margin="normal" multiline rows={4} value={data} onChange={e => setData(e.target.value)} />
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" color="primary" onClick={handleSave} style={{marginBottom: 24}}>Save Configuration</Button>
      <AssignAdmin />
    </Container>
  );
}

export default AdminPanel;
