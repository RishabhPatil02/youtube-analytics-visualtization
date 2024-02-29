import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar,  Toolbar, Typography, Box, IconButton, Menu, Container, Avatar, Button, Tooltip, MenuItem} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Nav() {

  const navigate = useNavigate();

  return (
    <AppBar position="static">
    <Container maxWidth="xl">
      <Toolbar disableGutters>
      <img src='/logo.png' alt="YouTube Logo" style={{ height: 30, marginRight: 5,borderRadius: '50%'}} />
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="#app-bar-with-responsive-menu"
          sx={{
            mr: 6,
            display: { xs: 'none', md: 'flex' },
            fontWeight: 700,
            letterSpacing: '.2rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          Visualizer
        </Typography>
        
        
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
        <Button sx={{ my: 2, color: 'white', display: 'block', textTransform: 'capitalize', lineHeight: 1.2, mx:1, width: '100px', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)',cursor: 'pointer'}, }} onClick={()=>{navigate('/page1');}}>
          Barcharts &<br/>Histograms
        </Button>

          <Button sx={{ my: 2, color: 'white', display: 'block', textTransform: 'capitalize', lineHeight: 1.2, mx:1, width: '100px' , '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)',cursor: 'pointer'},}} onClick={()=>{navigate('/page2');}}>
            Scatter<br/>plots
          </Button>
        </Box>

        <Box sx={{ flexGrow: 0 }}>
          <IconButton sx={{ p: 0 }}>
            <Avatar src="/profile.png" sx={{ width: 48, height: 48 }} />
          </IconButton>
        </Box>
      </Toolbar>
    </Container>
  </AppBar>
  )
}

export default Nav