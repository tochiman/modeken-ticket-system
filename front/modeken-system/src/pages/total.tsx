import Head from 'next/head'
import * as React from 'react';
import MyHeader from '../components/MyHeader'
import { styled } from '@mui/material/styles';
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
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
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
                <div style={{width:'100%'}}>
                  <Button variant='contained' color='primary' sx={{width:'50%'}}>続行</Button>
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