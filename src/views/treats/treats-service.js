const TreatsService = {
    getTreats: async () => {
        let url = '/api/treats';
        let results = await fetch(url);
        let json = await results.json();
        return json.data;
    },
    deleteTreat: async (treatId) => {
        let url = `/api/treats/${treatId}`;
        let results = await fetch(url, {
            method: 'DELETE'
        })
        let json = await results.json();
        return json.message;
    },
    addTreat: async (newTreat) => {
        let url = '/api/treats';
        let results = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTreat),
        })
        let json = await results.json();
        return json.message;
    },
    updateTreat: async (params) => {
        let url = `/api/treats/${params.id}`;
        let results = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        })
        let json = await results.json();
        return json.message;
    },
}

export default TreatsService;