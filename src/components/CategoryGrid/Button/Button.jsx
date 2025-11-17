import React from "react";
import style from "./Button.module.css";

export const Button = React.memo(function Button({ value, question, onClick, isButtonBlinking }) {
    return (
        <div className={style.buttonBlock}>
            <button
                className={`${style.buttonTable} ${isButtonBlinking ? style.blinkingButton : ""}`}
                onClick={() => onClick(value, question)}
            >
                {value}
            </button>
        </div>
    );
});