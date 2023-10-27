import style from '../styles/Home.module.css';
import { useState, Fragment, FC, Dispatch, SetStateAction} from 'react';
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
import CloseIcon from '@mui/icons-material/Close';
import { useForm, SubmitHandler } from "react-hook-form";
import { setTimeout } from 'timers';
import MyBackdrop from './MyBackdrop';
import MySnackBar from './MySnackbar';

const steps_create = ['選択', '確認', '完了'];

interface MyComponentsProps {
  openCreate: boolean
  handleCloseCreate: any
}
interface SelectType {
  item_type: string
}

const CreateModal: FC<MyComponentsProps>  = ({openCreate, handleCloseCreate}) => {
    //Step用
    const [activeStepCreate, setActiveStepCreate] = useState(0);

    const handleNextCreate = () => {
        if (activeStepCreate === 1){
          setActiveStepCreate((prevActiveStep) => prevActiveStep + 1);
        }
        setActiveStepCreate((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBackCreate = () => {
        setActiveStepCreate((prevActiveStep) => prevActiveStep - 1);
    };

    const stepHandleCloseCreate = () => {
        //　モーダルを閉じる
        handleCloseCreate(false)
        // stepをリセット
        setActiveStepCreate(0);
        setAlert500(false)
        setAlertAny(false)
    };

    // Select用
    const [type, setType] = useState<string>('');

    const handleChangeTypeSelect = (event: SelectChangeEvent) => {
        setType(event.target.value as string);
    };

    // SnackBar用
    const [CreateSnack, setCreateSnack] = useState<boolean>(false);

    // Alert用
    const [Alert500, setAlert500] = useState<boolean>(false);
    const [AlertAny, setAlertAny] = useState<boolean>(false);

    //Backdrop用
    const [Backdrop, setBackdrop] = useState<boolean>(false);

    // Form用
    const { register, handleSubmit } = useForm<SelectType>()
    const onSubmitFirst: SubmitHandler<SelectType> = (data) => {
      handleNextCreate()
    }
    const onSubmitSecound: SubmitHandler<SelectType> = (data) => {
      setBackdrop(true)
      //[APIで送信]
      const url = process.env.URI_BACK + 'api/v1.0/ticketing'

      const Options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            'itemType': data.item_type
          }),
      }
      const action = () => {
        fetch(url, Options)
        .then((response) => {
          try{
            if (response.status == 200){
              handleNextCreate()
              setCreateSnack(true)
            } else if (response.status == 500){
              setAlert500(true)
            } else {
              setAlertAny(true)
            }
          } finally{
            setBackdrop(false)
            const showSnack = () => setCreateSnack(false)
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
        {CreateSnack && <MySnackBar setSeverity='success' AlertContent='発券が完了しました'/>}
        { Alert500 &&  <MySnackBar setSeverity="error" AlertContent='発券することが出来ませんでした。再度発券しなおしてください。' /> }
        { AlertAny &&  <MySnackBar setSeverity="error" AlertContent='問題が発生しました。フォームの内容を確認してから確定しください。' />}
        <Modal
            open={openCreate}
            onClose={handleCloseCreate}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div className={style.ModalStyle}>
              {/* 閉じるアイコン */}
              {
                activeStepCreate != 3 ? (
                  <div><CloseIcon onClick={handleCloseCreate} sx={{ml:'auto', mr:'0', display:'block'}} /></div>
                ):null
              }
              {/* ステップの中身 */}
              <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mb:'10px'}}>
                発券画面
              </Typography>
              <Box sx={{ width: '100%' }}>
                <Stepper activeStep={activeStepCreate} alternativeLabel>
                  {steps_create.map((label, index) => {
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
                {activeStepCreate === steps_create.length ? (

                  <Fragment>
                    <Typography sx={{ mt: 5, mb: 5 }}>
                      発券が完了しました。「終了」を押して閉じてください。
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                      <Box sx={{ flex: '1 1 auto' }} />
                      <Button onClick={stepHandleCloseCreate}>終了</Button>
                    </Box>
                  </Fragment>
                ) : (
                  <Fragment>
                    {/* 本文 */}
                    <Typography sx={{ mt: 2, mb: 1 }}>
                    {/* 1.選択 */}
                    {
                      activeStepCreate === 0 ? (
                        <>
                          <Alert severity='info' sx={{mt:2,mb:2}}>発券を行います。発券に必要な項目を埋めてください。</Alert>
                        
                          <form onSubmit={handleSubmit(onSubmitFirst)}>
                            <FormControl fullWidth required>
                              <InputLabel id="demo-simple-select-label">種別</InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={type}
                                label="type "
                                defaultValue=''
                                {...register("item_type", {required: true})}
                                onChange={handleChangeTypeSelect}
                              >
                                <MenuItem value={"A"}>【A】3Dプリンター</MenuItem>
                                <MenuItem value={"B"}>【B】レーザーカッター</MenuItem>
                              </Select>
                            </FormControl>
                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                              <Button color="inherit" disabled onClick={handleBackCreate} sx={{ mr: 1 }}>
                                戻る
                              </Button>
                              <Box sx={{ flex: '1 1 auto' }} />
                              <Button type="submit">
                                {activeStepCreate === steps_create.length - 2 ? '確定' : '次へ'}
                              </Button>
                            </Box>
                          </form>
                        </>
                      ): null
                    }
                    {/* 2. 確認 */}
                    {
                      activeStepCreate === 1 ? (
                        <>
                          <Alert severity="info">発券を確定する前に内容が正しいか確認してください</Alert>
                          { Backdrop && <MyBackdrop /> }
                          <form onSubmit={handleSubmit(onSubmitSecound)}>
                            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mt: 3,mb: 2}}>
                              種別
                            </Typography>
                            <Typography id="modal-modal-description" variant="h6" component="h2" sx={{mt: 1,mb: 1, fontSize: '16px'}}>
                            {type === "A" ? '【A】3Dプリンター': null}
                            {type === "B" ? '【B】レーザーカッター': null}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                              <Button color="inherit" onClick={handleBackCreate} sx={{ mr: 1 }}>
                                戻る
                              </Button>
                              <Box sx={{ flex: '1 1 auto' }} />
                              <Button type="submit">
                                {activeStepCreate === steps_create.length - 2 ? '確定' : '次へ'}
                              </Button>
                            </Box>
                          </form>
                        </>
                      ): null
                    }
                    {/* 3.完了 */}
                    { activeStepCreate === 2 ? null: null }
                    </Typography>
                  </Fragment>
                )}
              </Box>
            </div>
          </Modal>
        </>
    )
}

export default CreateModal;