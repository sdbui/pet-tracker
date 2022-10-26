import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import MockTreatsService from './mockTreatsService';

function Treats() {
    const {
        treats: defaultTreats,
    } = useLoaderData();
    const [treats, setTreats] = useState(defaultTreats);

    const [isAdding, setIsAdding] = useState(false);
    const [addParams, setAddParams] = useState({
        name: '',
        desc: '',
        cals: 0,
        tags: [],
    })
    function handleSubmit() {
        let lastTreatId = treats[treats.length - 1].id;
        let newTreat = {...addParams, id: lastTreatId + 1};
        setTreats([...treats, newTreat]);
        setIsAdding(false)
    }


    function removeTreat(idx) {
        // in practice.. this would simply send an http req to delete from server
        // but right now... is going to remove it from the local state.
        let copy = [...treats];
        copy.splice(idx, 1)
        setTreats(copy);
    }
    return(<>
        <p>treats view</p>
        {!isAdding && (
            <>
                <button onClick={() => setIsAdding(true)}>add treat</button>
                <ul>
                    {treats.map((treat, idx) => {
                        return (
                            <li key={treat.id}>
                                <p>{treat.name}</p>
                                <p>{treat.description}</p>
                                <p>cals: {treat.calories}</p>
                                <button onClick={() => {
                                    removeTreat(idx);
                                }}>remove</button>
                            </li>
                        )
                    })}
                </ul>
            </>
        ) || (
        <>
            <div>name: <input type="text" onChange={(e) => setAddParams({...addParams, name: e.target.value})}></input></div>
            <div>desc: <input type="text" onChange={(e) => setAddParams({...addParams, description: e.target.value})}></input></div>
            <div>cals: <input type="number" onChange={(e) => setAddParams({...addParams, calories: e.target.value})}></input></div>
            <div>tags: <input type="text" onChange={(e) => setAddParams({...addParams, tags: e.target.value})}></input></div>
            <button onClick={handleSubmit}>submit</button>
        </>)}
    </>);
}

const treatsLoader = async () => {
    let treats = await MockTreatsService.getTreats();
    return {
        treats
    }
}

export {
    treatsLoader
};
export default Treats;