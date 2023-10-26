import style from '../styles/Home.module.css';
import { useState, Fragment, FC, Dispatch, SetStateAction, ChangeEvent} from 'react';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, SubmitHandler } from "react-hook-form";
import { setTimeout } from 'timers';
import MyBackdrop from './MyBackdrop';
import MySnackBar from './MySnackbar';

const steps_delete = ['選択', '確認', '完了'];

interface MyComponentsProps{
    openDelete: boolean
    handleCloseDelete: Dispatch<SetStateAction<boolean>>
}
interface SelectType {
    item_type: string,
    item_number: number,
}

const DeleteModal: FC<MyComponentsProps> = ({openDelete, handleCloseDelete}) => {
    //Step用
    const [activeStepDelete, setActiveStepDelete] = useState(0);

    const handleNextDelete = () => {
        if (activeStepDelete === 1){
            setActiveStepDelete((prevActiveStep) => prevActiveStep + 1);
        }
        setActiveStepDelete((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBackDelete = () => {
        setActiveStepDelete((prevActiveStep) => prevActiveStep - 1);
    };

    const stepHandleCloseDelete = () => {
        //　モーダルを閉じる
        handleCloseDelete(false)
        // stepをリセット
        setActiveStepDelete(0);
        setAlert500(false)
        setAlertAny(false)
    };

    // Select用
    const [type, setType] = useState<string>('');

    const handleChangeTypeSelect = (event: SelectChangeEvent) => {
        setType(event.target.value as string);
    };

    // SnackBar用
    const [DeleteSnack, setDeleteSnack] = useState<boolean>(false);

    // Alert用
    const [Alert500, setAlert500] = useState<boolean>(false);
    const [AlertAny, setAlertAny] = useState<boolean>(false);

    //Backdrop用
    const [Backdrop, setBackdrop] = useState<boolean>(false);

    // TextFiled用(番号)
    const [num, setNum] = useState<number>(0)

    const handleChangeTextFiled = (event: ChangeEvent<HTMLInputElement>) => {
        setNum(Number(event.target.value))
    }

    // Form用
    const { register, handleSubmit } = useForm<SelectType>()
    const onSubmitFirst: SubmitHandler<SelectType> = (data) => {
      handleNextDelete()
    }
    const onSubmitSecound: SubmitHandler<SelectType> = (data) => {
      setBackdrop(true)
      //[APIで送信]
      const url = process.env.URI_BACK + 'api/v1.0/cancel'

      const Options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            'itemType': data.item_type,
            'itemNumber': data.item_number,
          }),
      }
      const action = () => {
        fetch(url, Options)
        .then((response) => {
          try{
            if (response.status == 200){
              handleNextDelete()
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
    return (
    <>
    {DeleteSnack && <MySnackBar setSeverity='success' AlertContent='発券の取り消しに成功しました。'/>}
    { Alert500 &&  <MySnackBar setSeverity="error" AlertContent='発券を取り消しすることが出来ませんでした。再度しなおしてください。' /> }
    { AlertAny &&  <MySnackBar setSeverity="error" AlertContent='問題が発生しました。フォームの内容を確認してから確定しください。' />}
    <Modal
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <div className={style.ModalStyle}>
            {/* 閉じるアイコン */}
            {
                activeStepDelete != 3 ? (
                  <div><CloseIcon onClick={handleCloseDelete} sx={{ml:'auto', mr:'0', display:'block'}} /></div>
                ):null
            }
            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mb:'10px'}}>
            削除画面
            </Typography>
            {/* ステップの中身 */}
            <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStepDelete} alternativeLabel>
                {steps_delete.map((label, index) => {
                const stepProps: { completed?: boolean } = {};
                const labelProps: {
                    optional?: React.ReactNode;
                } = {};
                return (
                    <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                );
                })}
            </Stepper>
            {activeStepDelete === steps_delete.length ? (
                <Fragment>
                <Typography sx={{ mt: 5, mb: 5 }}>
                    削除が完了しました。「終了」を押して閉じてください。
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button onClick={stepHandleCloseDelete}>終了</Button>
                </Box>
                </Fragment>
            ) : (
                <Fragment>
                    {/* 本文 */}
                    <Typography sx={{ mt: 2, mb: 1 }}>
                    {/* 1.選択 */}
                    {
                      activeStepDelete === 0 ? (
                        <>
                            <Alert severity='warning' sx={{mt:2,mb:2}}>発券の取り消しを行います。間違いないように入力してください。</Alert>

                            <form onSubmit={handleSubmit(onSubmitFirst)}>
                                <FormControl sx={{mt:1,mb:2}} fullWidth required >
                                    <InputLabel id="demo-simple-select-label">種別</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={type}
                                        label="type"
                                        defaultValue=''
                                        {...register("item_type", {required: true})}
                                        onChange={handleChangeTypeSelect}
                                    >
                                        <MenuItem value={"A"}>【A】3Dプリンター</MenuItem>
                                        <MenuItem value={"B"}>【B】レーザーカッター</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField 
                                    sx={{mt:1,mb:2}} 
                                    label="番号" 
                                    type="number" 
                                    variant="outlined" 
                                    helperText="数字のみ入力してください" 
                                    {...register("item_number", {required: true})}
                                    onChange={handleChangeTextFiled}
                                    fullWidth 
                                />
                                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                    <Button color="inherit" disabled onClick={handleBackDelete} sx={{ mr: 1 }}>
                                        戻る
                                    </Button>
                                    <Box sx={{ flex: '1 1 auto' }} />
                                    <Button type="submit">
                                        {activeStepDelete === steps_delete.length - 2 ? '確定' : '次へ'}
                                    </Button>
                                </Box>
                            </form>
                        </>
                      ): null
                    }
                    {/* 2. 確認 */}
                    {
                      activeStepDelete === 1 ? (
                        <>
                          <Alert severity="info">取り消しを確定する前に内容が正しいか確認してください</Alert>
                          { Backdrop && <MyBackdrop /> }
                          <form onSubmit={handleSubmit(onSubmitSecound)}>
                            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mt: 3,mb: 2}}>
                                種別
                            </Typography>
                            <Typography id="modal-modal-description" variant="h6" component="h2" sx={{mt: 1,mb: 1, fontSize: '16px'}}>
                                {type === "A" ? '【A】3Dプリンター': null}
                                {type === "B" ? '【B】レーザーカッター': null}
                            </Typography>
                            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mt: 3,mb: 2}}>
                                番号
                            </Typography>
                            <Typography id="modal-modal-description" variant="h6" component="h2" sx={{mt: 1,mb: 1, fontSize: '16px'}}>
                                {num}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                              <Button color="inherit" onClick={handleBackDelete} sx={{ mr: 1 }}>
                                戻る
                              </Button>
                              <Box sx={{ flex: '1 1 auto' }} />
                              <Button type="submit">
                                {activeStepDelete === steps_delete.length - 2 ? '確定' : '次へ'}
                              </Button>
                            </Box>
                          </form>
                        </>
                      ): null
                    }
                    {/* 3.完了 */}
                    { activeStepDelete === 2 ? null: null }
                    </Typography>
                </Fragment>
            )}
            </Box>
        </div>
        </Modal>
    </>
    )
}

export default  DeleteModal;