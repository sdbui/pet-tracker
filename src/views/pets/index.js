import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import './styles.css';
import PetsService from './pets-service';
import { FeedList } from './components/feed-list';
import AddPet from './components/add-pet';


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
    const [showFeed, setShowFeed] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);
    const [addingPet, setAddingPet] = useState(false);

    const today = new Date();
    const year = today.getUTCFullYear();
    const month = today.getUTCMonth() + 1; // month is 0 indexed
    const day = today.getUTCDate();

    function toggleFeed(petId) {
        setSelectedPet(petId);
        setShowFeed((prev) => {
            return !prev;
        })
    }

    async function handleFeed (treat) {
        // treat should have been passed in from child FeedList
        await PetsService.feedPet({
            treatId: treat.id,
            petId: selectedPet,
            amount: 1, // for now, only sending one treat. maybe the treatlist will dictate how many also
        })
        let newPets = await PetsService.getPets();
        setPets(newPets);
        setShowFeed(false);
        setSelectedPet(false);
    }

    async function handleAddPet() {
        // pet should have already been added... simply re fetch list
        let pets = await PetsService.getPets();
        setPets(pets);
        setAddingPet(false);
    }

    return (
        <>
            <header>
                <div className="date">{month} / {day} / {year}</div>
            </header>
            <button onClick={()=>{setAddingPet(true)}}>Add pet</button>
            <ul className="pet-list">
                {pets.map((pet) => {
                    return (
                        <li key={pet.id}>
                            <div className="pet-list-item">
                                <div className="profile-pic">
                                    {<img src={pet.pic || '/paw.png'}></img>}
                                </div>
                                <p>Name: {pet.name}</p>
                                <p>{pet.description}</p>
                                <p>weight: {pet.weight} lbs</p>
                                <p>calories eaten: {pet.totalCalories}</p>
                                <p>treatsEaten: {pet.totalAmount}</p>
                                <button onClick={() => toggleFeed(pet.id)}>Feed me a treat!</button>
                            </div>
                        </li>
                    )
                })}
            </ul>

            {showFeed ? (
                <div className="modal">
                    <FeedList onSelect={handleFeed}></FeedList>
                </div>
            ) : null}

            {addingPet ? (
                <div className="modal">
                    <AddPet onAdd={handleAddPet}
                        onClose={()=>{setAddingPet(false)}}></AddPet>
                </div>
            ) : null}
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