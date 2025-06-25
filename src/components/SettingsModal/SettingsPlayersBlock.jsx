import React, { useEffect, useCallback } from "react";

import { InputText } from "./InputText";
import { InputWithDelete } from "./InputWithDelete";
import { settings, generateId } from "../../utils/data";

export const SettingsPlayersBlock = React.memo(function SettingsPlayersBlock ( {playersData, newPlayers, setNewPlayers} ) {

    useEffect(() => {
        setNewPlayers(playersData);
    }, [playersData]);

    const handlePlayerChange = useCallback((id, value, type) => {
        setNewPlayers(prevPlayers => {
            return prevPlayers.map(player => {
                if (player.id !== id) return player;
                if (type === 'name') {
                    return { ...player, name: value };
                } else if (type === 'points') {
                    const parsed = value === '' || value === '-' ? value : parseInt(value, 10);
                    const newPoints = isNaN(parsed) ? value : parsed;
                    return { ...player, points: newPoints };
                }
                return player;
            });
        });
    }, [setNewPlayers]);

    const addPlayer = useCallback(() => {
        setNewPlayers(prev => [
            ...prev,
            { id: generateId(), name: `Игрок ${prev.length + 1}`, points: 0, hasAnswered: false }
        ]);
    }, [setNewPlayers]);

    const removePlayer = useCallback(id => {
        setNewPlayers(prev => prev.filter(p => p.id !== id));
    }, [setNewPlayers]);

    return (
        <div className="modal-content__players">
            <div className="modal-content__subtitle">
                <span>Игроки</span>
            </div>
            {newPlayers.map((player, index) => (
                <div key={player.id}>
                    <InputWithDelete 
                        id={player.id} 
                        value={player.name}
                        placeholder={`Имя игрока ${index + 1}`}
                        maxlength={settings.maxLengthPlayer}
                        onChange={(e) => handlePlayerChange(player.id, e.target.value, 'name')}
                        onDelete={removePlayer}
                    />
                    <InputText
                        id={player.id}
                        text={"Очки"}
                        value={player.points}
                        placeholder={`Изменить очки ${player.name}`}
                        maxlength={settings.maxLengthPoints}
                        onChange={(e) => handlePlayerChange(player.id, e.target.value, 'points')}
                    />
                </div>
            ))}
            <button onClick={addPlayer} className="modal-content__btn--add" disabled={newPlayers.length > settings.maxPlayers}>
                Добавить игрока
            </button>
        </div>
    );
});