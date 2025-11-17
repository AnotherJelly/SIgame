import React, { useState, useEffect } from "react";
import style from "./Player.module.css";

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
        <div className={style.player}>
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
                    <div className={style.playerTimer}>
                        <div className={style.playerTimer_line} style={{
                            animation: `${style.slideOut} ${answerTime}s linear forwards`
                        }}></div>
                    </div>
                    <div className={style.blockIcons}>
    
                        <button className={style.buttonIcons} onClick={() => onAwardPoints(player.id)}>
                            ✔
                        </button>
                        
                        <button className={style.buttonIcons} onClick={() => onDeductPoints(player.id)}>
                            ✖
                        </button>
    
                    </div>
                </>
            )}
            {/*((isShowAnswer && player.hasAnswered) || (isCanAnswer && isQuestionSelected)) && (
                <textarea disabled={player.hasAnswered || isShowAnswer}></textarea>
            )*/}
            {isQuestionSelected && !isCanAnswer && !player.hasAnswered && (canBet || specialQuestionType !== "bet") && (
                <button className={style.buttonAnswer} onClick={handleCanAnswer}>Ответить</button>
            )}
            <div className={style.playerBlock}>{player.name}</div>
            <div className={`${style.playerBlock_score} ${style.playerBlock}`}>{player.points}</div>
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