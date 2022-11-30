import { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import './styles.scss';
import PetsService from './pets-service';
import AddPetDialog from './components/add-pet-dialog';
import FeedPetDialog from './components/feed-pet-dialog';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LunchDiningIcon from '@mui/icons-material/LunchDining';

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
    const [selectedPetId, setSelectedPetId] = useState(null);
    const [feedingName, setFeedingName] = useState('');
    const [addingPet, setAddingPet] = useState(false);

    const today = new Date();
    const year = today.getUTCFullYear();
    const month = today.getUTCMonth() + 1; // month is 0 indexed
    const day = today.getUTCDate();

    useEffect(()=>{
        let pet = pets.find((pet) => {
            return pet.id === selectedPetId;
        });
        if (pet) {
            setFeedingName(pet.name)
        }
    },[selectedPetId])

    function toggleFeed(petId) {
        setSelectedPetId(petId);
        setShowFeed((prev) => {
            return !prev;
        })
    }

    async function handleFeed (treat) {
        // treat should have been passed in from child FeedList
        await PetsService.feedPet({
            treatId: treat.id,
            petId: selectedPetId,
            amount: 1, // for now, only sending one treat. maybe the treatlist will dictate how many also
        })
        let newPets = await PetsService.getPets();
        setPets(newPets);
        setShowFeed(false);
        setSelectedPetId(null);
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
            <ul className="pet-list">
                {pets.map((pet) => {
                    return (
                        <li key={pet.id}>
                            <div className="pet-list-item">
                                <div className="profile-pic">
                                    {<img src={pet.pic || '/paw.png'}></img>}
                                </div>
                                <p className="pet-name">{pet.name}</p>
                                <p className="pet-description">{pet.description}</p>
                                <p>{pet.weight} lbs</p>
                                <div className="pet-consumed">
                                    <div>calories eaten: {pet.totalCalories}</div>
                                    <div>treats eaten: {pet.totalAmount}</div>
                                </div>
                                    <div className="pet-feed" onClick={() => toggleFeed(pet.id)}>
                                        <span>Feed</span>
                                        <LunchDiningIcon/>
                                        <span>Treat</span>
                                    </div>
                            </div>
                        </li>
                    )
                })}
                <li>
                    <div className="pet-list-item pet-list-item--add" onClick={()=>{setAddingPet(true)}}>
                        <AddCircleIcon/>
                    </div>
                </li>
            </ul>

            {showFeed ? (
                <FeedPetDialog name={feedingName} onSubmit={handleFeed} open={showFeed} onClose={()=>{setShowFeed(false)}}></FeedPetDialog>
            ) : null}
            <AddPetDialog onAdd={handleAddPet} open={addingPet} onClose={()=>{setAddingPet(false)}}></AddPetDialog>
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