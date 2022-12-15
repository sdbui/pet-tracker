import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import TreatsService from '../../treats-service';

/**
 * This component will handle both Edit and Add of treats
 */

const EditTreatDialog = ({open, onClose, onSubmit, treat = {}}) => {
    const [addForm, setAddForm] = useState({
        id: treat.id || null,
        name: treat.name || '',
        desc: treat.description || '',
        cals: treat.calories || 0
    });


    function onNameChange(e) {
        setAddForm((prev) => ({...prev, name: e.target.value}))
    }
    function onDescriptionChange(e) {
        setAddForm((prev) => ({...prev, desc: e.target.value}))
    }
    function onCaloriesChange(e) {
        setAddForm((prev) => ({...prev, cals: e.target.value}))
    }

    async function handleSubmit() {
        // if there is an id, this is an update; not a creat
        if (addForm.id) {
            await TreatsService.updateTreat(addForm);
        } else {
            await TreatsService.addTreat(addForm);
        }
        onSubmit();
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{treat.id ? 'Editing' : 'Adding'} a Treat</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    value={addForm.name}
                    id="name"
                    label="name"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={onNameChange}
                ></TextField>
                <TextField
                    value={addForm.desc}
                    id="description"
                    label="description"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={onDescriptionChange}
                ></TextField>
                <TextField
                    value={addForm.cals}
                    id="calories"
                    label="calories"
                    type="number"
                    fullWidth
                    variant="standard"
                    onChange={onCaloriesChange}
                ></TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    )

}

export default EditTreatDialog;