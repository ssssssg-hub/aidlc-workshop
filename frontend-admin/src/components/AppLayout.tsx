import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  AppBar, Toolbar, Typography, Button,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import TableBarIcon from '@mui/icons-material/TableBar';
import { useAuth } from '../hooks/useAuth';

const DRAWER_WIDTH = 220;

const navItems = [
  { label: '대시보드', path: '/dashboard', icon: <DashboardIcon /> },
  { label: '메뉴 관리', path: '/menus', icon: <RestaurantMenuIcon /> },
  { label: '테이블 설정', path: '/tables/setup', icon: <TableBarIcon /> },
];

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>테이블오더 관리자</Typography>
          <Button color="inherit" onClick={() => { logout(); navigate('/login'); }} data-testid="logout-button">
            로그아웃
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" sx={{ width: DRAWER_WIDTH, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}>
        <Toolbar />
        <List>
          {navItems.map((item) => (
            <ListItemButton
              key={item.path}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              data-testid={`nav-${item.path.replace(/\//g, '-').slice(1)}`}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
