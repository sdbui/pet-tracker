import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useReducer } from 'react';
import TreatsService from '../../../treats/treats-service';
import List from '@mui/material/List';
import ListItem from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import styles from './styles.module.scss';


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
                <Dialog open={open} onClose={onClose}>
                    <DialogContent>
                        <DialogTitle>Feeding <span className={styles.petName}>{name}</span> A Treat</DialogTitle>
                        <List>
                            <div className={styles['list-header']}>
                                <div>Treat</div>
                                <div>Calories</div>
                            </div>
                            {feedState.list.map((treat, idx)=>(
                                <ListItem key={idx}>
                                    <ListItemButton
                                      sx={{padding: '0 0'}}
                                      onClick={()=> onSubmit(treat)} >
                                        <ListItemText
                                          sx={{ pr: '10px'}}
                                          primary={treat?.name} secondary={treat?.description}></ListItemText>
                                        <p>{treat.calories}</p>
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}

export default FeedPetDialog;