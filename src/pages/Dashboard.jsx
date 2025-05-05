import React, { useState } from 'react';

import {
  Dashboard as DashboardIcon,
  Report as ReportIcon,
  People as PeopleIcon,
  Notifications as NotificationsIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
  AdminPanelSettings as AdminPanelIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Refresh as RefreshIcon,
  PostAdd as PostAddIcon,
  Group as GroupIcon,
  Event as EventIcon,
  PersonAdd as PersonAddIcon,
  Add as AddIcon
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  CssBaseline,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  createTheme,
  ThemeProvider,
  styled
} from '@mui/material';
import TeacherSignupPage from './TeacherSignupPage';
import PendingEnrollmentsPage from './PendingEnrollmentsPage';

// Theme toggler
const lightTheme = createTheme({ palette: { mode: 'light' } });
const darkTheme = createTheme({ palette: { mode: 'dark' } });

const drawerWidth = 260;

// Styled components
const Sidebar = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    borderRight: `1px solid ${theme.palette.divider}`
  }
}));

const NavItem = styled(ListItemButton)(({ theme, selected }) => ({
  margin: '4px 8px',
  borderRadius: 4,
  backgroundColor: selected ? theme.palette.action.selected : 'transparent'
}));

const MainContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  marginLeft: drawerWidth,
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default
}));

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
    <CardContent sx={{ textAlign: 'center', py: 4 }}>
      <Icon sx={{ fontSize: 48, color }} />
      <Typography variant="h5" mt={1} fontWeight={600}>
        {value}
      </Typography>
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [themeMode, setThemeMode] = useState('dark');
  const theme = themeMode === 'light' ? lightTheme : darkTheme;

  const screens = [
    <DashboardHome key="home" />,
    <div key="reports">Reports</div>,
    <div key="users">Users</div>,
    <div key="notifs">Notifications</div>,
    <div key="logs">Mod Logs</div>,
    <TeacherSignupPage key="teacher" />,
    <PendingEnrollmentsPage key="pending-enrollments" />

  ];

  const titles = ['Dashboard', 'Reports', 'Users', 'Notifications', 'Mod Logs', 'Register Teacher', 'Pending Enrollments'];
  const navItems = [
    { icon: <DashboardIcon />, label: 'Dashboard' },
    { icon: <ReportIcon />, label: 'Reports' },
    { icon: <PeopleIcon />, label: 'Users' },
    { icon: <NotificationsIcon />, label: 'Notifications' },
    { icon: <HistoryIcon />, label: 'Mod Logs' },
    { icon: <PersonIcon />, label: 'Register Teacher' },
    {icon:<PersonAddIcon />, label: 'Pending Enrollments'}
  ];

  const handleProfileMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);
  const toggleTheme = () => setThemeMode(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Sidebar variant="permanent" anchor="left">
          <Toolbar sx={{ justifyContent: 'center', py: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64 }}>
              <AdminPanelIcon fontSize="large" />
            </Avatar>
          </Toolbar>
          <Divider />
          <List>
            {navItems.map((item, idx) => (
              <NavItem
                key={item.label}
                selected={selectedIndex === idx}
                onClick={() => setSelectedIndex(idx)}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </NavItem>
            ))}
          </List>
          <Box sx={{ flexGrow: 1 }} />
          <Divider />
          <List>
            <NavItem onClick={toggleTheme}>
              <ListItemIcon>{themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}</ListItemIcon>
              <ListItemText primary={themeMode === 'light' ? 'Dark Mode' : 'Light Mode'} />
            </NavItem>
            <NavItem onClick={() => {/* logout logic */}}>
              <ListItemIcon><ExitToAppIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </NavItem>
          </List>
        </Sidebar>

        <MainContainer>
          <AppBar position="fixed" color="inherit" elevation={1} sx={{ ml: drawerWidth, width: `calc(100% - ${drawerWidth}px)` }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
              <Typography variant="h6" noWrap>{titles[selectedIndex]}</Typography>
              <Box>
                <IconButton onClick={toggleTheme} sx={{ mr: 1 }}>
                  {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton>
                <IconButton color="inherit" onClick={handleProfileMenuOpen}>  
                  <Avatar><PersonAddIcon /></Avatar>
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileMenuClose}>
                  <MenuItem onClick={handleProfileMenuClose}>Settings</MenuItem>
                  <MenuItem onClick={() => {/* logout */}}>Logout</MenuItem>
                </Menu>
              </Box>
            </Toolbar>
          </AppBar>

          <Box component="main" sx={{ mt: 8, flexGrow: 1, p: 3 }}>
            {screens[selectedIndex]}
          </Box>
        </MainContainer>
      </Box>
    </ThemeProvider>
  );
};

const DashboardHome = () => {
  const stats = { totalUsers: 1243, activeUsers: 892, newUsers: 42, pendingReports: 17, totalPosts: 5432, totalGroups: 156, totalEvents: 89 };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Overview</Typography>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Users" value={stats.totalUsers} icon={PeopleIcon} color="#1976d2" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active Users" value={stats.activeUsers} icon={PersonIcon} color="#4caf50" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="New Users" value={stats.newUsers} icon={PersonAddIcon} color="#ff9800" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Pending Reports" value={stats.pendingReports} icon={ReportIcon} color="#f44336" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Posts" value={stats.totalPosts} icon={PostAddIcon} color="#9c27b0" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Groups" value={stats.totalGroups} icon={GroupIcon} color="#009688" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Events" value={stats.totalEvents} icon={EventIcon} color="#3f51b5" />
        </Grid>
      </Grid>
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Quick Actions</Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            <Chip icon={<AddIcon />} label="New User" clickable />
            <Chip icon={<NotificationsIcon />} label="Send Alert" clickable />
            <Chip icon={<SettingsIcon />} label="Settings" clickable />
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Dashboard;
