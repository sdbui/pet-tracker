const PetsService = {
    getPets: async () => {
        let url = '/api/pets';
        let results = await fetch(url);
        let json = await results.json();
        return json.data;
    }
}

export default PetsService;