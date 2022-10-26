const defaultTreats = [
    {
        id: 1,
        name: 'stick',
        description: 'for chewing and teeth health',
        calories: 10,
        tags: [],
    },
    {
        id: 2,
        name: 'nubz',
        description: 'from costco',
        calories: 20,
        tags: [],
    },
    {
        id: 3,
        name: 'baconbits',
        description: 'soft little bacon chews',
        calories: 15,
        tags: [],
    },
]

const MockTreatsService = {
    getTreats: async () => {
        await wait(1000);
        return defaultTreats;
    }
}

function wait (time) {
    return new Promise((res, rej) => {
        setTimeout(()=>res(), time);
    });
}


export default MockTreatsService;