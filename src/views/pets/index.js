import { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import styles from './styles.module.scss';
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
 * FORMULA FOR CALORIES = 70 * (weight in kg)^0.75
 * Lbs to KG = LBS / 2.205
*/

const LBS_TO_KG_RATIO = 1/2.205;

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
            <header className={styles['pets-header']}>
                <div className={styles.date}>{month} / {day} / {year}</div>
            </header>
            <ul className={styles['pet-list']}>
                {pets.map((pet) => {
                    let weightInKg = pet.weight * LBS_TO_KG_RATIO;
                    let maxCals = maxTreatCals(weightInKg);
                    let diff = maxCals - pet.totalCalories;
                    let status = diff < 0 ? 'error' : 'ok';
                    return (
                        <li key={pet.id}>
                            <div className={styles['pet-list-item']}>
                                <div className={styles['profile-pic']}>
                                    {<img src={pet.pic || '/paw.png'}></img>}
                                </div>
                                <p className={styles['pet-name']}>{pet.name}</p>
                                <p className={styles['pet-description']}>{pet.description}</p>
                                <p>{pet.weight} lbs</p>
                                <div className={styles['pet-consumed']}>
                                    <div className={styles[`status--${status}`]}>calories eaten: {pet.totalCalories}</div>
                                    <div>treats eaten: {pet.totalAmount}</div>
                                </div>
                                    <div className={styles['pet-feed']} onClick={() => toggleFeed(pet.id)}>
                                        <span>Feed</span>
                                        <LunchDiningIcon/>
                                        <span>Treat</span>
                                    </div>
                            </div>
                        </li>
                    )
                })}
                <li>
                    <div className={`${styles['pet-list-item']} ${styles['pet-list-item--add']}`} onClick={()=>{setAddingPet(true)}}>
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

// recommended treat is 10% of total day
function maxTreatCals(weightInKg) {
    let totalDayCals = 70 * (weightInKg**(3/4)); // https://vet.osu.edu/vmc/companion/our-services/nutrition-support-service/basic-calorie-calculator
    return totalDayCals / 10; // https://www.akc.org/expert-advice/nutrition/how-many-treats-can-dog-have/
}

const petsLoader = async () => {
    let pets = await PetsService.getPets();
    return pets
}
export {
    petsLoader
}
export default Pets;