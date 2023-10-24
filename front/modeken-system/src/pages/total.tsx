import Head from 'next/head'
import { useState } from 'react';
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
  calories: number,
  fat: number,
) {
  return { name, calories, fat};
}

const rows = [
  createData('準備中', 159, 6.0),
  createData('呼び出し中', 237,3.0),
  createData('完了', 262, 16.0),
];

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
          console.log(response)
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
            setTimeout( showSnack, 3200)
          }
        })
        .catch(err => {
          console.log(err)
        })
      }
      setTimeout(action,500)
  }

  return (
    <>
      {DeleteSnack && <MySnackBar setSeverity='success' AlertContent='集計データのリセットが完了しました'/>}
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
                    <StyledTableCell align="right">{row.calories}</StyledTableCell>
                    <StyledTableCell align="right">{row.fat}</StyledTableCell>
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
                  集計データを全て削除します。続行しますか？
                </Typography>
                { Alert500 &&  <Alert severity="error">集計データをリセットすることが出来ませんでした。再度しなおしてください。</Alert>}
                { AlertAny &&  <Alert severity="error">問題が発生しました。</Alert>}
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