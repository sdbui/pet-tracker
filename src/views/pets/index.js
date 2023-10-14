import { useEffect, useState, useSyncExternalStore } from 'react';
import { useLoaderData } from 'react-router-dom';
import styles from './styles.module.scss';
import PetsService from './pets-service';
import AddPetDialog from './components/add-pet-dialog';
import FeedPetDialog from './components/feed-pet-dialog';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import Card from '@mui/joy/Card';
import Button from '@mui/joy/Button';

import Grid from '@mui/joy/Grid';
import { Typography, useColorScheme } from '@mui/joy';
import Box from '@mui/system/Box';
import Stack from '@mui/joy/Stack';

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
    const {mode} = useColorScheme();
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
                <Typography fontSize="3rem">{month} / {day} / {year}</Typography>
            </header>
            <Grid container justifyContent="center" spacing={4}>
                {pets.map((pet) => {
                    let weightInKg = pet.weight * LBS_TO_KG_RATIO;
                    let maxCals = maxTreatCals(weightInKg);
                    let diff = maxCals - pet.totalCalories;
                    let status = diff < 0 ? 'error' : 'ok';
                    return (
                            <Grid key={pet.name}>
                                <Card sx={{ width: 320 }} key={pet.name}>
                                    <div className={styles['profile-pic']}>
                                        {<img src={pet.pic || '/paw.png'}></img>}
                                    </div>
                                    <Box sx={{display: 'flex', justifyContent:'space-between', alignItems: 'end'}}>
                                        <Typography level="h2">{pet.name}</Typography>
                                        <Typography level="title-md">{pet.weight} lbs</Typography>
                                    </Box>
                                    <Box sx={{height: '50px', display: 'flex', alignItems:'center', justifyContent:'center', textAlign: 'center'}}>
                                        <span className={styles['pet-description']}>{pet.description}</span>
                                    </Box>
                                    <div className={styles['pet-consumed']}>
                                        <Stack>
                                            <Typography level="title-md">Treats</Typography>
                                            <Typography level="h3">{pet.totalAmount}</Typography>
                                        </Stack>
                                        <Stack>
                                            <Typography level="title-md" color={status === 'error' ? 'danger' : 'success'}>Calories</Typography>
                                            <Typography color={status === 'error' ? 'danger' : 'success'} level="h3">{pet.totalCalories}</Typography>
                                        </Stack>
                                    </div>
                                    <Button
                                        variant="solid"
                                        size="lg"
                                        color={status === 'error' ? 'danger' : 'primary'} 
                                        aria-label="Feed Pet"
                                        onClick={() => toggleFeed(pet.id)}
                                        sx={{ display: 'flex', width: 200, alignSelf: 'center'}}
                                    >
                                        Feed a Treat
                                    </Button>
                                </Card>

                            </Grid>
                    )
                })}
                <Grid>
                    <Card sx={{ width: 320, height: '100%', alignItems:'center', justifyContent:'center'}}>
                        <div className={`${styles['add-card']} ${mode === 'light' ? styles['light'] : ''}`}onClick={()=>{setAddingPet(true)}}>
                            <AddCircleIcon/>
                        </div>
                    </Card>
                </Grid>
 
            </Grid>
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