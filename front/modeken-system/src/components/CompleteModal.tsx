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

const steps_complete = ['選択', '確認', '完了'];

interface MyComponentsProps{
    openComplete: boolean
    handleCloseComplete: Dispatch<SetStateAction<boolean>>
}
interface SelectType {
    item_type: string,
    item_number: number,
}

const CompleteModal: FC<MyComponentsProps> = ({openComplete, handleCloseComplete}) => {
    //Step用
    const [activeStepComplete, setActiveStepComplete] = useState(0);

    const handleNextComplete = () => {
        if (activeStepComplete === 1){
            setActiveStepComplete((prevActiveStep) => prevActiveStep + 1);
        }
        setActiveStepComplete((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBackComplete = () => {
        setActiveStepComplete((prevActiveStep) => prevActiveStep - 1);
    };

    const stepHandleCloseComplete = () => {
        //　モーダルを閉じる
        handleCloseComplete(false)
        // stepをリセット
        setActiveStepComplete(0);
    };

    // Select用
    const [type, setType] = useState<string>('');

    const handleChangeTypeSelect = (event: SelectChangeEvent) => {
        setType(event.target.value as string);
    };

    // SnackBar用
    const [CompleteSnack, setCompleteSnack] = useState<boolean>(false);

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
    handleNextComplete()
    }
    const onSubmitSecound: SubmitHandler<SelectType> = (data) => {
    setBackdrop(true)
    //[APIで送信]
    const url = process.env.URI_BACK + 'api/v1.0/delete'
    const username = process.env.USERNAME
    const password = process.env.PASSWORD
    const base64Credentials = btoa(username + ':' + password)

    const Options = {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${base64Credentials}`,
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
            handleNextComplete()
            setCompleteSnack(true)
            } else if (response.status == 500){
            setAlert500(true)
            } else {
            setAlertAny(true)
            }
        } finally{
            setBackdrop(false)
            const showSnack = () => setCompleteSnack(false)
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
    {CompleteSnack && <MySnackBar setSeverity='success' AlertContent='集計データへ記録と表から削除しました。'/>}
    { Alert500 &&  <MySnackBar setSeverity="error" AlertContent='実行出来ませんでした。再度しなおしてください。' /> }
    { AlertAny &&  <MySnackBar setSeverity="error" AlertContent='問題が発生しました。フォームの内容を確認してから確定しください。' />}
    <Modal
        open={openComplete}
        onClose={handleCloseComplete}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <div className={style.ModalStyle}>
            {/* 閉じるアイコン */}
            {
                activeStepComplete != 3 ? (
                  <div><CloseIcon onClick={handleCloseComplete} sx={{ml:'auto', mr:'0', display:'block'}} /></div>
                ):null
            }
            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mb:'10px'}}>
            完了画面
            </Typography>
            {/* ステップの中身 */}
            <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStepComplete} alternativeLabel>
                {steps_complete.map((label, index) => {
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
            {activeStepComplete === steps_complete.length ? (
                <Fragment>
                <Typography sx={{ mt: 5, mb: 5 }}>
                    集計データへの記録が完了しました。「終了」を押して閉じてください。
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button onClick={stepHandleCloseComplete}>終了</Button>
                </Box>
                </Fragment>
            ) : (
                <Fragment>
                    {/* 本文 */}
                    <Typography sx={{ mt: 2, mb: 1 }}>
                    {/* 1.選択 */}
                    {
                      activeStepComplete === 0 ? (
                        <>
                            <Alert severity='info' sx={{mt:2,mb:2}}>集計データへの記録と表から削除します。間違いないように入力してください。</Alert>

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
                                    <Button color="inherit" disabled onClick={handleBackComplete} sx={{ mr: 1 }}>
                                        戻る
                                    </Button>
                                    <Box sx={{ flex: '1 1 auto' }} />
                                    <Button type="submit">
                                        {activeStepComplete === steps_complete.length - 2 ? '確定' : '次へ'}
                                    </Button>
                                </Box>
                            </form>
                        </>
                      ): null
                    }
                    {/* 2. 確認 */}
                    {
                      activeStepComplete === 1 ? (
                        <>
                            <Alert severity="info">記録を確定する前に内容が正しいか確認してください</Alert>
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
                                <Button color="inherit" onClick={handleBackComplete} sx={{ mr: 1 }}>
                                    戻る
                                </Button>
                                <Box sx={{ flex: '1 1 auto' }} />
                                <Button type="submit">
                                    {activeStepComplete === steps_complete.length - 2 ? '確定' : '次へ'}
                                </Button>
                                </Box>
                            </form>
                        </>
                      ): null
                    }
                    {/* 3.完了 */}
                    { activeStepComplete === 2 ? null: null }
                    </Typography>
                </Fragment>
            )}
            </Box>
        </div>
        </Modal>
    </>
    )
}

export default  CompleteModal;