import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Paper, CircularProgress, Drawer, IconButton, List, ListItem, ListItemText, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import ChatBubble from './ChatBubble';
import { useNavigate } from 'react-router-dom';

function AgentChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState(null);
  const [history, setHistory] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConfig = async () => {
      const configRef = doc(db, 'config', 'ai');
      const configSnap = await getDoc(configRef);
      if (configSnap.exists()) {
        setConfig(configSnap.data());
      }
    };
    const fetchHistory = async () => {
      if (!auth.currentUser) return;
      const logsRef = collection(db, 'users', auth.currentUser.uid, 'chatLogs');
      const q = query(logsRef, orderBy('createdAt', 'desc'), limit(20));
      const logsSnap = await getDocs(q);
      const historyMsgs = [];
      logsSnap.forEach(doc => {
        historyMsgs.push(doc.data());
      });
      setHistory(historyMsgs.reverse());
    };
    fetchConfig();
    fetchHistory();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !auth.currentUser) return;
    setLoading(true);
    const userMsg = { sender: 'user', text: input, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    await addDoc(collection(db, 'users', auth.currentUser.uid, 'chatLogs'), { ...userMsg, createdAt: serverTimestamp() });

    let agentText = 'This is a placeholder response.';
    if (config && config.provider === 'gemini' && config.apiKey) {
      try {
        // Gemini API call
        const geminiRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + config.apiKey, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: config.data ? config.data + '\n' + input : input }
              ]
            }]
          })
        });
        const geminiJson = await geminiRes.json();
        agentText = geminiJson.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';
      } catch (err) {
        agentText = 'Error: ' + err.message;
      }
    }
    const agentMsg = { sender: 'agent', text: agentText, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, agentMsg]);
    await addDoc(collection(db, 'users', auth.currentUser.uid, 'chatLogs'), { ...agentMsg, createdAt: serverTimestamp() });
    setLoading(false);
    setInput('');
  };

  return (
    <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'row', height: '100vh', alignItems: 'stretch' }}>
      {/* Sidebar for chat history */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Paper sx={{ width: 300, height: '100%', p: 2 }}>
          <Typography variant="h6" color="primary" gutterBottom>Chat History</Typography>
          <List>
            {history.length === 0 ? (
              <ListItem><ListItemText primary="No previous chats yet." /></ListItem>
            ) : (
              history.map((msg, idx) => (
                <ListItem key={idx}>
                  <ListItemText primary={msg.text} secondary={new Date(msg.timestamp).toLocaleString()} />
                </ListItem>
              ))
            )}
          </List>
        </Paper>
      </Drawer>
      {/* Main chat panel */}
      <Paper elevation={3} sx={{ flex: 1, m: 2, p: 2, display: 'flex', flexDirection: 'column', height: '80vh', borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton color="primary" onClick={() => navigate('/')}><HomeIcon /></IconButton>
          <Typography variant="h5" sx={{ flex: 1 }}>AI Agent Chat</Typography>
          <Button variant="outlined" color="primary" onClick={() => setDrawerOpen(true)}>
            View History
          </Button>
        </Box>
        <Box sx={{ flex: 1, overflowY: 'auto', mb: 2, bgcolor: '#f5f5f5', borderRadius: 2, p: 2 }}>
          {messages.length === 0 && (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 8 }}>
              Start the conversation!
            </Typography>
          )}
          {messages.map((msg, idx) => (
            <ChatBubble key={idx} sender={msg.sender} text={msg.text} timestamp={msg.timestamp} />
          ))}
          {loading && <CircularProgress size={24} sx={{ display: 'block', mx: 'auto', my: 2 }} />}
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Type your message"
            fullWidth
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
            onKeyDown={e => { if (e.key === 'Enter' && !loading) handleSend(); }}
          />
          <Button variant="contained" color="primary" onClick={handleSend} disabled={loading || !input.trim()}>
            Send
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default AgentChat;
