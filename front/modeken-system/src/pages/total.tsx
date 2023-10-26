import Head from 'next/head'
import { useState, useEffect } from 'react';
import MyHeader from '../components/MyHeader'
import { styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import DeleteIcon from '@mui/icons-material/Delete'
import { setTimeout } from 'timers';
import MyBackdrop from '../components/MyBackdrop';
import MySnackBar from '../components/MySnackbar';

// Table用
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 365,
  bgcolor: 'background.paper',
  border: '1px solid gray',
  borderRadius: '15px',
  boxShadow: 24,
  p: 4,
  color: 'black',
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(
  name: string,
  A_3d: number,
  B_razer: number,
) {
  return { name, A_3d, B_razer};
}


export default function CustomizedTables() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // SnackBar用
  const [DeleteSnack, setDeleteSnack] = useState<boolean>(false);

  // Alert用
  const [Alert500, setAlert500] = useState<boolean>(false);
  const [AlertAny, setAlertAny] = useState<boolean>(false);

  //Backdrop用
  const [Backdrop, setBackdrop] = useState<boolean>(false);

  // 全削除ボタンを押した時の挙動
  const ClickButton = () => {
      setBackdrop(true)
      //[APIで送信]
      const url = process.env.URI_BACK + 'api/v1.0/reset'
      const username = process.env.USERNAME
      const password = process.env.PASSWORD
      const base64Credentials = btoa(username + ':' + password)

      const Options = {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${base64Credentials}`,
            'Content-Type': 'application/json',
          },
          // body: JSON.stringify({
          //   'itemType': data.item_type
          // }),
      }
      const action = () => {
        fetch(url, Options)
        .then((response) => {
          try{
            if (response.status == 200){
              handleClose()
              setDeleteSnack(true)
            } else if (response.status == 500){
              setAlert500(true)
            } else {
              setAlertAny(true)
            }
          } finally{
            setBackdrop(false)
            const showSnack = () => setDeleteSnack(false)
            const Alert500Snack = () => setAlert500(false)
            const AlertAnySnack = () => setAlertAny(false)
            setTimeout( showSnack, 3200)
            setTimeout( Alert500Snack, 3200)
            setTimeout( AlertAnySnack, 3200)
          }
        })
        .catch(err => {
          console.log(err)
        })
      }
      setTimeout(action,500)
  }


  const [ACount, setACount] = useState<number>(0);
  const [BCount, setBCount] = useState<number>(0);
  useEffect(() => {
    //[APIで送信]
    const url = process.env.URI_BACK + 'api/v1.0/collection'
    const username = process.env.USERNAME
    const password = process.env.PASSWORD
    const base64Credentials = btoa(username + ':' + password)
  
    const Options = {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${base64Credentials}`,
        },
    }
    fetch(url, Options)
    .then((response) => {
      try{
        if (response.status == 500){
          setAlert500(true)
        } 
      } finally{
        const Alert500Snack = () => setAlert500(false)
        setTimeout( Alert500Snack, 3200)
        return response.json()
      }
    })
    .then( (json) => {
      setACount(json['data']['A']['count'])
      setBCount(json['data']['B']['count'])
    })
    .catch(err => {
      console.log(err)
    })
  },[])
  const rows = [
    createData('完了件数', ACount, BCount)
  ]
  

  return (
    <>
      {DeleteSnack && <MySnackBar setSeverity='success' AlertContent='集計データのリセットが完了しました。サイトをリロードしてください。'/>}
      { Alert500 &&  <MySnackBar setSeverity="error" AlertContent='集計データをリセットすることが出来ませんでした。再度しなおしてください。' /> }
      { AlertAny &&  <MySnackBar setSeverity="error" AlertContent='問題が発生しました。' />}
      <Head>
        <title>Web発券システム(集計)</title>
        <meta name="description" content="モデリング研究同好会の出店における発券システムをWebで行います。" />
        <link rel="icon" href="modeken-top.png" />
      </Head>
      <MyHeader />
      <Box sx={{width: '100%', height: '80vh', position: 'relative'}}>
        <Box sx={{ position: 'absolute', top: '50%',left: '50%', transform: 'translateY(-50%) translateX(-50%)'}}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 365 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell align="center">3Dプリンタ</StyledTableCell>
                  <StyledTableCell align="center">レーザーカッタ</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <StyledTableRow key={row.name}>
                    <StyledTableCell component="th" scope="row">
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.A_3d}</StyledTableCell>
                    <StyledTableCell align="right">{row.B_razer}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{width:'100%', mt: 2}}>
            <Button variant='contained' onClick={handleOpen} color="info" endIcon={<DeleteIcon />}>集計データリセット</Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  集計データリセット
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
                  集計データを全て削除して、発券番号を1番から開始するようになります。続行しますか？
                </Typography>
                { Backdrop && <MyBackdrop /> }
                <div style={{width:'100%'}}>
                  <Button variant='contained' color='primary' sx={{width:'50%'}} onClick={ClickButton}>続行</Button>
                  <Button variant='contained' color='error' sx={{width:'50%'}} onClick={handleClose}>キャンセル</Button>
                </div>
              </Box>
            </Modal>
          </Box>
        </Box>
      </Box>
    </>
  );
}