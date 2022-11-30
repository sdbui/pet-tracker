import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import PetsService from '../../pets-service';

const defaultAddForm = {
    name: '',
    description: '',
    weight: 0,
    pic: '',
}

const AddPetDialog = ({open, onClose, onAdd}) => {

    const [addForm, setAddForm] = useState(defaultAddForm);

    async function submit() {
        await PetsService.addPet(addForm);
        onAdd();
    }

    function onFileChange(e) {
        setAddForm((prev)=> ({...prev, pic: e.target.files[0]}))
    }
    function onNameChange(e) {
        setAddForm((prev) => ({...prev, name: e.target.value}))
    }
    function onDescriptionChange(e) {
        setAddForm((prev)=>({...prev, description: e.target.value}))
    }
    function onWeightChange(e) {
        setAddForm((prev) => ({...prev, weight: e.target.value}))
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add New Pet</DialogTitle>
            <DialogContent>
                <TextField 
                    autoFocus
                    margin="dense"
                    id="name"
                    label="name"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={onNameChange}
                />
                <TextField 
                    margin="dense"
                    id="description"
                    label="description"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={onDescriptionChange}
                />
                <TextField 
                    margin="dense"
                    id="weight"
                    label="weight"
                    type="number"
                    variant="standard"
                    onChange={onWeightChange}
                />
                <TextField 
                    margin="dense"
                    id="pic"
                    label="pic"
                    type="file"
                    variant="standard"
                    onChange={onFileChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={submit}>Submit</Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddPetDialog;