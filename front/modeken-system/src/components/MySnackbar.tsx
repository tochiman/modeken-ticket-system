import {useState, SyntheticEvent, FC} from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert, {AlertColor} from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface MyComponentsProps{
  setSeverity: AlertColor | undefined,
  AlertContent: string,
}

const SimpleSnackbar:FC<MyComponentsProps> = ({setSeverity, AlertContent}) => {
  const [open, setOpen] = useState(true);

  const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <div>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={setSeverity} sx={{ width: '100%' }}>
            {AlertContent}
        </Alert>
        </Snackbar>
    </div>
  );
}

export default SimpleSnackbar;