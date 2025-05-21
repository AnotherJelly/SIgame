import React, { useState, useEffect } from "react";

const settings = {
    maxPlayers: 6,
    maxRounds: 3,
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

function SettingsCategoryElement ( {category, catIndex, removeCategory, handleCategoryChange, roundIndex} ) {
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
                    <div className="modal-content-block__question">
                        <InputText
                            id={curQuestion.id}
                            text={`${100 * (roundIndex + 1) * (qIndex + 1)}:`}
                            value={curQuestion.text ?? ''}
                            placeholder={`Вопрос ${qIndex + 1}`}
                            maxlength={settings.maxLengthQuestion}
                            onChange={(e) =>
                                handleCategoryChange(category.id, null, curQuestion.id, e.target.value, 'text')
                            }
                        />                        
                        <select 
                            value={curQuestion.questionType}
                            onChange={(e) =>
                                handleCategoryChange(category.id, null, curQuestion.id, e.target.value, 'questionType')
                            }>
                            <option value="ordinary" selected>Стандартный</option>
                            <option value="cat">Кот в мешке</option>
                            <option value="bet">Со ставкой</option>
                        </select>
                    </div>
                    <InputText
                        id={curQuestion.id}
                        text={"Ответ:"}
                        value={curQuestion.answer ?? ''}
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
        if (newPlayers.length < settings.maxPlayers) {
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
            <button onClick={addPlayer} className="modal-content__btn--add" disabled={newPlayers.length > settings.maxPlayers}>
                Добавить игрока
            </button>
        </div>
    );
}

function SettingsCategoryBlock ( { id, roundIndex, categories, setNewCategories, removeRound } ) {

    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };
    
    useEffect(() => {
        setNewCategories(categories, roundIndex);
    }, [categories]);

    const removeCategory = (id) => {
        setNewCategories(categories.filter((category) => category.id !== id), roundIndex);
    };

    const addCategory = () => {
        const newCategory = {
            id: generateId(),
            name: `Category ${categories.length + 1}`,
            questions: [
                {
                    id: generateId(),
                    questionType: "ordinary",
                    text: `Question ${categories.length * 5 + 1}`,
                    answer: `Answer ${categories.length * 5 + 1}`
                },
                {
                    id: generateId(),
                    questionType: "ordinary",
                    text: `Question ${categories.length * 5 + 2}`,
                    answer: `Answer ${categories.length * 5 + 2}`
                },
                {
                    id: generateId(),
                    questionType: "ordinary",
                    text: `Question ${categories.length * 5 + 3}`,
                    answer: `Answer ${categories.length * 5 + 3}`
                },
                {
                    id: generateId(),
                    questionType: "ordinary",
                    text: `Question ${categories.length * 5 + 4}`,
                    answer: `Answer ${categories.length * 5 + 4}`
                },
                {
                    id: generateId(),
                    questionType: "ordinary",
                    text: `Question ${categories.length * 5 + 5}`,
                    answer: `Answer ${categories.length * 5 + 5}`
                }
            ]
        };
    
        setNewCategories([
            ...categories,
            newCategory,
        ], roundIndex);
    };

    const handleCategoryChange = (catId, categoryName, questionId, value, field) => {
        const updatedCategories = [...categories];

        const categoryIndex = updatedCategories.findIndex(category => category.id === catId);
        if (categoryIndex === -1) {
            console.warn(`Категория с id: ${catId} не найдена`);
            return;
        }

        if (categoryName !== undefined && categoryName !== null) updatedCategories[categoryIndex].name = categoryName;
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
                case 'questionType':
                    updatedCategories[categoryIndex].questions[questionIndex].questionType = value;
                    break;
                default:
                    console.warn(`Неизвестное поле: ${field}`);
            }
        }
        setNewCategories(updatedCategories, roundIndex);
    };

    return (
        <div className="modal-content__players">
            <div className="modal-content__subtitle">
                <div className="modal-content__subtitle--delete">
                    <span>Раунд {roundIndex + 1}</span>
                    <button className="" onClick={() => removeRound(id)}><i className="fas fa-times"></i></button>
                </div>
                <button className="modal-content__collapse" onClick={toggleCollapse}>{isCollapsed ? 'Развернуть' : 'Свернуть'}</button>
            </div>
            {!isCollapsed && (
                <>
                    {categories.map((category, catIndex) => (
                        <SettingsCategoryElement
                            key={category.id}
                            category={category}
                            catIndex={catIndex}
                            removeCategory={removeCategory}
                            handleCategoryChange={handleCategoryChange}
                            roundIndex={roundIndex}
                        />
                    ))}
                    <button onClick={addCategory} className="modal-content__btn--add" disabled={categories.length >= settings.maxCategories}>Добавить категорию</button>
                </>
            )}
        </div>
    );
}

function SettingsRoundBlock ( { rounds, newRounds, setNewRounds } ) {

    useEffect(() => {
        setNewRounds(rounds);
    }, [rounds]);

    const removeRound = (id) => {
        setNewRounds(newRounds.filter((round) => round.id !== id));
    };

    const addRound = () => {
        const newRound = {
            id: generateId(),
            name: `Round ${newRounds.length + 1}`,
            categories: [
                {
                    id: generateId(),
                    name: `Category`,
                    questions: [
                        {
                            id: generateId(),
                            questionType: "test",
                            text: `Question`,
                            answer: `Answer`
                        },
                        {
                            id: generateId(),
                            questionType: "test",
                            text: `Question`,
                            answer: `Answer`
                        },
                        {
                            id: generateId(),
                            questionType: "test",
                            text: `Question`,
                            answer: `Answer`
                        },
                        {
                            id: generateId(),
                            questionType: "test",
                            text: `Question`,
                            answer: `Answer`
                        },
                        {
                            id: generateId(),
                            questionType: "test",
                            text: `Question`,
                            answer: `Answer`
                        }
                    ]
                }
            ]
        };
    
        setNewRounds([
            ...newRounds,
            newRound,
        ]);
    };

    const setNewCategories = (updatedCategories, roundIndex) => {
        const updatedRounds = [...newRounds];
        updatedRounds[roundIndex] = {
            ...updatedRounds[roundIndex],
            categories: updatedCategories,
        };
        setNewRounds(updatedRounds);
    }

    return (
        <div className="modal-content__players">
            {newRounds.map((round, roundIndex) => (
                <SettingsCategoryBlock
                    key={round.id}
                    id={round.id}
                    roundIndex={roundIndex}
                    categories={round.categories}
                    setNewCategories={setNewCategories}
                    removeRound={removeRound}
                />
            ))}
            <button onClick={addRound} className="modal-content__btn--add modal-content__btn--wide" disabled={newRounds.length >= settings.maxRounds}>Добавить раунд</button>
        </div>
    );
}

export default function SettingsModal ({ rounds, playersData, saveChanges, closeModal, isModalOpen }) {

    const [newRounds, setNewRounds] = useState(rounds);
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

                    <SettingsRoundBlock
                        rounds={rounds}
                        newRounds={newRounds}
                        setNewRounds={setNewRounds}
                    />
                </div>

                <button className="modal-content__btn--save" onClick={() => saveChanges(newPlayers, newRounds)}>Сохранить изменения</button>
                
            </div>
        </div>
    );
}