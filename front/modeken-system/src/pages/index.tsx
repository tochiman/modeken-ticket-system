import style from '../styles/Home.module.css';
import Head from 'next/head';
import { useState, SyntheticEvent, Fragment } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MyHeader from '../components/MyHeader';
import MyTable from '../components/MyTable';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
//Tab切り替え用
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

//create-modal用
const steps_create = ['選択', '確認', '完了'];

//delete-modal用
const steps_delete = ['選択', '確認', '完了'];

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
  
  //Modal用
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenCreate = () => setOpenCreate(true);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseCreate = () => setOpenCreate(false);
  const handleCloseDelete = () => setOpenDelete(false);

  //Step用
  const [activeStepCreate, setActiveStepCreate] = useState(0);
  const [activeStepDelete, setActiveStepDelete] = useState(0);

  const handleNextCreate = () => {
    setActiveStepCreate((prevActiveStep) => prevActiveStep + 1);
  };
  const handleNextDelete = () => {
    setActiveStepDelete((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBackCreate = () => {
    setActiveStepCreate((prevActiveStep) => prevActiveStep - 1);
  };
  const handleBackDelete = () => {
    setActiveStepDelete((prevActiveStep) => prevActiveStep - 1);
  };

  const stepHandleCloseCreate = () => {
    // stepをリセット
    setActiveStepCreate(0);
    //　モーダルを閉じる
    handleCloseCreate()
  };
  const stepHandleCloseDelete = () => {
    // stepをリセット
    setActiveStepDelete(0);
    //　モーダルを閉じる
    handleCloseDelete()
  };

  return (
    <>
      <Head>
        <title>Web発券システム</title>
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
        <Container maxWidth="lg" sx={{ mt: 2, mb: 2, }}>
          <Grid container direction="row" spacing={3}>
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
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>   
    </>
  )
}