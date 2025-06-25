import React, { useState, useEffect } from "react";

export const Player = React.memo(function Player({ 
    player, onAwardPoints, onDeductPoints, isQuestionSelected, setIsTimerPaused, 
    answerTime, specialQuestionType, handleSpecialLabelStart, bets, onBetChange, isEveryoneNull
}) {
    const [isCanAnswer, setIsCanAnswer] = useState(false);

    useEffect(() => {
        setIsCanAnswer(false);
    }, [isQuestionSelected]);

    const canBet = specialQuestionType === "bet" && (isEveryoneNull || player.points > 0);

    const handleCanAnswer = () => {
        if (specialQuestionType === "cat" || specialQuestionType === "bet") {
            handleSpecialLabelStart(player.id);
        }
        setIsTimerPaused(true);
        setIsCanAnswer(true);
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
},
    function areEqual(prev, next) {
        if (prev.player !== next.player) {
            return false;
        }
        if (prev.player.points !== next.player.points) {
            return false;
        }
        if (prev.isQuestionSelected !== next.isQuestionSelected || prev.isShowAnswer !== next.isShowAnswer) {
            return false;
        }
        if ((prev.bets[prev.player.id] || 0) !== (next.bets[next.player.id] || 0)) {
            return false;
        }
        if (prev.specialQuestionType !== next.specialQuestionType) {
            return false;
        }

        return true;
});