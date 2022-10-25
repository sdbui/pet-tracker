import { useState } from 'react';
import './styles.css';


/** 
 * PET TREAT CALORIE LIMIT
 * Dog should receive no more than 10% of daily calories in form of treats
 * ex: 20lb dog should eat approx 410calories
 *      so for treats... 410 / 10 = 41 calories daily from treats
 *      
 * 
*/

const defaultPets = [
    {
        id: 1,
        name: 'Boo',
        description: 'Cute maltipoo big boi',
        weight: 20,
        treatLimit: null, // this should be calculated from weight not a set value
        caloriesEaten: 0,
        treatsEaten: 0,
        pic: null
    },
    {
        id: 2,
        name: 'Macchi',
        description: 'Handsome shiba',
        weight: 25,
        treatLimit: null, // this should be calculated from weight not a set value
        caloriesEaten: 0,
        treatsEaten: 0,
        pic: null
    },
    {
        id: 3,
        name: 'Char',
        description: 'Pretty shiba',
        weight: 22,
        treatLimit: null, // this should be calculated from weight not a set value
        caloriesEaten: 0,
        treatsEaten: 0,
        pic: null
    },
    {
        id: 4,
        name: 'Koko',
        description: 'Kawawa shiba',
        weight: 20,
        treatLimit: null, // this should be calculated from weight not a set value
        caloriesEaten: 0,
        treatsEaten: 0,
        pic: null
    },
]

function Pets () {

    const [pets, setPets] = useState(defaultPets);

    return (
        <>
            <ul className="pet-list">
                {pets.map((pet) => {
                    return (
                        <li className="pet-list-item" key={pet.id}>
                            <div className="profilePic"></div>
                            <p>Name: {pet.name}</p>
                            <p>{pet.description}</p>
                            <p>weight: {pet.weight} lbs</p>
                            <p>calories eaten: {pet.caloriesEaten}</p>
                            <p>treatsEaten: {pet.treatsEaten}</p>
                        </li>
                    )
                })}
            </ul>

        </>
    )
}

export default Pets;