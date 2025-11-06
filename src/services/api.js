export async function fetchRounds() {
    const res = await fetch("http://localhost:5000/rounds");
    if (!res.ok) throw new Error("Не удалось загрузить раунды");
    return res.json();
}

export async function saveRounds(rounds) {
    return fetch('http://localhost:5000/rounds', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rounds)
    });
}
