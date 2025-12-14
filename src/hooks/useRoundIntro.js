import { useState, useEffect } from "react";

export function useRoundIntro(roundIntroText, pause) {
    const [showIntro, setShowIntro] = useState(true);

    useEffect(() => {
        setShowIntro(true);
        if (roundIntroText === "Конец игры" || roundIntroText === "Вопросы отсутствуют") return;
        const t = setTimeout(() => setShowIntro(false), pause);
        return () => clearTimeout(t);
    }, [roundIntroText, pause]);

    return showIntro;
}