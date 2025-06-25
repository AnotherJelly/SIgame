export function validateRounds (rounds) {
    if (!Array.isArray(rounds)) return false;

    for (const round of rounds) {
        if (typeof round !== 'object' || round === null) return false;
        if (typeof round.id !== 'string' || round.id.trim() === '') return false;
        if (typeof round.name !== 'string' || round.name.trim() === '') return false;
        if (!Array.isArray(round.categories)) return false;

        for (const category of round.categories) {
            if (typeof category !== 'object' || category === null) return false;
            if (typeof category.id !== 'string' || category.id.trim() === '') return false;
            if (typeof category.name !== 'string' || category.name.trim() === '') return false;
            if (!Array.isArray(category.questions)) return false;

            for (const question of category.questions) {
                if (typeof question !== 'object' || question === null) return false;
                if (typeof question.id !== 'string' || question.id.trim() === '') return false;
                if (typeof question.questionType !== 'string' || question.questionType.trim() === '') return false;
                if (typeof question.text !== 'string' || question.text.trim() === '') return false;
                if (typeof question.answer !== 'string' || question.answer.trim() === '') return false;
            }
        }
    }

    return true;
};

export function validatePlayers (players) {
    if (!Array.isArray(players)) return false;

    for (const player of players) {
      if (typeof player !== 'object' || player === null) return false;

      if (typeof player.id !== 'number' || !Number.isFinite(player.id)) return false;
      if (typeof player.name !== 'string' || player.name.trim() === '') return false;
      if (typeof player.points !== 'number' || !Number.isFinite(player.points)) return false;
      if (typeof player.hasAnswered !== 'boolean') return false;
    }

    return true;
};