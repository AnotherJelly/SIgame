import { useState, useEffect, useReducer } from "react";

import CategoryGrid from "../components/CategoryGrid/Main/Main";
import SettingsModal from "../components/SettingsModal/Main/Main";
import { validateRounds, validatePlayers } from "../utils/validate";
import { fetchRounds, saveRounds } from "../services/api";
import { playersReducer, initialPlayers } from "../hooks/playersReducer";
import Modal from "../components/Modal/Modal";
import Loading from "../components/Loading/Loading";

export function App() {

   const [playersData, dispatchPlayers] = useReducer(
        playersReducer,
        initialPlayers,
        (initial) => {
            const savedPlayers = localStorage.getItem("playersData");
            return savedPlayers ? JSON.parse(savedPlayers) : initial;
        }
    );

    useEffect(() => {
        localStorage.setItem("playersData", JSON.stringify(playersData));
    }, [playersData]);

    // Example Data
    // const exampleData = [{"_id":"682f6315277a2d316aa0df13","id":"itkl1oxx8","name":"Round 1","categories":[{"id":"2wehoyetm","name":"Тема 1","questions":[{"id":"xiniwczrq","questionType":"bet","text":"Вопрос 1","answer":"Ответ 1","_id":"682f6315277a2d316aa0df15"},{"id":"fx4b968oj","questionType":"ordinary","text":"Вопрос 2","answer":"Ответ 2","_id":"682f6315277a2d316aa0df16"},{"id":"v9rotiale","questionType":"ordinary","text":"Вопрос 3","answer":"Ответ 3","_id":"682f6315277a2d316aa0df17"},{"id":"ktmje9gkw","questionType":"ordinary","text":"Вопрос 4","answer":"Ответ 4","_id":"682f6315277a2d316aa0df18"},{"id":"cpj1e8mzz","questionType":"cat","text":"Вопрос 5","answer":"Ответ 5","_id":"682f6315277a2d316aa0df19"}],"_id":"682f6315277a2d316aa0df14"}],"__v":0},{"_id":"682f66aa277a2d316aa0df4f","id":"a5hpm7c0o","name":"Round 2","categories":[{"id":"0dy66zpyj","name":"Тема 2","questions":[{"id":"12jut8uxv","questionType":"ordinary","text":"Вопрос 6","answer":"Ответ 6","_id":"682f66aa277a2d316aa0df51"},{"id":"3vd3qie4w","questionType":"ordinary","text":"Вопрос 7","answer":"Ответ 7","_id":"682f66aa277a2d316aa0df52"},{"id":"h9vjhso3m","questionType":"ordinary","text":"Вопрос 8","answer":"Ответ 8","_id":"682f66aa277a2d316aa0df53"},{"id":"7hnomrga4","questionType":"ordinary","text":"Вопрос 9","answer":"Ответ 9","_id":"682f66aa277a2d316aa0df54"},{"id":"dz5px03kh","questionType":"ordinary","text":"Вопрос 10","answer":"Ответ 10","_id":"682f66aa277a2d316aa0df55"}],"_id":"682f66aa277a2d316aa0df50"}],"__v":0}]
    const [rounds, setRounds] = useState(() => {
        const saved = localStorage.getItem("rounds");
        return saved ? JSON.parse(saved) : [];
    });

    const [error, setError] = useState({isError: false, textError: ""});
    const [isLoading, setIsLoading] = useState(false);

    const [isConfirm, setIsConfirm] = useState(false);
    const [resetKey, setResetKey] = useState(0);
    /*
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
    */

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
        localStorage.setItem("rounds", JSON.stringify(newRounds));

        /*
        setIsLoading(true);
        try {
            await saveRounds(newRounds);
        } catch (err) {
            console.error("Ошибка сохранения:", err);
            setError({isError: true, textError: `Ошибка сохранения: ${err}`});
        } finally {
            setIsLoading(false);
        }
        */
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

    const handleResetGame = () => {
        // localStorage
        localStorage.removeItem("playersData");
        localStorage.removeItem("activeRoundIndex");
        localStorage.removeItem("answeredQuestions");

        // React state
        dispatchPlayers({ type: "SET", payload: initialPlayers });
        setResetKey((k) => k + 1);

        setIsConfirm(false);
    };

    return (
        <div className="App">

            <button className="button-default button-setting" onClick={openModal}>
                <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280.000000 1280.000000" preserveAspectRatio="xMidYMid meet">
                    <g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)" stroke="none">
                        <path d="M5385 12786 c-92 -29 -158 -87 -199 -175 -21 -45 -21 -56 -24 -687 l-3 -640 -102 -29 c-388 -108 -835 -298 -1166 -495 l-85 -51 -465 465 c-439 437 -469 465 -521 482 -82 27 -173 23 -246 -10 -53 -24 -130 -98 -730 -699 -746 -747 -718 -714 -719 -847 0 -142 -17 -120 494 -633 l456 -458 -24 -42 c-132 -236 -243 -467 -329 -682 -59 -148 -154 -435 -189 -570 l-18 -70 -640 -5 -640 -5 -57 -28 c-65 -32 -121 -89 -152 -156 l-21 -46 0 -1005 0 -1005 28 -57 c32 -65 89 -121 156 -152 45 -21 56 -21 691 -24 l645 -3 43 -151 c104 -365 300 -824 477 -1112 l44 -71 -57 -60 c-31 -33 -179 -184 -327 -335 -610 -619 -580 -582 -580 -725 1 -63 6 -90 24 -130 19 -40 160 -187 695 -722 460 -460 685 -678 714 -692 90 -45 197 -47 290 -5 23 11 208 188 497 476 l461 458 114 -65 c328 -187 711 -348 1077 -453 l162 -47 3 -645 c3 -635 3 -646 24 -691 31 -67 87 -124 152 -156 l57 -28 1005 0 1005 0 57 28 c65 32 121 89 152 156 21 45 21 56 24 687 l3 642 62 17 c408 111 818 282 1186 493 l114 65 456 -460 c514 -519 499 -507 636 -507 63 0 91 5 130 23 73 34 1390 1352 1426 1426 34 71 34 200 0 265 -15 30 -174 197 -482 506 l-460 460 56 95 c85 142 235 454 308 639 66 166 148 414 182 547 l19 72 645 3 c636 3 647 3 692 24 67 31 124 87 156 152 l28 57 0 1005 0 1005 -28 57 c-32 65 -89 121 -156 152 -45 21 -56 21 -687 24 l-642 3 -11 44 c-91 360 -280 819 -490 1185 l-71 124 464 466 c520 521 502 498 500 640 -1 134 23 106 -722 852 -595 595 -673 670 -726 694 -73 33 -164 37 -246 10 -52 -17 -82 -45 -520 -482 l-466 -464 -114 66 c-326 187 -741 360 -1117 465 l-122 34 -3 645 c-3 637 -3 646 -25 692 -30 66 -95 132 -156 159 l-52 24 -990 2 c-779 1 -999 -1 -1030 -11z m1160 -4527 c580 -49 1087 -347 1410 -829 71 -106 174 -315 215 -438 220 -653 55 -1381 -425 -1881 -557 -580 -1414 -740 -2135 -400 -392 186 -696 485 -885 874 -110 224 -163 422 -185 680 -14 162 -1 345 35 520 166 798 849 1403 1665 1474 137 12 171 12 305 0z"/>
                    </g>
                </svg>
                <span>Настройки</span>
            </button>

            <button className="button-default button-discard" onClick={() => setIsConfirm(true)}>
                <span>Сбросить игру</span>
            </button>
            
            <SettingsModal
                rounds={rounds}
                playersData={playersData}
                handleSaveSettings={handleSaveSettings}
                closeModal={closeModal}
                isModalOpen={isModalOpen}
                setError={setError}
            />

            <CategoryGrid
                key={resetKey}
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

            {isConfirm ? 
                <Modal
                    closeModal={() => setIsConfirm(false)}
                    isModalOpen={isConfirm} 
                    title="Вы уверены?"
                >
                    <button 
                        type="button" 
                        className="button-default"
                        onClick={handleResetGame}
                    >Сбросить данные</button>
                </Modal>
            : ''}
        </div>
    );
}