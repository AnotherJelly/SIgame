import React, { useState } from "react";
import { settings } from "../../utils/data";
import { InputText } from "./InputText";
import { InputWithDelete } from "./InputWithDelete";

export function SettingsCategoryElement ( {category, catIndex, removeCategory, handleCategoryChange, roundIndex} ) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
      setIsCollapsed(prevState => !prevState);
    };

    return (
        <div className="modal-content__block" key={category.id}>
            <InputWithDelete 
                id={category.id} 
                value={category.name}
                placeholder={`Название категории ${catIndex + 1}`}
                maxlength={settings.maxLengthCategory}
                onChange={(e) => handleCategoryChange(category.id, e.target.value)}
                onDelete={removeCategory}
            />
            <button className="modal-content__collapse" onClick={toggleCollapse}>{isCollapsed ? 'Развернуть' : 'Свернуть'}</button>
            {!isCollapsed && category.questions.map((curQuestion, qIndex) => (
                <React.Fragment key={curQuestion.id}>
                    <div className="modal-content-block__question">
                        <InputText
                            id={curQuestion.id}
                            text={`${100 * (roundIndex + 1) * (qIndex + 1)}:`}
                            value={curQuestion.text ?? ''}
                            placeholder={`Вопрос ${qIndex + 1}`}
                            maxlength={settings.maxLengthQuestion}
                            onChange={(e) =>
                                handleCategoryChange(category.id, null, curQuestion.id, e.target.value, 'text')
                            }
                        />                        
                        <select
                            value={curQuestion.questionType}
                            onChange={(e) =>
                                handleCategoryChange(category.id, null, curQuestion.id, e.target.value, 'questionType')
                            }>
                            <option value="ordinary">Стандартный</option>
                            <option value="cat">Кот в мешке</option>
                            <option value="bet">Со ставкой</option>
                        </select>
                    </div>
                    <InputText
                        id={curQuestion.id}
                        text={"Ответ:"}
                        value={curQuestion.answer ?? ''}
                        placeholder={`Ответ ${qIndex + 1}`}
                        maxlength={settings.maxLengthQuestion}
                        onChange={(e) =>
                            handleCategoryChange(category.id, null, curQuestion.id, e.target.value, 'answer')
                        }
                    />
                </React.Fragment>
            ))}
        </div>
    );
}