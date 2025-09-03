import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function formatAgentText(text) {
  // Simple formatting: headings, lists
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    if (/^# /.test(line)) {
      return <Typography key={idx} variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{line.replace(/^# /, '')}</Typography>;
    }
    if (/^## /.test(line)) {
      return <Typography key={idx} variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>{line.replace(/^## /, '')}</Typography>;
    }
    if (/^- /.test(line)) {
      return <Typography key={idx} component="li" variant="body2" sx={{ mb: 0.5 }}>{line.replace(/^- /, '')}</Typography>;
    }
    return <Typography key={idx} variant="body1" sx={{ mb: 1 }}>{line}</Typography>;
  });
}

function ChatBubble({ sender, text, timestamp }) {
  const isUser = sender === 'user';
  return (
    <Box sx={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', mb: 2 }}>
      <Paper
        elevation={2}
        sx={{
          maxWidth: '70%',
          p: 2,
          bgcolor: isUser ? '#1976d2' : '#fff',
          color: isUser ? '#fff' : '#333',
          borderRadius: 3,
          borderTopLeftRadius: isUser ? 16 : 3,
          borderTopRightRadius: isUser ? 3 : 16,
          boxShadow: isUser ? 3 : 1,
        }}
      >
        {isUser ? (
          <Typography variant="body1" sx={{ wordBreak: 'break-word', fontSize: '1rem' }}>
            {text}
          </Typography>
        ) : (
          <Box component="div">{formatAgentText(text)}</Box>
        )}
        <Typography variant="caption" sx={{ display: 'block', mt: 1, textAlign: 'right', opacity: 0.7 }}>
          {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Typography>
      </Paper>
    </Box>
  );
}

export default ChatBubble;
