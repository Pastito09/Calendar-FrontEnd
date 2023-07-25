export const events = [
    {
        id: '1',
        start: new Date('2023-04-24 13:00:00'),
        end: new Date('2023-04-24 15:00:00'),
        title: 'Cumpleaños de Patricio',
        notes: 'Alguna nota'
    },
    {
        id: '2',
        start: new Date('2023-05-15 13:00:00'),
        end: new Date('2023-05-15 15:00:00'),
        title: 'Cumpleaños de Natalia',
        notes: 'Alguna nota de Natalia'
    }
];


export const initialState = {
    isLoadingEvents: true,
    events: [],
    activeEvent: null,
}

export const calendarWithEventsState = {
    isLoadingEvents: false,
    events: [ ...events ],
    activeEvent: null,
}

export const calendarWithActiveEventsState = {
    isLoadingEvents: false,
    events: [ ...events ],
    activeEvent: { ...events[0] },
}