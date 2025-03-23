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

function Player({ player, onAwardPoints, onDeductPoints, isQuestionSelected, isShowAnswer, setisTimerPaused, answerTime }) {
    const [isCanAnswer, setisCanAnswer] = useState(false);

    useEffect(() => {
        setisCanAnswer(false);
    }, [isQuestionSelected]);

    const handleCanAnswer = () => {
        setisTimerPaused(true);
        setisCanAnswer(true);
    };
    
    return (
        <div className="player">
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
                {((isShowAnswer && player.hasAnswered) || (isCanAnswer && isQuestionSelected)) && (
                    <textarea disabled={player.hasAnswered || isShowAnswer}></textarea>
                )}
                {isQuestionSelected && !isCanAnswer && (
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
    const [isQuestionSelected, setisQuestionSelected] = useState(null);

    const [isShowAnswer, setisShowAnswer] = useState(false);
    const [isDisabledCloseBtn, setisDisabledCloseBtn] = useState(false);

    const [activeRoundIndex, setActiveRoundIndex] = useState(0);
    const [roundIntroText, setRoundIntroText] = useState('Раунд 1');
    const [showRoundIntro, setShowRoundIntro] = useState(true);

    const [isTimerPaused, setisTimerPaused] = useState(false);

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
        if (selectedQuestion) {
            onAwardPoints(playerId, selectedQuestion.value);

            handleShowAnswer();
            setisDisabledCloseBtn(true);
            setisTimerPaused(false);
            setTimeout(() => {
                setisDisabledCloseBtn(false);
                setisShowAnswer(false);
                setAnsweredQuestions([...answeredQuestions, selectedQuestion.question.id]);
                setSelectedQuestion(null);
            }, 5000);
        }
    };

    const handleDeduct = (playerId) => {
        if (selectedQuestion) {
            onDeductPoints(playerId, selectedQuestion.value);
            setisTimerPaused(false);
        }
    };

    const handleButtonClick = (value, question) => {
        setIsButtonBlinking(question);
        setTimeout(() => {
            setIsButtonBlinking(null);
            setisQuestionSelected(true);
            if (!answeredQuestions.some(q => q === question.id)) {
                setSelectedQuestion({ value, question });
            }
        }, 2000);
    };
  
    const handleAnswer = () => {
        setAnsweredQuestions([...answeredQuestions, selectedQuestion.question.id]);
        setSelectedQuestion(null);
        resetAnswers();
        setisShowAnswer(false);
        setisTimerPaused(false);
    };

    const handleShowAnswer = () => {
        setisQuestionSelected(false);
        setisShowAnswer(true);
    };
  
    return (
        <div className="category-grid">

            <div className="desk-grid">
                {showRoundIntro ? (
                    <div className="question">
                        <p>{roundIntroText}</p>
                    </div>
                ) : selectedQuestion ? (
                    <>
                        {!isShowAnswer && (
                            <Timer
                                timer={settingsApp.timer}
                                isTimerPaused={isTimerPaused}
                            />
                        )}
                        <div className="question">
                            {!isShowAnswer ? (
                                <>
                                    <p>
                                        {selectedQuestion.question.text}
                                    </p>
                                    <button className="button" onClick={handleShowAnswer}>
                                        Показать ответ
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="answer-text" >
                                        {selectedQuestion.question.answer}
                                    </p>
                                    <button className="button" onClick={handleAnswer} disabled={isDisabledCloseBtn}>
                                        Закрыть вопрос
                                    </button>
                                </>
                            )}
                        </div>
                    </>
                ) : (
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
                    ))
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
                        setisTimerPaused={setisTimerPaused}
                        answerTime={settingsApp.answerTime}
                    />
                ))}
            </div>
        </div>
    );
}