import React, { useState, useEffect, useCallback } from "react";

import { SettingsCategoryElement } from "./SettingsCategoryElement";
import { settings, generateId } from "../../utils/data";

export const SettingsCategoryBlock = React.memo(function SettingsCategoryBlock ( { id, roundIndex, categories, setNewCategories, removeRound } ) {

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
});