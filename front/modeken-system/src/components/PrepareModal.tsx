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

const steps_prepare = ['選択', '確認', '完了'];

interface MyComponentsProps{
    openPrepare: boolean
    handleClosePrepare: Dispatch<SetStateAction<boolean>>
}

const PrepareModal: FC<MyComponentsProps> = ({openPrepare, handleClosePrepare}) => {
    //Step用
    const [activeStepPrepare, setActiveStepPrepare] = useState(0);

    const handleNextPrepare = () => {
        if (activeStepPrepare === 1){
            setActiveStepPrepare((prevActiveStep) => prevActiveStep + 1);
        }
        setActiveStepPrepare((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBackPrepare = () => {
        setActiveStepPrepare((prevActiveStep) => prevActiveStep - 1);
    };

    const stepHandleClosePrepare = () => {
        //　モーダルを閉じる
        handleClosePrepare(false)
        // stepをリセット
        setActiveStepPrepare(0);
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
        open={openPrepare}
        onClose={handleClosePrepare}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <div className={style.ModalStyle}>
            {/* 閉じるアイコン */}
            {
                activeStepPrepare != 3 ? (
                  <div><CloseIcon onClick={handleClosePrepare} sx={{ml:'auto', mr:'0', display:'block'}} /></div>
                ):null
            }
            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mb:'10px'}}>
            準備中画面
            </Typography>
            {/* ステップの中身 */}
            <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStepPrepare} alternativeLabel>
                {steps_prepare.map((label, index) => {
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
            {activeStepPrepare === steps_prepare.length ? (
                <Fragment>
                <Typography sx={{ mt: 5, mb: 5 }}>
                    準備中側へ移動しました。「終了」を押して閉じてください。
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button onClick={stepHandleClosePrepare}>終了</Button>
                </Box>
                </Fragment>
            ) : (
                <Fragment>
                    {/* 本文 */}
                    <Typography sx={{ mt: 2, mb: 1 }}>
                    {/* 1.選択 */}
                    {
                      activeStepPrepare === 0 ? (
                        <>
                            <Alert severity='info' sx={{mt:2,mb:2}}>対象の番号を準備中側へ移動をします。間違いないように入力してください。</Alert>
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
                      activeStepPrepare === 1 ? (
                        <>
                          <Alert severity="info">移動を確定する前に内容が正しいか確認してください</Alert>
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
                    { activeStepPrepare === 2 ? null: null }
                    </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                    color="inherit"
                    disabled={activeStepPrepare === 0}
                    onClick={handleBackPrepare}
                    sx={{ mr: 1 }}
                    >
                    戻る
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button onClick={handleNextPrepare}>
                    {activeStepPrepare === steps_prepare.length - 1 ? '完了' : '次へ'}
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

export default  PrepareModal;