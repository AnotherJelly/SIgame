import { useState, useEffect } from "react";

import { SettingsPlayersBlock } from "./SettingsPlayersBlock";
import { SettingsRoundBlock } from "./SettingsRoundBlock";

export default function SettingsModal ({ rounds, playersData, handleSaveSettings, closeModal, isModalOpen }) {

    const [newRounds, setNewRounds] = useState(rounds);
    const [newPlayers, setNewPlayers] = useState(playersData);
    
    useEffect(() => {
        if (isModalOpen) {
            setNewRounds(rounds);
            setNewPlayers(playersData);
        }
    }, [isModalOpen]);

    return (
        <div className={`modal-overlay ${isModalOpen ? "open" : ""}`}>
            <div className="modal-background" onClick={closeModal}></div>
            <div className="modal-content">
                <div className="modal-content__title">
                    <span>Настройки</span>
                    <button onClick={closeModal}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="modal-content__main">
                    <SettingsPlayersBlock 
                        playersData={playersData}
                        newPlayers={newPlayers}
                        setNewPlayers={setNewPlayers}
                    />
                    <SettingsRoundBlock
                        rounds={rounds}
                        newRounds={newRounds}
                        setNewRounds={setNewRounds}
                    />
                </div>

                <button className="modal-content__btn--save" onClick={() => handleSaveSettings(newPlayers, newRounds)}>Сохранить изменения</button>
                
            </div>
        </div>
    );
}