import { settings } from "../../utils/data";
import { Player } from "./Player";
import { useCategoryGrid } from "../../hooks/useCategoryGrid";

export default function CategoryGrid({ playersData, rounds, onAwardPoints, onDeductPoints, resetAnswers }) {

    const { state, setState, handlers, computed } = useCategoryGrid({ playersData, rounds, onAwardPoints, onDeductPoints, resetAnswers });

    return (
        <div className="category-grid">
            <div className="desk-grid">{computed.mainArea}</div>

            <div className="players">
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