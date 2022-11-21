const PetsService = {
    getPets: async () => {
        let url = '/api/pets';
        let results = await fetch(url);
        let json = await results.json();
        return json.data;
    },
    feedPet: async ({petId, treatId, amount}) => {
        let url = '/api/pets/feed';
        let postBody = { petId, treatId, amount };
        let results = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postBody)
        })

    }
}

export default PetsService;