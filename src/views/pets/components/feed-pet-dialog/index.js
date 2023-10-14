import { useEffect, useReducer } from 'react';
import TreatsService from '../../../treats/treats-service';
import styles from './styles.module.scss';

import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import ListDivider from '@mui/joy/ListDivider';
import Typography from '@mui/joy/Typography';



const feedReducer = (state, action) => {
    switch(action.type) {
        case 'setLoading':
            return {...state, loading: action.payload}
        case 'setList':
            return {...state, list: action.payload}
        default:
            console.log('ACTION NOT SUPPORTED');
            return state;
    }
}

const defaultState = {
    loading: true,
    list: [],
}

const FeedPetDialog = ({open, onClose, onSubmit, name}) => {
    const [feedState, dispatchFeed] = useReducer(feedReducer, defaultState);

    useEffect(() => {
        (async () => {
            let treats = await TreatsService.getTreats();
            dispatchFeed({
                type: 'setList',
                payload: treats,
            });
            dispatchFeed({
                type: 'setLoading',
                payload: false,
            });
        })()
    },[]);

    return (
        <>
            {feedState.loading ? (<div>loading...</div>) : (
                <Modal open={open} onClose={onClose}>
                    <ModalDialog sx={{padding: 0, width:'450px'}}>
                        <DialogContent>
                            <DialogTitle level="h2" sx={{padding: '10px 20px'}}>
                                Feeding <span className={styles.petName}>{name}</span> A Treat
                            </DialogTitle>
                            <div className={styles['list-header']}>
                                <Typography level="body-sm">Calories</Typography>
                            </div>
                            <List>
                                {feedState.list.map((treat, idx)=>(
                                        <ListItem key={idx}>
                                            <ListItemButton
                                                sx={{padding: '0 20px'}}
                                                onClick={()=> onSubmit(treat)} >
                                                <ListItemContent>
                                                    <Typography level="title-lg">{treat?.name}</Typography>
                                                    <Typography level="body-sm">{treat?.description}</Typography>
                                                </ListItemContent>
                                                <p>{treat.calories}</p>
                                            </ListItemButton>
                                        </ListItem>
                                ))}
                            </List>
                        </DialogContent>
                    </ModalDialog>
                </Modal>
            )}
        </>
    )
}

export default FeedPetDialog;