import { useState, MouseEvent, useCallback } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Image from 'next/image';
import Router from 'next/router'

//ハンバーガーメニューの中の選択できる文字
const settings = ['メイン', '管理者', '集計'];

function ResponsiveAppBar() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  //ハンバーガーメニューを開いた時の挙動
  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  //ハンバーガーメニューを閉じた時の挙動
  const handleCloseMenu = () => {
    setAnchorElUser(null);
  };

  //ページ切り替えを行う
  const pageRouter = useCallback((setting: string) => {
    if (setting == 'メイン'){
      Router.push('/');
    }else if (setting == '管理者'){
      Router.push('/admin');
    }else if ( setting == '集計'){
      Router.push('/total');
    }
  }, [])

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
      <Toolbar>
            <Tooltip title="ページ一覧">
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleOpenMenu} 
                >
                <MenuIcon />
            </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseMenu}
            >
            <Typography
                variant="h6"
                noWrap
                component="a"
                sx={{
                ml: 2,
                mr: 2,
                fontFamily: 'monospace',
                fontWeight: 600,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                }}
            >
            ページ一覧
          </Typography>
              {settings.map((setting) => (
                <div key={setting} onClick={() => {pageRouter(setting)}}>
                  <MenuItem  onClick={handleCloseMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                </div>
              ))}
            </Menu>
          <Image 
                src="/modeken-top.png"
                width={65}
                height={25}
                alt="Logo"
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 1,
              ml: 1,
              fontFamily: 'monospace',
              fontWeight: 600,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Web発券システム
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;