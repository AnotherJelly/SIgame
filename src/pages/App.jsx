import { useState, useEffect, useReducer } from "react";

import CategoryGrid from "../components/CategoryGrid/CategoryGrid";
import SettingsModal from "../components/SettingsModal/SettingsModal";
import { validateRounds, validatePlayers } from "../utils/validate";
import { fetchRounds, saveRounds } from "../services/api";
import { playersReducer, initialPlayers } from "../hooks/playersReducer";

export function App() {

    const [playersData, dispatchPlayers] = useReducer(playersReducer, initialPlayers);

    const [rounds, setRounds] = useState([]);

    useEffect(() => {
        async function loadRounds() {
            try {
                const data = await fetchRounds();
                setRounds(data);
            } catch (err) {
                console.error("Ошибка загрузки:", err);
            }
        }

        loadRounds();
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleSaveSettings = (newPlayers, newRounds) => {

        if (!validateRounds(newRounds)) {
            console.error('Ошибка: данные раундов некорректные. Отправка отменена.');
            alert('Невозможно сохранить: проверьте все поля раундов, категорий и вопросов.');
            return;
        }

        if (!validatePlayers(newPlayers)) {
            console.error('Ошибка: данные игроков некорректные. Сохранение отменено.');
            alert('Невозможно сохранить: проверьте все поля игроков.');
            return;
        }

        dispatchPlayers({ type: 'SET', payload: newPlayers });
        setRounds(newRounds);
        
        saveRounds(newRounds);
    
        closeModal();
    };

    const handleAwardPoints = (playerId, selectedQuestionValue) => {
        dispatchPlayers({ type: 'AWARD_POINTS', payload: { playerId, value: selectedQuestionValue } });
    };

    const handleDeductPoints = (playerId, selectedQuestionValue) => {
        dispatchPlayers({ type: 'DEDUCT_POINTS', payload: { playerId, value: selectedQuestionValue } });
    };

    const handleResetAnswers = (updatedPlayers) => {
        if (updatedPlayers) {
            dispatchPlayers({ type: 'SET', payload: updatedPlayers });
        } else {
            dispatchPlayers({ type: 'RESET_ANSWERS' });
        }
    };
    
    return (
        <div className="App">

            <button className="button-setting" onClick={openModal}>
                <i className="fas fa-cogs"></i> Настройки
            </button>

            <SettingsModal
                rounds={rounds}
                playersData={playersData}
                handleSaveSettings={handleSaveSettings}
                closeModal={closeModal}
                isModalOpen={isModalOpen}
            />

            <CategoryGrid 
                playersData={playersData}
                rounds={rounds}
                onAwardPoints={handleAwardPoints}
                onDeductPoints={handleDeductPoints}
                resetAnswers={handleResetAnswers}
            />

        </div>
    );
}