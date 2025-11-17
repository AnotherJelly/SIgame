import React, { useCallback } from "react";

import { settings, generateId } from "../../../utils/data";
import { CategoryBlock } from "../CategoryBlock/CategoryBlock";
import style from './RoundBlock.module.css';

export const RoundBlock = React.memo(function RoundBlock({ newRounds, setNewRounds }) {
    const removeRound = useCallback((id) => {
        setNewRounds(prev =>
            prev.filter(r => r.id !== id)
        );
    }, [setNewRounds]);

    const addRound = useCallback(() => {
        setNewRounds(prev => {
            if (prev.length >= settings.maxRounds) return prev;
            const index = prev.length;
            const newRound = {
                id: generateId(),
                name: `Round ${index + 1}`,
                categories: [
                    {
                        id: generateId(),
                        name: ``,
                        questions: Array.from({ length: 5 }, () => ({
                            id: generateId(),
                            questionType: "ordinary",
                            text: "",
                            answer: ""
                        }))
                    }
                ]
            };
            return [...prev, newRound];
        });
    }, [setNewRounds]);

    const setNewCategories = useCallback((updatedCategories, roundIndex) => {
        setNewRounds(prev => {
            const updatedRounds = [...prev];
            updatedRounds[roundIndex] = {
                ...updatedRounds[roundIndex],
                categories: updatedCategories
            };
            return updatedRounds;
        });
    }, [setNewRounds]);

    return (
        <div className={style.players}>
            {newRounds.map((round, roundIndex) => (
                <CategoryBlock
                    key={round.id}
                    id={round.id}
                    roundIndex={roundIndex}
                    categories={round.categories}
                    setNewCategories={setNewCategories}
                    removeRound={removeRound}
                />
            ))}
            <button
                onClick={addRound}
                className={`${style.buttonAdd} ${style.buttonWide}`}
                disabled={newRounds.length >= settings.maxRounds}
            >
                Добавить раунд
            </button>
        </div>
    );
});