import './styles.css';
import { useEffect, useReducer } from 'react';
import TreatsService from '../../../treats/treats-service';

const feedReducer = (state, action) => {
    switch(action.type) {
        case 'setLoading':
            return {...state, loading: action.payload}
        case 'setList':
            return {...state, list: action.payload}
        default:
            console.log('ACTION NOT SUPPORTED');
            return state;
    }
}

const defaultState = {
    loading: true,
    list: [],
}

function FeedList ({onSelect}) {
    const [feedState, dispatchFeed] = useReducer(feedReducer, defaultState)

    useEffect(() => {
        (async () => {
            let treats = await TreatsService.getTreats();
            dispatchFeed({
                type: 'setList',
                payload: treats,
            });
            dispatchFeed({
                type: 'setLoading',
                payload: false,
            })
        })()
    },[]); // only once

    

    return (
        <div>
            <ul>
                {feedState.list.map((item,idx) => (
                    <li onClick={()=> {onSelect(item)}} key={idx}>{item?.name}</li>
                ))}
            </ul>
        </div>
    )
}

export {FeedList};