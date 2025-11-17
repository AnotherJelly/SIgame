import { useState, useEffect, useReducer } from "react";

import CategoryGrid from "../components/CategoryGrid/Main/Main";
import SettingsModal from "../components/SettingsModal/Main/Main";
import { validateRounds, validatePlayers } from "../utils/validate";
import { fetchRounds, saveRounds } from "../services/api";
import { playersReducer, initialPlayers } from "../hooks/playersReducer";
import Modal from "../components/Modal/Modal";
import Loading from "../components/Loading/Loading";

export function App() {

    const [playersData, dispatchPlayers] = useReducer(playersReducer, initialPlayers);

    // Example Data
    const exampleData = [{"_id":"682f6315277a2d316aa0df13","id":"itkl1oxx8","name":"Round 1","categories":[{"id":"2wehoyetm","name":"Тема 1","questions":[{"id":"xiniwczrq","questionType":"bet","text":"Вопрос 1","answer":"Ответ 1","_id":"682f6315277a2d316aa0df15"},{"id":"fx4b968oj","questionType":"ordinary","text":"Вопрос 2","answer":"Ответ 2","_id":"682f6315277a2d316aa0df16"},{"id":"v9rotiale","questionType":"ordinary","text":"Вопрос 3","answer":"Ответ 3","_id":"682f6315277a2d316aa0df17"},{"id":"ktmje9gkw","questionType":"ordinary","text":"Вопрос 4","answer":"Ответ 4","_id":"682f6315277a2d316aa0df18"},{"id":"cpj1e8mzz","questionType":"cat","text":"Вопрос 5","answer":"Ответ 5","_id":"682f6315277a2d316aa0df19"}],"_id":"682f6315277a2d316aa0df14"}],"__v":0},{"_id":"682f66aa277a2d316aa0df4f","id":"a5hpm7c0o","name":"Round 2","categories":[{"id":"0dy66zpyj","name":"Тема 2","questions":[{"id":"12jut8uxv","questionType":"ordinary","text":"Вопрос 6","answer":"Ответ 6","_id":"682f66aa277a2d316aa0df51"},{"id":"3vd3qie4w","questionType":"ordinary","text":"Вопрос 7","answer":"Ответ 7","_id":"682f66aa277a2d316aa0df52"},{"id":"h9vjhso3m","questionType":"ordinary","text":"Вопрос 8","answer":"Ответ 8","_id":"682f66aa277a2d316aa0df53"},{"id":"7hnomrga4","questionType":"ordinary","text":"Вопрос 9","answer":"Ответ 9","_id":"682f66aa277a2d316aa0df54"},{"id":"dz5px03kh","questionType":"ordinary","text":"Вопрос 10","answer":"Ответ 10","_id":"682f66aa277a2d316aa0df55"}],"_id":"682f66aa277a2d316aa0df50"}],"__v":0}]
    const [rounds, setRounds] = useState(exampleData);
    //const [rounds, setRounds] = useState([]);

    const [error, setError] = useState({isError: false, textError: ""});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function loadRounds() {
            setIsLoading(true);
            try {
                const data = await fetchRounds();
                setRounds(data);
            } catch (err) {
                console.error("Ошибка загрузки:", err);
                setError({isError: true, textError: `Ошибка загрузки: ${err}`});
            } finally {
                setIsLoading(false);
            }
        }
        loadRounds();
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleSaveSettings = async (newPlayers, newRounds) => {

        if (!validateRounds(newRounds)) {
            console.error('Ошибка: данные раундов некорректные. Отправка отменена.');
            setError({isError: true, textError: 'Невозможно сохранить: проверьте все поля раундов, категорий и вопросов.'});
            return;
        }

        if (!validatePlayers(newPlayers)) {
            console.error('Ошибка: данные игроков некорректные. Сохранение отменено.');
            setError({isError: true, textError: 'Невозможно сохранить: проверьте все поля игроков.'});
            return;
        }

        dispatchPlayers({ type: 'SET', payload: newPlayers });
        setRounds(newRounds);
        
        setIsLoading(true);
        try {
            await saveRounds(newRounds);
        } catch (err) {
            console.error("Ошибка сохранения:", err);
            setError({isError: true, textError: `Ошибка сохранения: ${err}`});
        } finally {
            setIsLoading(false);
        }
    
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
                <i className="fas fa-cogs"></i>
                <span>Настройки</span>
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

            {error.isError ? 
                <Modal
                    closeModal={() => setError({isError: false, textError: ""})}
                    isModalOpen={error.isError} 
                    title="Ошибка"
                >
                    <div>{error.textError}</div>
                </Modal>
            : ''}

            {isLoading ? 
                <Loading/>
            : ''}
        </div>
    );
}