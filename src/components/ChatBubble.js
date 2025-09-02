import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import ReactMarkdown from 'react-markdown';

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
          <ReactMarkdown
            children={text}
            components={{
              h1: ({ node, ...props }) => <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }} {...props} />,
              h2: ({ node, ...props }) => <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }} {...props} />,
              p: ({ node, ...props }) => <Typography variant="body1" sx={{ mb: 1 }} {...props} />,
              ul: ({ node, ...props }) => <Box component="ul" sx={{ pl: 3, mb: 1 }} {...props} />,
              li: ({ node, ...props }) => <Typography component="li" variant="body2" sx={{ mb: 0.5 }} {...props} />,
              strong: ({ node, ...props }) => <Box component="span" sx={{ fontWeight: 700 }} {...props} />,
              em: ({ node, ...props }) => <Box component="span" sx={{ fontStyle: 'italic' }} {...props} />,
              code: ({ node, ...props }) => <Box component="code" sx={{ bgcolor: '#eee', px: 0.5, borderRadius: 1, fontSize: '0.95em' }} {...props} />,
            }}
          />
        )}
        <Typography variant="caption" sx={{ display: 'block', mt: 1, textAlign: 'right', opacity: 0.7 }}>
          {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Typography>
      </Paper>
    </Box>
  );
}

export default ChatBubble;
