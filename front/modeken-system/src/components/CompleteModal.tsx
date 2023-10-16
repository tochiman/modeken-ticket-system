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

const steps_complete = ['選択', '確認', '完了'];

interface MyComponentsProps{
    openComplete: boolean
    handleCloseComplete: Dispatch<SetStateAction<boolean>>
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

    // TextFiled用(番号)
    const [num, setNum] = useState<number>(0)

    const handleChangeTextFiled = (event: ChangeEvent<HTMLInputElement>) => {
        setNum(Number(event.target.value))
    }
    return (
    <>
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
                            <FormControl sx={{mt:1,mb:2}} fullWidth required >
                                <InputLabel id="demo-simple-select-label">種別</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={type}
                                    label="type"
                                    onChange={handleChangeTypeSelect}
                                    required
                                >
                                    <MenuItem value={"【A】3Dプリンター"}>【A】3Dプリンター</MenuItem>
                                    <MenuItem value={"【B】レーザーカッター"}>【B】レーザーカッター</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField 
                                sx={{mt:1,mb:2}} 
                                label="番号" 
                                type="number" 
                                variant="outlined" 
                                helperText="数字のみ入力してください" 
                                onChange={handleChangeTextFiled}
                                fullWidth 
                                required 
                            />
                        </>
                      ): null
                    }
                    {/* 2. 確認 */}
                    {
                      activeStepComplete === 1 ? (
                        <>
                          <Alert severity="info">記録を確定する前に内容が正しいか確認してください</Alert>
                          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mt: 3,mb: 2}}>
                            種別
                          </Typography>
                          <Typography id="modal-modal-description" variant="h6" component="h2" sx={{mt: 1,mb: 1, fontSize: '16px'}}>
                            {type}
                          </Typography>
                          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mt: 3,mb: 2}}>
                            番号
                          </Typography>
                          <Typography id="modal-modal-description" variant="h6" component="h2" sx={{mt: 1,mb: 1, fontSize: '16px'}}>
                            {num}
                          </Typography>
                        </>
                      ): null
                    }
                    {/* 3.完了 */}
                    { activeStepComplete === 2 ? null: null }
                    </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                    color="inherit"
                    disabled={activeStepComplete === 0}
                    onClick={handleBackComplete}
                    sx={{ mr: 1 }}
                    >
                    戻る
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button onClick={handleNextComplete}>
                    {activeStepComplete === steps_complete.length - 1 ? '完了' : '次へ'}
                    </Button>
                </Box>
                </Fragment>
            )}
            </Box>
        </div>
        </Modal>
    </>
    )
}

export default  CompleteModal;