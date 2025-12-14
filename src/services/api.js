// const url = "http://localhost:5000/rounds";
const url = "https://svoyak.dobryakov.me/rounds";

export async function fetchRounds() {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Не удалось загрузить раунды");
    return res.json();
}

export async function saveRounds(rounds) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rounds)
    });
}
