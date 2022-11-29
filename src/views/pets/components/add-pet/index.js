import './styles.css';
import { useState } from 'react';
import PetsService from '../../pets-service';

const defaultAddForm = {
    name: '',
    description: '',
    weight: 0,
    pic: '',
}

const AddPet = ({onClose, onAdd}) => {

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
        <>  
            <button onClick={onClose}>cancel</button>
            <div><span>name:</span><input type="text" onChange={onNameChange}></input></div>
            <div><span>desc:</span><input type="text" onChange={onDescriptionChange}></input></div>
            <div><span>weight:</span><input type="number" onChange={onWeightChange}></input></div>
            <div>
                <span>pic:</span>
                <input type="file" onChange={onFileChange}></input>
            </div>
            <button onClick={submit}>submit</button>
        </>
    )
}

export default AddPet;