import style from '../styles/Home.module.css';
import Head from 'next/head';
import Router from 'next/router'
import { useState, SyntheticEvent, useRef, useEffect } from 'react';
import MySnackBar from '../components/MySnackbar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import MyHeader from '../components/MyHeader';
import MyTable from '../components/MyTable'

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

  // SnackBar用
  const [Alert500, setAlert500] = useState<boolean>(false);
  const [AlertAny, setAlertAny] = useState<boolean>(false);

  // Tableのデータを取得
  const username = process.env.USERNAME
  const password = process.env.PASSWORD
  const base64Credentials = btoa(username + ':' + password)
  const Options = {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${base64Credentials}`,
      },
  }
  const [WaitA, setWaitA] = useState<any>([]);
  const [ReadyA, setReadyA] = useState<any>([]);
  const [WaitB, setWaitB] = useState<any>([]);
  const [ReadyB, setReadyB] = useState<any>([]);
  const socketRef = useRef<WebSocket>()
  const [isConnected, setIsConnected] = useState<boolean>(false)
  useEffect(() => {
    socketRef.current = new WebSocket(process.env.URI_WSS+'api/v1.0/ws')
    socketRef.current.onopen = function () {
      socketRef.current?.send(btoa('user:password'))
      setIsConnected(true)
      console.log('Connected')
    }

    socketRef.current.onclose = function () {
      console.log('closed')
      setIsConnected(false)
    }

    //Connectionをはっているときにメッセージを受信したら実行される
    socketRef.current.onmessage = function (event) {
      //受信したデータを表示(連想配列にキャストもしている)
      const receivedData = JSON.parse(event.data)
      try{
        console.log(receivedData)
        switch(receivedData['status']){
          case 'add':
            if (receivedData['itemType'] == 'A'){
              setWaitA([...WaitA, {'item_number': receivedData['itemNumber'], 'created_time': receivedData['createTime']}])
            } else if (receivedData['itemType'] == 'B'){
              setWaitB([...WaitB, {'item_number': receivedData['itemNumber'], 'created_time': receivedData['createTime']}])
            }
            break;
          case 'move':
            if (receivedData['before'] == 'wait'){
              if (receivedData['itemType'] == 'A'){
                //準備中から消す
                setWaitA(WaitA.filter((row:any, index:any) => (row !== receivedData['itemNumber'])))
                //呼び出しに追加
                setReadyA([...ReadyA, {'item_number': receivedData['itemNumber'], 'created_time': receivedData['createTime']}])
              } else if (receivedData['itemType'] == 'B'){
                //準備中から消す
                setWaitB(WaitB.filter((row:any, index:any) => (row !== receivedData['itemNumber'])))
                //呼び出しに追加
                setReadyB([...ReadyB, {'item_number': receivedData['itemNumber'], 'created_time': receivedData['createTime']}])
              }
            } else if (receivedData['before'] == 'ready'){
              if (receivedData['itemType'] == 'A'){
                //準備中に追加
                setWaitA([...WaitA, {'item_number': receivedData['itemNumber'], 'created_time': receivedData['createTime']}])
                //呼び出しから消す
                setReadyA(ReadyA.filter((row:any, index:any) => (row !== receivedData['itemNumber'])))
              } else if (receivedData['itemType'] == 'B'){
                //準備中に追加
                setWaitB([...WaitB, {'item_number': receivedData['itemNumber'], 'created_time': receivedData['createTime']}])
                //呼び出しから消す
                setReadyB(ReadyB.filter((row:any, index:any) => (row !== receivedData['itemNumber'])))
              }
            }
            break;
          case 'cancel':
            if (receivedData['itemType'] == 'A'){
              setWaitA(WaitA.filter((row:any, index:any) => (row !== receivedData['itemNumber'])))
            } else if (receivedData['itemType'] == 'B'){
              setWaitB(WaitB.filter((row:any, index:any) => (row !== receivedData['itemNumber'])))
            }
            break;
          case 'delete':
            if (receivedData['itemType'] == 'A'){
              setReadyA(ReadyA.filter((row:any, index:any) => (row !== receivedData['itemNumber'])))
            } else if (receivedData['itemType'] == 'B'){
              setReadyB(ReadyB.filter((row:any, index:any) => (row !== receivedData['itemNumber'])))
            }
            break;
          case 'reset':
            break;
          default:
            break;
        }
      }finally{
        //ConnectionがCloseされるため空文字送信
        socketRef.current?.send('')
      }
    }

    //WSがUnmountされされた時の処理
    return () => {
      if (socketRef.current == null) {
        return
      }
      socketRef.current?.close()
    }
  }, [])
  useEffect(() => {
    const url_A = process.env.URI_BACK + 'api/v1.0/admin/A'

    fetch(url_A, Options)
    .then((responseA) => {
      try{
        if (responseA.status == 200){
          return responseA.json()
        } else {
          setAlertAny(true)
        }
      } finally{
        const AlertAnySnack = () => setAlertAny(false)
        setTimeout( AlertAnySnack, 3200)
      }
    })
    .then( (jsonA) => {
      setWaitA(jsonA['data']['wait'])
      setReadyA(jsonA['data']['ready'])
    })
    .catch(err => console.log(err))
    const url_B = process.env.URI_BACK + 'api/v1.0/admin/B'
    fetch(url_B, Options)
    .then((responseB) => {
      try{
        if (responseB.status == 200){
          return responseB.json()
        } else {
          setAlertAny(true)
        }
      } finally{
        const AlertAnySnack = () => setAlertAny(false)
        setTimeout( AlertAnySnack, 3200)
      }
    })
    .then( (jsonB) => {
      setWaitB(jsonB['data']['wait'])
      setReadyB(jsonB['data']['ready'])
    })
    .catch(err => console.log(err))
  },[])

  useEffect(() => {
  }, [WaitA,WaitB,ReadyA,ReadyB])
  
  return (
    <>
      <Head>
        <title>Web発券システム</title>
        <meta name="description" content="モデリング研究同好会の出店における発券システムをWebで行います。" />
        <link rel="icon" href="modeken-top.png" />
      </Head>

      {/* ヘッダの呼び出し */}
      <MyHeader />

      { AlertAny &&  <MySnackBar setSeverity="error" AlertContent='問題が発生しました。サイトをリロードしてください。' />}
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
                      <MyTable rows={ReadyA}/>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                      <MyTable rows={ReadyB}/>
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
                      <MyTable rows={WaitA}/>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                      <MyTable rows={WaitB}/>
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