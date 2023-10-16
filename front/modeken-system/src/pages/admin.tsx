import style from '../styles/Home.module.css';
import Head from 'next/head';
import MyHeader from '../components/MyHeader';
import MyTable from '../components/MyTable';
import CreateModal from '../components/CreateModal'
import DeleteModal from '../components/DeleteModal'
import CallModal from '../components/CallModal'
import PrepareModal from '../components/PrepareModal'
import CompleteModal from '../components/CompleteModal'
import { useState, SyntheticEvent } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete'
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import PhoneIcon from '@mui/icons-material/Phone';
import UndoIcon from '@mui/icons-material/Undo';
import CheckIcon from '@mui/icons-material/Check';

//colorのテーマ決め
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF5733',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ce93d8',
      contrastText: '#fff',
    },
    success: {
      main: '#38AE3C',
      contrastText: '#fff',
    },
    info: {
      main: '#29A2F6',
      contrastText: '#fff',
    },
  },
});
//Tab切り替え用
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
      <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      >
      {value === index && (
          <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
          </Box>
      )}
      </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
export default function Home() {
  //Tab切り替え用
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  //Modal用(発券)
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const handleOpenCreate = () => setOpenCreate(true);
  const handleCloseCreate = () => {
    setOpenCreate(false);
  }

  //Modal用(削除)
  const [openDelete, setOpenDelete] = useState(false);

  const handleOpenDelete = () => setOpenDelete(true);

  const handleCloseDelete = () => {
    setOpenDelete(false);
  }

  //Modal用(呼び出し)
  const [openCall, setOpenCall] = useState(false);

  const handleOpenCall = () => setOpenCall(true);
  
  const handleCloseCall = () => {
    setOpenCall(false);
  }

  //Modal用(準備中)
  const [openPrepare, setOpenPrepare] = useState(false);

  const handleOpenPrepare = () => setOpenPrepare(true);

  const handleClosePrepare = () => {
    setOpenPrepare(false);
  }

  //Modal用(完了)
  const [openComplete, setOpenComplete] = useState(false);

  const handleOpenComplete = () => setOpenComplete(true);

  const handleCloseComplete = () => {
    setOpenComplete(false);
  }

  return (
    <>
      <Head>
        <title>Web発券システム(管理者)</title>
        <meta name="description" content="モデリング研究同好会の出店における発券システムをWebで行います。" />
        <link rel="icon" href="modeken-top.png" />
      </Head>

      {/* ヘッダの呼び出し */}
      <MyHeader />

      {/* タブ */}
      <Box sx={{ ml: 'auto', mr: 'auto', width: '100%'}}>
        {/* タブの要素とその下の線 */}
        <Box sx={{ borderBottom: 2.5, borderColor: 'divider' }}>
          <Tabs sx={{width: '100%'}} value={value} onChange={handleChange} aria-label="発券状況切り替え">
            <Tab sx={{ ml: 'auto', mr: 'auto', width: '50%'}} label="3Dプリンター" {...a11yProps(0)} />
            <Tab sx={{ ml: 'auto', mr: 'auto',width: '50%'}} label="レーザーカッター" {...a11yProps(1)} />
          </Tabs>
        </Box>
        {/* タブの中身
          ・ CustomTabPanel(index)
            0 => 3Dプリンター
            1 => レーザーカッター
        */}
        <Container maxWidth="lg" sx={{ mt: 1, mb: 0, }}>
          {/* 発券ボタン */}
          <div>
            <Button 
              variant="contained" 
              endIcon={<PostAddOutlinedIcon />} 
              onClick={handleOpenCreate}
              size='large'
              sx={{width:'100%', mt: 1, mb: 2}}
            >
              発券
            </Button>
          </div>
          <Grid container direction="row" spacing={6}>
            {/* 呼び出しの領域 */}
            <Grid item xs={12} sm={6}>
              <Grid container direction="column" spacing={0}>
                <Grid item>
                  <Paper elevation={6} sx={{p: '5px', borderRadius: '15px'}}>
                    <p className={style.title}>呼び出し中</p>
                    <CustomTabPanel value={value} index={0}>
                      <MyTable />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                      <MyTable />
                    </CustomTabPanel>
                  </Paper>
                </Grid>
                <Grid item>
                  {/* 発券と削除のボタングループ */}
                  <div className={style.ticket_button}>
                    <ThemeProvider theme={theme}>
                      <div>
                        <Button 
                          variant="contained" 
                          color='info' 
                          endIcon={<UndoIcon />} 
                          onClick={handleOpenPrepare}
                          size='large'
                        >
                          準備中
                        </Button>
                      </div>
                      <div>
                        <Button 
                          variant="contained" 
                          color='success' 
                          endIcon={<CheckIcon />} 
                          onClick={handleOpenComplete}
                          size='large'
                        >
                          完了
                        </Button>
                      </div>
                    </ThemeProvider>
                  </div>
                </Grid>
              </Grid>
            </Grid>
            {/* 準備中の領域 */}
            <Grid item xs={12} sm={6}>
              <Grid container direction="column" spacing={0}>
                <Grid item>
                  <Paper elevation={6} sx={{p: '5px', borderRadius: '15px'}}>
                    <p className={style.title}>準備中</p>
                    <CustomTabPanel value={value} index={0}>
                      <MyTable />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                      <MyTable />
                    </CustomTabPanel>
                  </Paper>
                </Grid>
                <Grid item>
                  {/* 発券と削除のボタングループ */}
                  <div className={style.ticket_button}>
                    <ThemeProvider theme={theme}>
                      <div>
                        <Button 
                          variant="contained" 
                          color='error' 
                          endIcon={<DeleteIcon />} 
                          onClick={handleOpenDelete}
                          size='large'
                        >
                          削除
                        </Button>
                      </div>
                      <div>
                        <Button 
                          variant="contained"
                          color='warning'
                          endIcon={<PhoneIcon />} 
                          onClick={handleOpenCall}
                          size='large'
                        >
                          呼び出し
                        </Button>
                      </div>
                    </ThemeProvider>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {/* 発券モーダル */}
          <CreateModal openCreate={openCreate} handleCloseCreate={handleCloseCreate} />
          {/* 削除モーダル */}
          <DeleteModal openDelete={openDelete} handleCloseDelete={handleCloseDelete} />
          {/* 呼び出しモーダル */}
          <CallModal openCall={openCall} handleCloseCall={handleCloseCall} />
          {/* 準備モーダル */}
          <PrepareModal openPrepare={openPrepare} handleClosePrepare={handleClosePrepare} />
          {/* 完了モーダル */}
          <CompleteModal openComplete={openComplete} handleCloseComplete={handleCloseComplete} />
        </Container>
      </Box>   
    </>
  )
}