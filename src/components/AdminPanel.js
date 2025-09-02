import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, Box, Card, CardContent, TextField, Button, Divider, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';

const drawerWidth = 240;

function AdminPanel() {
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState('gpt');
  const [data, setData] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState('config');
  // User creation states
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('user');
  const [userCreateError, setUserCreateError] = useState('');
  const [userCreateSuccess, setUserCreateSuccess] = useState('');
  // User listing states
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribe;
    setLoading(true);
    unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }
      const userRef = doc(db, 'users', user.uid);
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
        // Load users
        fetchUsers();
      }
    });
    return () => unsubscribe && unsubscribe();
  }, [navigate]);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const usersCol = collection(db, 'users');
      const usersSnap = await getDocs(usersCol);
      const userList = [];
      usersSnap.forEach(doc => {
        userList.push({ uid: doc.id, ...doc.data() });
      });
      setUsers(userList);
    } catch (err) {
      // Optionally handle error
    }
    setUsersLoading(false);
  };

  const handleSave = async () => {
    try {
      await setDoc(doc(db, 'config', 'ai'), { apiKey, provider, data });
      setError('');
      alert('Configuration saved!');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateUser = async () => {
    setUserCreateError('');
    setUserCreateSuccess('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, newEmail, newPassword);
      const uid = userCredential.user.uid;
      // Store email along with role
      await setDoc(doc(db, 'users', uid), { role: newRole, email: newEmail }, { merge: true });
      setUserCreateSuccess(`User created and assigned role: ${newRole}`);
      setNewEmail('');
      setNewPassword('');
      setNewRole('user');
      fetchUsers();
    } catch (err) {
      setUserCreateError(err.message);
    }
  };

  if (loading) return null;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', bgcolor: '#212121', color: '#fff' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            <ListItem button selected={selectedMenu === 'config'} onClick={() => setSelectedMenu('config')}>
              <ListItemText primary="Agent Configuration" />
            </ListItem>
            <ListItem button selected={selectedMenu === 'users'} onClick={() => setSelectedMenu('users')}>
              <ListItemText primary="User Management" />
            </ListItem>
            <Divider sx={{ my: 2, bgcolor: '#424242' }} />
            <ListItem button onClick={() => navigate('/')}> <ListItemText primary="Back to Home" /> </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <AppBar position="static" color="primary" sx={{ borderRadius: 2, mb: 3 }}>
          <Toolbar>
            <Typography variant="h5" sx={{ flex: 1 }}>Admin Dashboard</Typography>
          </Toolbar>
        </AppBar>
        {selectedMenu === 'config' && (
          <Card sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>Agent Configuration</Typography>
              <TextField label="API Key" fullWidth margin="normal" value={apiKey} onChange={e => setApiKey(e.target.value)} />
              <TextField label="Provider (gpt/gemini)" fullWidth margin="normal" value={provider} onChange={e => setProvider(e.target.value)} />
              <TextField label="Data (text, CSV, JSON, etc.)" fullWidth margin="normal" multiline rows={4} value={data} onChange={e => setData(e.target.value)} />
              {error && <Typography color="error">{error}</Typography>}
              <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>Save Configuration</Button>
            </CardContent>
          </Card>
        )}
        {selectedMenu === 'users' && (
          <Card sx={{ maxWidth: 400, mx: 'auto', mb: 4 }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>User Management</Typography>
              <TextField label="Email" fullWidth margin="normal" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
              <TextField label="Password" fullWidth margin="normal" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              <Select value={newRole} onChange={e => setNewRole(e.target.value)} fullWidth sx={{ mb: 2 }}>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
              <Button variant="contained" color="primary" onClick={handleCreateUser} sx={{ mb: 2 }}>Create User & Assign Role</Button>
              {userCreateError && <Typography color="error">{userCreateError}</Typography>}
              {userCreateSuccess && <Typography color="primary">{userCreateSuccess}</Typography>}
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" sx={{ mb: 1 }}>User List</Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>UID</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {usersLoading ? (
                      <TableRow><TableCell colSpan={3}>Loading...</TableCell></TableRow>
                    ) : users.length === 0 ? (
                      <TableRow><TableCell colSpan={3}>No users found.</TableCell></TableRow>
                    ) : (
                      users.map(user => (
                        <TableRow key={user.uid}>
                          <TableCell>{user.uid}</TableCell>
                          <TableCell>{user.email || '-'}</TableCell>
                          <TableCell>{user.role || '-'}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
}

export default AdminPanel;
