import { useState } from 'react';
import PetsService from '../../pets-service';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogActions from '@mui/joy/DialogActions';
import DialogContent from '@mui/joy/DialogContent';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';

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
        setAddForm(prev=> {
            return {...defaultAddForm}
        })
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
        <Modal open={open} onClose={onClose}>
            <ModalDialog>
                <DialogTitle level="h2">Add New Pet</DialogTitle>
                <DialogContent>
                    <Input 
                        autoComplete="off"
                        autoFocus
                        id="name"
                        label="name"
                        type="text"
                        placeholder="Enter name"
                        onChange={onNameChange}
                    />
                    <Input
                        autoComplete="off"
                        id="description"
                        label="description"
                        type="text"
                        placeholder="Enter description"
                        onChange={onDescriptionChange}
                    />
                    <Stack direction="row" spacing={1}>
                        <Input  
                            autoComplete="off"
                            sx={{flexBasis: '100px'}}
                            id="weight"
                            label="weight"
                            type="number"
                            placeholder="Weight"
                            onChange={onWeightChange}
                        />
                        <Input 
                            sx={{flexGrow:1}}
                            id="pic"
                            label="pic"
                            type="file"
                            onChange={onFileChange}
                        />
                    </Stack>
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