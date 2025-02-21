import React, { useState, useEffect } from "react";

import SettingsModal from './SettingsModal';
import CategoryGrid from './CategoryGrid';

export function App() {

    const [playersData, setPlayersData] = useState([
        { id: 1, name: 'Игрок 1', points: 0, hasAnswered: false },
        { id: 2, name: 'Игрок 2', points: 0, hasAnswered: false },
        { id: 3, name: 'Игрок 3', points: 0, hasAnswered: false },
    ]);

   
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/categories")
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error("Ошибка загрузки:", err));
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const saveChanges = (newPlayers, newCategories) => {
        setPlayersData(newPlayers);
        setCategories(newCategories);
    
        fetch('http://localhost:5000/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCategories)
        })
            .then(response => response.text())
            .catch(error => console.error('Ошибка при отправке POST-запроса:', error));
    
        closeModal();
    };

    const handleAwardPoints = (playerId, selectedQuestionValue) => {
        setPlayersData((prevPlayers) =>
            prevPlayers.map((player) =>
                player.id === playerId
                ? { ...player, points: player.points + selectedQuestionValue }
                : { ...player, hasAnswered: false }
            )
        );
    };
        
    const handleDeductPoints = (playerId, selectedQuestionValue) => {
        setPlayersData((prevPlayers) =>
            prevPlayers.map((player) =>
                player.id === playerId
                ? { ...player, points: player.points - selectedQuestionValue, hasAnswered: true }
                : player
            )
        );
    };

    const handleResetAnswers = () => {
        setPlayersData((prevPlayers) =>
            prevPlayers.map((player) => ({ ...player, hasAnswered: false }))
        );
    };
    
    return (
        <div className="App">

            <button className="button-setting" onClick={openModal}>
                <i className="fas fa-cogs"></i> Настройки
            </button>

            <SettingsModal
                playersData={playersData}
                categories={categories}
                saveChanges={saveChanges}
                closeModal={closeModal}
                isModalOpen={isModalOpen}
            />

            <CategoryGrid 
                playersData={playersData} 
                categories={categories}
                onAwardPoints={handleAwardPoints}
                onDeductPoints={handleDeductPoints}
                resetAnswers={handleResetAnswers}
            />
        </div>
    );
}