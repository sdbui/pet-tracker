import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import TreatsService from './treats-service';

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
    })
    async function handleSubmit() {
        let newTreat = {
            ...addParams
        };
        await TreatsService.addTreat(newTreat);
        let updatedTreats = await TreatsService.getTreats();
        setTreats(updatedTreats);
        setIsAdding(false)
    }

    async function removeTreat(treatId) {
        await TreatsService.deleteTreat(treatId);
        let updatedTreats = await TreatsService.getTreats();
        setTreats(updatedTreats);
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
                                    removeTreat(treat.id);
                                }}>remove</button>
                            </li>
                        )
                    })}
                </ul>
            </>
        ) || (
        <>
            <div>name: <input type="text" onChange={(e) => setAddParams({...addParams, name: e.target.value})}></input></div>
            <div>desc: <input type="text" onChange={(e) => setAddParams({...addParams, desc: e.target.value})}></input></div>
            <div>cals: <input type="number" onChange={(e) => setAddParams({...addParams, cals: e.target.value})}></input></div>
            <button onClick={handleSubmit}>submit</button>
        </>)}
    </>);
}

const treatsLoader = async () => {
    // let treats = await MockTreatsService.getTreats();
    let treats = await TreatsService.getTreats();
    return {
        treats,
    };
}

export {
    treatsLoader
};
export default Treats;