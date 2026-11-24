export async function endTurn(gameId: number) {
    const response = await fetch('/api/end-turn', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            gameId: gameId,
        })
    });

    const data = await response.json();
    return data;
}