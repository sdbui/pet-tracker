import { useState } from 'react';
import PetsService from '../../pets-service';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogActions from '@mui/joy/DialogActions';
import DialogContent from '@mui/joy/DialogContent';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';

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
        console.log('change?')
        setAddForm((prev) => ({...prev, weight: e.target.value}))
    }

    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog>
                <DialogTitle>Add New Pet</DialogTitle>
                <DialogContent>
                    <Input 
                        autoFocus
                        id="name"
                        label="name"
                        type="text"
                        onChange={onNameChange}
                    />
                    <Input 
                        id="description"
                        label="description"
                        type="text"
                        onChange={onDescriptionChange}
                    />
                    <Input 
                        id="weight"
                        label="weight"
                        type="number"
                        onChange={onWeightChange}
                    />
                    <Input 
                        id="pic"
                        label="pic"
                        type="file"
                        onChange={onFileChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={submit}>Submit</Button>
                </DialogActions>
            </ModalDialog>
        </Modal>
    )
}

export default AddPetDialog;