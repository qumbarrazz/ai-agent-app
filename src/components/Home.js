import React from 'react';
import { Container, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

function Home() {
  const navigate = useNavigate();
  const handleChat = () => {
    if (auth.currentUser) {
      navigate('/chat');
    } else {
      navigate('/login');
    }
  };
  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: 80 }}>
      <Typography variant="h2" gutterBottom color="primary">AI Agent Platform</Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Build, configure, and chat with your own AI agents powered by Gemini and GPT. Upload custom data, manage API keys, and view chat history.
      </Typography>
      <Stack spacing={2} direction="row" justifyContent="center" sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, mb: 2 }}
          onClick={() => navigate('/login')}
        >
          Login / Signup
        </Button>
        <Button variant="contained" color="secondary" size="large" onClick={handleChat}>Chat with Agent</Button>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 6 }}>
        <b>Features:</b><br />
        - Multi-provider AI (Gemini, GPT)<br />
        - Custom data upload<br />
        - Admin panel for configuration<br />
        - Chat history and analytics<br />
        - Modern Material UI design
      </Typography>
    </Container>
  );
}

export default Home;
