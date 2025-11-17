import React, { useState, useEffect, useCallback } from "react";

import { CategoryElement } from "../CategoryElement/CategoryElement";
import { settings, generateId } from "../../../utils/data";
import style from './CategoryBlock.module.css';

export const CategoryBlock = React.memo(function CategoryBlock ( { id, roundIndex, categories, setNewCategories, removeRound } ) {

    const [isCollapsed, setIsCollapsed] = useState(false);
    
    useEffect(() => {
        setNewCategories(categories, roundIndex);
    }, [categories]);

    const toggleCollapse = useCallback(() => {
        setIsCollapsed(prev => !prev);
    }, []);

    const removeCategory = useCallback((catId) => {
        setNewCategories(
            categories.filter(cat => cat.id !== catId),
            roundIndex
        );
    }, [categories, roundIndex, setNewCategories]);

    const addCategory = useCallback(() => {
        if (categories.length >= settings.maxCategories) return;

        const newQs = Array.from({ length: 5 }, (_, i) => ({
            id: generateId(),
            questionType: "ordinary",
            text:    ``,
            answer:  ``
        }));
        const newCat  = {
            id: generateId(),
            name: ``,
            questions: newQs
        };

        setNewCategories(
            [...categories, newCat],
            roundIndex
        );
    }, [categories, roundIndex, setNewCategories]);

    const handleCategoryChange = useCallback((catId, categoryName, questionId, value, field) => {
        const updated = categories.map(cat => {
            if (cat.id !== catId) return cat;

            const copyCat = { ...cat };
            if (categoryName != null) {
                copyCat.name = categoryName;
            }
            if (questionId != null) {
                copyCat.questions = copyCat.questions.map(q => 
                q.id !== questionId 
                    ? q 
                    : { ...q, [field]: value }
                );
            }
            return copyCat;
        });
        setNewCategories(updated, roundIndex);
    }, [categories, roundIndex, setNewCategories]);

    return (
        <div className={style.players}>
            <div className={style.subtitle}>
                <div className={style.subtitleDelete}>
                    <span>Раунд {roundIndex + 1}</span>
                    <button onClick={() => removeRound(id)}>✖</button>
                </div>
                <button 
                    className={style.collapse} 
                    onClick={toggleCollapse}
                >{isCollapsed ? 'Развернуть' : 'Свернуть'}</button>
            </div>
            {!isCollapsed && (
                <>
                    {categories.map((category, catIndex) => (
                        <CategoryElement
                            key={category.id}
                            category={category}
                            catIndex={catIndex}
                            removeCategory={removeCategory}
                            handleCategoryChange={handleCategoryChange}
                            roundIndex={roundIndex}
                        />
                    ))}
                    <button
                        className={style.buttonAdd} 
                        onClick={addCategory}
                        disabled={categories.length >= settings.maxCategories}
                    >Добавить категорию</button>
                </>
            )}
        </div>
    );
});