import React, { useState, useEffect } from "react";

const settings = {
    maxPlayers: 6,
    maxCategories: 8,
    maxLengthPlayer: 30,
    maxLengthPoints: 10,
    maxLengthCategory: 40,
    maxLengthQuestion: 150,
};

const generateId = () => Math.random().toString(36).slice(2, 11);

function InputText ( {id, text, value, placeholder, maxlength, onChange} ) {
    return (
        <div key={id} className="modal-content-question">
            <span>{text}</span>
            <input
                type="text"
                value={value}
                placeholder={placeholder}
                maxLength={maxlength}
                onChange={onChange}
            />
        </div>
    );
}

function InputWithDelete ( {id, value, placeholder, maxlength, onChange, onDelete} ) {
    return (
        <div key={id} className="modal-content-row">
            <input
                type="text"
                className="modal-content-row__input"
                value={value}
                placeholder={placeholder}
                maxLength={maxlength}
                onChange={onChange}
            />
            <button className="modal-content-row__delete" onClick={() => onDelete(id)}>
                <i className="fas fa-times"></i>
            </button>
        </div>
    );
}

function SettingsCategoryElement ( {category, catIndex, removeCategory, handleCategoryChange} ) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
      setIsCollapsed(prevState => !prevState);
    };

    return (
        <div className="modal-content__block" key={category.id}>
            <InputWithDelete 
                id={category.id} 
                value={category.name}
                placeholder={`Название категории ${catIndex + 1}`}
                maxlength={settings.maxLengthCategory}
                onChange={(e) => handleCategoryChange(category.id, e.target.value)}
                onDelete={removeCategory}
            />
            <button className="modal-content__collapse" onClick={toggleCollapse}>{isCollapsed ? 'Развернуть' : 'Свернуть'}</button>
            {!isCollapsed && category.questions.map((curQuestion, qIndex) => (
                <React.Fragment key={curQuestion.id}>
                    <InputText
                        id={curQuestion.id}
                        text={`${100 * (qIndex + 1)}:`}
                        value={curQuestion.text}
                        placeholder={`Вопрос ${qIndex + 1}`}
                        maxlength={settings.maxLengthQuestion}
                        onChange={(e) =>
                            handleCategoryChange(category.id, null, curQuestion.id, e.target.value, 'text')
                        }
                    />

                    <InputText
                        id={curQuestion.id}
                        text={"Ответ:"}
                        value={curQuestion.answer}
                        placeholder={`Ответ ${qIndex + 1}`}
                        maxlength={settings.maxLengthQuestion}
                        onChange={(e) =>
                            handleCategoryChange(category.id, null, curQuestion.id, e.target.value, 'answer')
                        }
                    />
                </React.Fragment>
            ))}
        </div>
    );
}

function SettingsPlayersBlock ( {playersData, newPlayers, setNewPlayers} ) {

    useEffect(() => {
        setNewPlayers(playersData);
    }, [playersData]);

    const handlePlayerChange = (id, value, type) => {
        const updatedPlayers = [...newPlayers];

        const playerIndex = updatedPlayers.findIndex(player => player.id === id);
        if (playerIndex === -1) {
            console.warn(`Игрок с id: ${id} не найден`);
            return;
        }

        switch (type) {
            case 'name':
                updatedPlayers[playerIndex].name = value;
                break;
            case 'points':
                const parsedValue = value === '' || value === '-' ? value : parseInt(value, 10);
                updatedPlayers[playerIndex].points = isNaN(parsedValue) ? value : parsedValue;
                break;
            default:
                console.warn(`Неизвестный тип: ${type}`);
        }

        setNewPlayers(updatedPlayers);
    };

    const addPlayer = () => {
        if (newPlayers.length < 6) {
        setNewPlayers([
            ...newPlayers,
            { id: generateId(), name: `Игрок ${newPlayers.length + 1}`, points: 0, hasAnswered: false },
        ]);
        }
    };

    const removePlayer = (id) => {
        setNewPlayers(newPlayers.filter((player) => player.id !== id));
    };

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
            <button onClick={addPlayer} className="modal-content__btn--add" disabled={newPlayers.length >= settings.maxPlayers}>
                Добавить игрока
            </button>
        </div>
    );
}

function SettingsCategoryBlock ( {categories, newCategories, setNewCategories} ) {
    
    useEffect(() => {
        setNewCategories(categories);
    }, [categories]);

    const removeCategory = (id) => {
        setNewCategories(newCategories.filter((category) => category.id !== id));
    };

    const addCategory = () => {
        const newCategory = {
            id: generateId(),
            name: `Category ${newCategories.length + 1}`,
            questions: [
                {
                    id: generateId(),
                    questionType: "test",
                    text: `Question ${newCategories.length * 5 + 1}`,
                    answer: `Answer ${newCategories.length * 5 + 1}`
                },
                {
                    id: generateId(),
                    questionType: "test",
                    text: `Question ${newCategories.length * 5 + 2}`,
                    answer: `Answer ${newCategories.length * 5 + 2}`
                },
                {
                    id: generateId(),
                    questionType: "test",
                    text: `Question ${newCategories.length * 5 + 3}`,
                    answer: `Answer ${newCategories.length * 5 + 3}`
                },
                {
                    id: generateId(),
                    questionType: "test",
                    text: `Question ${newCategories.length * 5 + 4}`,
                    answer: `Answer ${newCategories.length * 5 + 4}`
                },
                {
                    id: generateId(),
                    questionType: "test",
                    text: `Question ${newCategories.length * 5 + 5}`,
                    answer: `Answer ${newCategories.length * 5 + 5}`
                }
            ]
        };
    
        setNewCategories([
            ...newCategories,
            newCategory,
        ]);
    };

    const handleCategoryChange = (catId, categoryName, questionId, value, field) => {
        const updatedCategories = [...newCategories];

        const categoryIndex = updatedCategories.findIndex(category => category.id === catId);
        if (categoryIndex === -1) {
            console.warn(`Категория с id: ${catId} не найдена`);
            return;
        }

        if (categoryName) updatedCategories[categoryIndex].name = categoryName;
        if (questionId !== undefined) {
            const questionIndex = updatedCategories[categoryIndex].questions.findIndex(question => question.id === questionId);
            if (questionIndex === -1) {
                console.warn(`Вопрос с id: ${questionId} не найден`);
                return;
            }
            switch (field) {
                case 'text':
                    updatedCategories[categoryIndex].questions[questionIndex].text = value;
                    break;
                case 'answer':
                    updatedCategories[categoryIndex].questions[questionIndex].answer = value;
                    break;
                default:
                    console.warn(`Неизвестное поле: ${field}`);
            }
        }
        setNewCategories(updatedCategories);
    };

    return (
        <div className="modal-content__players">
            <div className="modal-content__subtitle">
                <span>Категории</span>
            </div>
            {newCategories.map((category, catIndex) => (
                <SettingsCategoryElement
                    key={category.id}
                    category={category}
                    catIndex={catIndex}
                    removeCategory={removeCategory}
                    handleCategoryChange={handleCategoryChange}
                />
            ))}
            <button onClick={addCategory} className="modal-content__btn--add" disabled={newCategories.length >= settings.maxCategories}>Добавить категорию</button>
        </div>
    );
}

export default function SettingsModal ({ playersData, categories, saveChanges, closeModal, isModalOpen }) {

    const [newCategories, setNewCategories] = useState(categories);
    const [newPlayers, setNewPlayers] = useState(playersData);

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

                    <SettingsCategoryBlock
                        categories={categories}
                        newCategories={newCategories}
                        setNewCategories={setNewCategories}
                    />
                </div>

                <button className="modal-content__btn--save" onClick={() => saveChanges(newPlayers, newCategories)}>Сохранить изменения</button>
                
            </div>
        </div>
    );
}