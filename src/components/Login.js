import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Box, Tabs, Tab, Divider } from '@mui/material';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Login() {
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setEmail('');
    setPassword('');
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card sx={{ minWidth: 350, maxWidth: 400, boxShadow: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, pb: 0 }}>
          <Button onClick={() => navigate('/')} startIcon={<ArrowBackIcon />} sx={{ mr: 1 }}>
            Back
          </Button>
          <Box sx={{ flex: 1 }} />
        </Box>
        <Tabs value={tab} onChange={handleTabChange} variant="fullWidth" sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Login" />
          <Tab label="Sign Up" />
        </Tabs>
        <CardContent>
          <Typography variant="h5" align="center" color="primary" sx={{ mb: 2 }}>
            Welcome to AI Agent
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              fullWidth
              autoComplete="email"
              disabled={loading}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              autoComplete="current-password"
              disabled={loading}
            />
            {tab === 0 ? (
              <Button variant="contained" color="primary" fullWidth onClick={handleLogin} disabled={loading || !email || !password}>
                Login
              </Button>
            ) : (
              <Button variant="contained" color="primary" fullWidth onClick={handleSignup} disabled={loading || !email || !password}>
                Sign Up
              </Button>
            )}
            <Divider sx={{ my: 2 }}>OR</Divider>
            {tab === 0 ? (
              <Button variant="outlined" color="primary" fullWidth onClick={handleGoogleSignIn} disabled={loading}>
                Sign In with Google
              </Button>
            ) : (
              <Button variant="outlined" color="primary" fullWidth onClick={handleGoogleSignUp} disabled={loading}>
                Sign Up with Google
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;
