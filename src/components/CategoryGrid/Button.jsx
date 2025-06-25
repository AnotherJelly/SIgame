import React from "react";

export const Button = React.memo(function Button({ value, question, onClick, isButtonBlinking }) {
    return (
        <div className="button-block">
            <button
                className={`button-table ${isButtonBlinking ? "blinking-button" : ""}`}
                onClick={() => onClick(value, question)}
            >
                {value}
            </button>
        </div>
    );
});