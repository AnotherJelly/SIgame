export const initialPlayers = [
  { id: 1, name: 'Игрок 1', points: 0, hasAnswered: false },
  { id: 2, name: 'Игрок 2', points: 0, hasAnswered: false },
  { id: 3, name: 'Игрок 3', points: 0, hasAnswered: false },
];

export function playersReducer(state, action) {
  switch (action.type) {
    case 'SET':
      return action.payload;

    case 'AWARD_POINTS':
      return state.map(player =>
        player.id === action.payload.playerId
          ? { ...player, points: player.points + action.payload.value }
          : { ...player, hasAnswered: false }
      );

    case 'DEDUCT_POINTS':
      return state.map(player =>
        player.id === action.payload.playerId
          ? { ...player, points: player.points - action.payload.value, hasAnswered: true }
          : player
      );

    case 'RESET_ANSWERS':
      return state.map(player => ({ ...player, hasAnswered: false }));

    default:
      return state;
  }
}
