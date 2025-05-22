import React, { useState, useEffect } from "react";

const settingsApp = {
    timer: 60,
    roundIntroPause: 3000, // 3 sec
    answerTime: 15
};

function Button({ value, question, onClick, isButtonBlinking }) {
  
    return (
        <div className="button-block">
            <button className={`button-table ${isButtonBlinking ? "blinking-button" : ""}`} onClick={() => {onClick(value, question)}}>
                {value}
            </button>
        </div>
    );
}

function Category({ name, questions, onClick, answeredQuestions, questionText, roundIndex }) {
    return (
        <>
            <div className="category-title">{name}</div>
            {questions.map((question, index) => {
                if (answeredQuestions.includes(question.id)) {
                    return <div key={question.id} className="button-block"></div>;
                }
                return (
                    <Button
                        key={question.id}
                        value={100 * (roundIndex + 1) * (index + 1)}
                        question={question}
                        onClick={onClick}
                        isButtonBlinking={questionText === question}
                    />
                );
            })}
        </>
    );
}

function Player({ 
    player, onAwardPoints, onDeductPoints, isQuestionSelected, setIsTimerPaused, 
    answerTime, specialQuestionType, handleSpecialLabelStart, bets, onBetChange, isEveryoneNull
}) {
    const [isCanAnswer, setisCanAnswer] = useState(false);

    useEffect(() => {
        setisCanAnswer(false);
    }, [isQuestionSelected]);

    const canBet = specialQuestionType === "bet" && (isEveryoneNull || player.points > 0);

    const handleCanAnswer = () => {
        if (specialQuestionType === "cat" || specialQuestionType === "bet") {
            handleSpecialLabelStart(player.id);
        }
        setIsTimerPaused(true);
        setisCanAnswer(true);
    };
    
    return (
        <div className="player">
            {specialQuestionType === 'bet' && player.points > 0 && (
                <input
                    type="number"
                    min={0}
                    max={player.points}
                    value={bets[player.id] || ''}
                    onChange={(e) => onBetChange(player.id, Number(e.target.value))}
                />
            )}
            {isQuestionSelected && !(player.hasAnswered) && isCanAnswer && (
                <>
                    <div className="player-timer">
                        <div className="player-timer__line" style={{
                            animation: `slide-out ${answerTime}s linear forwards`
                        }}></div>
                    </div>
                    <div className="block-icons">
    
                        <button className="button-icons" onClick={() => onAwardPoints(player.id)}>
                            <i className="fas fa-check"></i>
                        </button>
                        
                        <button className="button-icons" onClick={() => onDeductPoints(player.id)}>
                            <i className="fas fa-times"></i>
                        </button>
    
                    </div>
                </>
            )}
            {/*((isShowAnswer && player.hasAnswered) || (isCanAnswer && isQuestionSelected)) && (
                <textarea disabled={player.hasAnswered || isShowAnswer}></textarea>
            )*/}
            {isQuestionSelected && !isCanAnswer && !player.hasAnswered && (canBet || specialQuestionType !== "bet") && (
                <button className="button-answer" onClick={handleCanAnswer}>Ответить</button>
            )}
            <div className="player-block">{player.name}</div>
            <div className="player-block player-block__score">{player.points}</div>
        </div>
    );
}

function Timer({timer, isTimerPaused}) {
    const [time, setTime] = useState(timer);

    useEffect(() => {
        if (time > 0 && !isTimerPaused) {
            const timer = setInterval(() => {
                setTime(prevTime => prevTime - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [time, isTimerPaused]);

    return <div className="timer">{time}</div>;
}

export default  function CategoryGrid({ playersData, rounds, onAwardPoints, onDeductPoints, resetAnswers }) {
  
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const [isButtonBlinking, setIsButtonBlinking] = useState(null);
    const [isQuestionSelected, setIsQuestionSelected] = useState(null);

    const [isShowAnswer, setIsShowAnswer] = useState(false);
    const [isShowTimer, setIsShowTimer] = useState(true);
    const [isDisabledCloseBtn, setIsDisabledCloseBtn] = useState(false);

    const [activeRoundIndex, setActiveRoundIndex] = useState(0);
    const [roundIntroText, setRoundIntroText] = useState('Раунд 1');
    const [showRoundIntro, setShowRoundIntro] = useState(true);

    const [isTimerPaused, setIsTimerPaused] = useState(false);

    const [specialLabel, setSpecialLabel] = useState(null);

    const [bets, setBets] = useState({});
    const isEveryoneNull = playersData.every(player => player.points <= 0);
    const handleBetChange = (playerId, betValue) => {
        setBets(prev => {
            if (betValue > playersData.find(p => p.id === playerId).points) {
                return prev;
            }
            return { ...prev, [playerId]: betValue };
        });
    };

    const nextRound = () => {
        setRoundIntroText(`Раунд ${activeRoundIndex + 2}`);
        setShowRoundIntro(true);
        setTimeout(() => {
            setActiveRoundIndex(prev => prev + 1);
            setShowRoundIntro(false);
        }, settingsApp.roundIntroPause);
    };

    useEffect(() => {
        const timer = setTimeout(() => setShowRoundIntro(false), settingsApp.roundIntroPause);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const allQuestions = rounds[activeRoundIndex]?.categories.flatMap(cat => cat.questions) || [];
        const allAnswered = allQuestions.every(q => answeredQuestions.includes(q.id));
    
        if (allAnswered && activeRoundIndex < rounds.length - 1) {
            nextRound();
        } else if (allAnswered && activeRoundIndex == rounds.length - 1) {
            setRoundIntroText(`Конец игры`);
            setShowRoundIntro(true);
        }
    }, [answeredQuestions, activeRoundIndex, rounds]);

    const handleAward = (playerId) => {
        if (!selectedQuestion) return;

        let value = selectedQuestion.value;
        if (selectedQuestion.question.questionType === 'bet') {
            const betValues = Object.values(bets);
            const maxBet = betValues.length > 0 ? Math.max(...betValues) : 0;
            value = maxBet > 0 ? maxBet : selectedQuestion.value;
            setBets({});
        }

        onAwardPoints(playerId, value);

        handleShowAnswer();
        setIsDisabledCloseBtn(true);
        setIsTimerPaused(false);
        setTimeout(() => {
            setIsDisabledCloseBtn(false);
            setIsShowAnswer(false);
            setAnsweredQuestions(prev => [...prev, selectedQuestion.question.id]);
            setSelectedQuestion(null);
        }, 5000);
    };

    const handleDeduct = (playerId) => {
        if (!selectedQuestion) return;

        const questionTypeBet = selectedQuestion.question.questionType === 'bet';
        const questionTypeCat = selectedQuestion.question.questionType === 'cat';

        let value = selectedQuestion.value;
        if (questionTypeBet) {
            const betValues = Object.values(bets);
            const maxBet = betValues.length > 0 ? Math.max(...betValues) : 0;
            value = maxBet > 0 ? maxBet : selectedQuestion.value;
            setBets({});
        }

        onDeductPoints(playerId, value);
        setIsTimerPaused(false);
        if (questionTypeBet || questionTypeCat) {
            handleShowAnswer();
            setIsDisabledCloseBtn(true);

            setTimeout(() => {
                setIsDisabledCloseBtn(false);
                setIsShowAnswer(false);
                setAnsweredQuestions(prev => [...prev, selectedQuestion.question.id]);
                setSelectedQuestion(null);
                resetAnswers();
            }, 5000);
        }
    };

    const handleButtonClick = (value, question) => {
        setIsButtonBlinking(question);
        setTimeout(() => {
            setIsButtonBlinking(null);
            setIsQuestionSelected(true);
            if (!answeredQuestions.includes(question.id)) {
                if (['cat', 'bet'].includes(question.questionType)) {
                    const label = question.questionType === 'cat' ? 'Кот в мешке' : 'Вопрос со ставкой';
                    setSpecialLabel({ label, value, question });
                } else {
                    setSelectedQuestion({ value, question });
                    setIsShowTimer(true);
                }
            }
        }, 2000);
    };
  
    const handleAnswer = () => {
        setAnsweredQuestions(prev => [...prev, selectedQuestion.question.id]);
        setSelectedQuestion(null);
        resetAnswers();
        setIsShowAnswer(false);
        setIsTimerPaused(false);
    };

    const handleShowAnswer = () => {
        setIsQuestionSelected(false);
        setIsShowAnswer(true);
    };

    const handleSpecialLabelStart = (playerId) => {
        if (specialLabel?.question.questionType === "cat" || specialLabel?.question.questionType === "bet" ) {
            setSelectedQuestion({ value: specialLabel.value, question: specialLabel.question });
            setSpecialLabel(null);
            setIsShowTimer(false);
            const updatedPlayers = playersData.map(player => ({
                ...player,
                hasAnswered: player.id !== playerId
            }));
            resetAnswers(updatedPlayers);
        }
    };

    const renderRoundIntro = (text) => (
        <div className="question">
            <p>{text}</p>
        </div>
    );

    const renderSpecialLabel = (label) => (
        <div className="question">
            <p className="special-label">{label.label}</p>
            <button
                className="button"
                onClick={() => {
                    setSelectedQuestion({ value: label.value, question: label.question });
                    setSpecialLabel(null);
                }}
            >
                Показать вопрос
            </button>
        </div>
    );

    const renderSelectedQuestion = ({ question }) => (
        <>
            {!isShowAnswer && isShowTimer && (
                <Timer timer={settingsApp.timer} isTimerPaused={isTimerPaused} />
            )}

            <div className="question">
            {!isShowAnswer ? (
                <>
                    <p>{question.text}</p>
                    <button className="button" onClick={handleShowAnswer}>
                        Показать ответ
                    </button>
                </>
            ) : (
                <>
                    <p className="answer-text">{question.answer}</p>
                    <button
                        className="button"
                        onClick={handleAnswer}
                        disabled={isDisabledCloseBtn}
                    >
                        Закрыть вопрос
                    </button>
                </>
            )}
            </div>
        </>
    );

    const renderCategories = () =>
        rounds[activeRoundIndex]?.categories.map((category) => (
            <Category
                key={category.id}
                name={category.name}
                questions={category.questions}
                onClick={handleButtonClick}
                answeredQuestions={answeredQuestions}
                questionText={isButtonBlinking}
                roundIndex={activeRoundIndex}
            />
        )
    );
  
    return (
        <div className="category-grid">
            <div className="desk-grid">
                {showRoundIntro ? (
                    renderRoundIntro(roundIntroText)
                ) : specialLabel ? (
                    renderSpecialLabel(specialLabel)
                ) : selectedQuestion ? (
                    renderSelectedQuestion(selectedQuestion)
                ) : (
                    renderCategories()
                )}
            </div>

            <div className="players">
                {playersData.map((player) => (
                    <Player
                        key={player.id}
                        player={player}
                        onAwardPoints={handleAward}
                        onDeductPoints={handleDeduct}
                        isQuestionSelected={isQuestionSelected}
                        isShowAnswer={isShowAnswer}
                        setIsTimerPaused={setIsTimerPaused}
                        answerTime={settingsApp.answerTime}
                        specialQuestionType={specialLabel?.question.questionType}
                        handleSpecialLabelStart={handleSpecialLabelStart}
                        bets={bets}
                        onBetChange={handleBetChange}
                        isEveryoneNull={isEveryoneNull}
                    />
                ))}
            </div>
        </div>
    );
}