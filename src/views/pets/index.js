import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import './styles.css';
import PetsService from './pets-service';


/** 
 * PET TREAT CALORIE LIMIT
 * Dog should receive no more than 10% of daily calories in form of treats
 * ex: 20lb dog should eat approx 410calories
 *      so for treats... 410 / 10 = 41 calories daily from treats
 *      
 * 
*/


function Pets () {
    const [pets, setPets] = useState(useLoaderData());


    function testFeed(pet) {
        PetsService.feedPet({
            treatId: 1,
            petId: pet.id,
            amount: 1,
        });
    }

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
                            <button onClick={() => {testFeed(pet)}}> feed dog test!</button>
                        </li>
                    )
                })}
            </ul>

        </>
    )
}

const petsLoader = async () => {
    let pets = await PetsService.getPets();
    return pets
}
export {
    petsLoader
}
export default Pets;