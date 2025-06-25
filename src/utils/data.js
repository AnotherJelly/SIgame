export const settings = {
    maxPlayers: 6,
    maxRounds: 3,
    maxCategories: 8,
    maxLengthPlayer: 30,
    maxLengthPoints: 10,
    maxLengthCategory: 40,
    maxLengthQuestion: 150,
    timer: 60,
    roundIntroPause: 3000, // 3 sec
    answerTime: 15
};

export const generateId = () => Math.random().toString(36).slice(2, 11);