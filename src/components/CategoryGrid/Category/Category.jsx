import React from "react";
import { Button } from "../Button/Button";
import style from './Category.module.css'

export const Category = React.memo(function Category({ name, questions, onClick, answeredQuestions, questionText, roundIndex }) {
    return (
        <>
            <div className={style.categoryTitle}>{name}</div>
            {questions.map((question, index) => {
                if (answeredQuestions.includes(question.id)) {
                    return <div key={question.id} className={style.buttonBlock}></div>;
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
});