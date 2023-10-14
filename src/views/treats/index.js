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
import { ListDivider, Typography } from '@mui/joy';
import Sheet from '@mui/joy/Sheet';
import { useColorScheme } from '@mui/joy';

function Treats() {
    const {mode} = useColorScheme();
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

    function ListItemWithDivider ({treat, hideDivider=false}) {
        return (<>
            <ListItem key={treat.id} className={styles.listItem}>
                <ListItemContent>
                    <Typography level="title-lg">{treat?.name}</Typography>
                    <Typography level="body-sm">{treat?.description}</Typography>
                </ListItemContent>
                <p className={styles.calories}>{treat.calories} cals</p>
                <div className={styles.treatActions}>
                    <Edit onClick={() => {editTreat(treat)}}/>
                    <DeleteForever onClick={() => {removeTreat(treat.id)}}/>
                </div>
            </ListItem>
            {hideDivider ? '': <ListDivider inset="gutter"/>}
        </>)
    }

    return(
        <div className={styles.container}>
            <List sx={{ maxWidth: '650px', marginTop: '50px'}} variant="outlined">
                {treats.map((treat, idx) => {
                    let hideDivider = idx === treats.length - 1;
                    return (
                        <ListItemWithDivider treat={treat} key={treat.id} hideDivider={hideDivider}></ListItemWithDivider>
                    )
                })}
            </List>
                <AddCircleIcon sx={{height: '50px', width: '50px', marginTop: '10px'}} className={`${styles.addTreatIcon} ${mode === 'light' ? styles.light : ''}`}
                    onClick={() => setIsAdding(true)}/>
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