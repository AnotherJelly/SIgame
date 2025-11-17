import { settings } from "../../../utils/data";
import { Player } from "../Player/Player";
import { useCategoryGrid } from "../../../hooks/useCategoryGrid";
import style from './Main.module.css';

export default function CategoryGrid({ playersData, rounds, onAwardPoints, onDeductPoints, resetAnswers }) {

    const { state, setState, handlers, computed } = useCategoryGrid({ playersData, rounds, onAwardPoints, onDeductPoints, resetAnswers });

    return (
        <div className={style.categoryGrid}>
            <div className={style.deskGrid}>{computed.renderTable}</div>

            <div className={style.players}>
                {playersData.map((player) => (
                    <Player
                        key={player.id}
                        player={player}
                        onAwardPoints={handlers.handleAward}
                        onDeductPoints={handlers.handleDeduct}
                        isQuestionSelected={state.isQuestionSelected}
                        isShowAnswer={state.isShowAnswer}
                        setIsTimerPaused={setState.setIsTimerPaused}
                        answerTime={settings.answerTime}
                        specialQuestionType={state.specialLabel?.question.questionType}
                        handleSpecialLabelStart={handlers.handleSpecialLabelStart}
                        bets={state.bets}
                        onBetChange={handlers.handleBetChange}
                        isEveryoneNull={computed.isEveryoneNull}
                    />
                ))}
            </div>
        </div>
    );
}