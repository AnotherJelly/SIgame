import { useState, useEffect } from "react";

export function Timer({timer, isTimerPaused}) {
    const [time, setTime] = useState(timer);

    useEffect(() => {
        if (time > 0 && !isTimerPaused) {
            const timer = setInterval(() => {
                setTime(prevTime => prevTime - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [time, isTimerPaused]);

    return <div className="timer">{time}</div>;
}