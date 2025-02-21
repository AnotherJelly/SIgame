import React, { useState, useEffect } from "react";

const settingsApp = {
    timer: 60,
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

function Category({ name, questions, onClick, answeredQuestions, questionText }) {
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
                        value={100 * (index + 1)}
                        question={question}
                        onClick={onClick}
                        isButtonBlinking={questionText === question}
                    />
                );
            })}
        </>
    );
}

function Player({ player, onAwardPoints, onDeductPoints, isQuestionSelected, isShowAnswer }) {
    return (
        <div className="player">
            {isQuestionSelected && !(player.hasAnswered) && (
                <div className="block-icons">

                    <button className="button-icons" onClick={() => onAwardPoints(player.id)}>
                        <i className="fas fa-check"></i>
                    </button>
                    
                    <button className="button-icons" onClick={() => onDeductPoints(player.id)}>
                        <i className="fas fa-times"></i>
                    </button>

                </div>
            )}
            {(isQuestionSelected || isShowAnswer) && (
                <textarea disabled={player.hasAnswered || isShowAnswer}></textarea>
            )}
            <div className="player-block">{player.name}</div>
            <div className="player-block player-block__score">{player.points}</div>
        </div>
    );
}

function Timer() {
    const [time, setTime] = useState(settingsApp.timer);

    useEffect(() => {
        if (time > 0) {
            const timer = setInterval(() => {
                setTime(prevTime => prevTime - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [time]);

    return <div className="timer">{time}</div>;
}

export default function CategoryGrid({ playersData, categories, onAwardPoints, onDeductPoints, resetAnswers }) {
  
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const [isButtonBlinking, setIsButtonBlinking] = useState(null);
    const [isQuestionSelected, setisQuestionSelected] = useState(null);

    const [isShowAnswer, setisShowAnswer] = useState(false);
    const [isDisabledCloseBtn, setisDisabledCloseBtn] = useState(false);

    const handleAward = (playerId) => {
        if (selectedQuestion) {
            onAwardPoints(playerId, selectedQuestion.value);

            handleShowAnswer();
            setisDisabledCloseBtn(true);
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
    };

    const handleShowAnswer = () => {
        setisQuestionSelected(false);
        setisShowAnswer(true);
    };
  
    return (
        <div className="category-grid">

            <div className="desk-grid">
                {selectedQuestion ? (
                    <>
                        {!isShowAnswer && (
                            <Timer />
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
                    categories.map((category) => (
                        <Category
                            key={category.id}
                            name={category.name}
                            questions={category.questions}
                            onClick={handleButtonClick}
                            answeredQuestions={answeredQuestions}
                            questionText={isButtonBlinking}
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
                    />
                ))}
            </div>
        </div>
    );
}