const PetsService = {
    addPet: async ({name, description, weight, pic}) => {
        let url = '/api/pets';
        const formData = new FormData();
        formData.append('pic', pic);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('weight', weight);
        let results = await fetch(url, {
            method: 'POST',
            body: formData,
        })
        let json = await results.json()
        return json.data;
    },
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
        return;

    }
}

export default PetsService;