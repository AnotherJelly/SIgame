import { useState, useEffect } from "react";

import { PlayersBlock } from "../PlayersBlock/PlayersBlock";
import { RoundBlock } from "../RoundBlock/RoundBlock";
import Modal from "../../Modal/Modal";
import style from './Main.module.css';
import { handleExport, handleImport } from "../../../services/files";

export default function SettingsModal ({ rounds, playersData, handleSaveSettings, closeModal, isModalOpen, setError }) {

    const [newRounds, setNewRounds] = useState(rounds);
    const [newPlayers, setNewPlayers] = useState(playersData);
    
    useEffect(() => {
        if (isModalOpen) {
            setNewRounds(rounds);
            setNewPlayers(playersData);
        }
    }, [isModalOpen]);

    return (
        <Modal
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            title={'Настройки'}
        >
            <div className={style.main}>
                <PlayersBlock 
                    playersData={playersData}
                    newPlayers={newPlayers}
                    setNewPlayers={setNewPlayers}
                />
                <RoundBlock
                    rounds={rounds}
                    newRounds={newRounds}
                    setNewRounds={setNewRounds}
                />
            </div>
            
            <div className={style.fileButtons}>
                <label className={style.fileExport}>
                    Импорт
                    <input type="file" onChange={(e) => handleImport(e, setNewRounds, setError)}  />
                </label>
                <button className={style.fileExport} type="button" onClick={(e) => handleExport(e, newRounds, setError)}>
                    Экспорт
                </button>
            </div>

            <button 
                className={style.buttonSave} 
                onClick={() => handleSaveSettings(newPlayers, newRounds)}
            >Сохранить изменения</button>
        </Modal>
    );
}