import styles from './styles.module.scss';
import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import TreatsService from './treats-service';
import EditTreatDialog from './components/edit-treat-dialog';
import Edit from '@mui/icons-material/Edit';
import DeleteForever from '@mui/icons-material/DeleteForever';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import { Typography } from '@mui/joy';

function Treats() {
    const {
        treats: defaultTreats,
    } = useLoaderData();
    const [treats, setTreats] = useState(defaultTreats);
    const [selectedTreatId, setSelectedTreatId] = useState(null)
    const [isAdding, setIsAdding] = useState(false);

    async function handleSubmit() {
        let updatedTreats = await TreatsService.getTreats();
        setTreats(updatedTreats);
        setIsAdding(false);
        setSelectedTreatId(null);
    }

    async function removeTreat(treatId) {
        await TreatsService.deleteTreat(treatId);
        let updatedTreats = await TreatsService.getTreats();
        setTreats(updatedTreats);
    }

    function editTreat({id}) {
        setSelectedTreatId(id);
        setIsAdding(true);
    }

    return(
        <div className={styles.container}>
            <List sx={{ 'max-width': '700px'}} className={styles.list}>
                {treats.map((treat) => {
                    return (
                        <ListItem key={treat.id} className={styles.listItem}>
                            <ListItemContent>
                                <Typography>{treat?.name}</Typography>
                                <Typography>{treat?.description}</Typography>
                            </ListItemContent>
                            <p className={styles.calories}>{treat.calories} cals</p>
                            <div className={styles.treatActions}>
                                <Edit onClick={() => {editTreat(treat)}}/>
                                <DeleteForever onClick={() => {removeTreat(treat.id)}}/>
                            </div>
                        </ListItem>
                    )
                })}
                    <ListItemButton onClick={() => setIsAdding(true)}
                        sx={{display: 'flex', 'justify-content': 'center'}}>
                        <AddCircleIcon />
                    </ListItemButton>
            </List>
            {isAdding ? (
                <EditTreatDialog 
                    open={isAdding}
                    onSubmit={handleSubmit} 
                    onClose={() => {
                        setIsAdding(false);
                        setSelectedTreatId(null);
                    }}
                    treat={treats.find(x => x.id === selectedTreatId)}>
                </EditTreatDialog>
            ) : null}
        </div>
        );
}

function TreatListItem (treat) {
    return (
        <>
            <div>{treat.name}</div>
            <div>{treat.description}</div>
            <div>{treat.calories}</div>
            <div className={styles.listActions}></div>
        </>
    );
}

const treatsLoader = async () => {
    let treats = await TreatsService.getTreats();
    return {
        treats,
    };
}

export {
    treatsLoader
};
export default Treats;