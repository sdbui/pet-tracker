import Button from '@mui/joy/Button';
import { useState } from 'react';
import TreatsService from '../../treats-service';

import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogActions from '@mui/joy/DialogActions';
import DialogContent from '@mui/joy/DialogContent';
import DialogTitle from '@mui/joy/DialogTitle';
import Input from '@mui/joy/Input';
import FormLabel from '@mui/joy/FormLabel';
/**
 * This component will handle both Edit and Add of treats
 */

const EditTreatDialog = ({open, onClose, onSubmit, treat = {}}) => {
    const [addForm, setAddForm] = useState({
        id: treat.id || null,
        name: treat.name || '',
        desc: treat.description || '',
        cals: treat.calories || null
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
        <Modal open={open} onClose={onClose}>
            <ModalDialog>
                <DialogTitle level="h2">{treat.id ? 'Editing' : 'Adding'} a Treat</DialogTitle>
                <DialogContent>
                    <FormLabel sx={{marginTop: '5px', fontSize: '0.8rem'}}>Name</FormLabel>
                    <Input
                        autoFocus
                        value={addForm.name}
                        id="name"
                        label="name"
                        type="text"
                        placeholder="Enter name"
                        onChange={onNameChange}
                        autoComplete="off"
                    ></Input>
                    <FormLabel sx={{marginTop: '5px', fontSize: '0.8rem'}}>Description</FormLabel>
                    <Input
                        value={addForm.desc}
                        id="description"
                        label="description"
                        type="text"
                        placeholder="Enter description"
                        onChange={onDescriptionChange}
                        autoComplete="off"
                    ></Input>
                    <FormLabel sx={{marginTop: '5px', fontSize: '0.8rem'}}>Calories</FormLabel>
                    <Input
                        sx={{width: '90px'}}
                        value={addForm.cals}
                        id="calories"
                        label="calories"
                        type="number"
                        placeholder="Cals"
                        onChange={onCaloriesChange}
                        autoComplete="off"
                    ></Input>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogActions>

            </ModalDialog>
        </Modal>
    )

}

export default EditTreatDialog;