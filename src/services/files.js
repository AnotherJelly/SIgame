import { validateRounds } from "../utils/validate";

export const handleImport = (event, setNewRounds, setError) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const json = JSON.parse(e.target.result);

      localStorage.setItem("rounds", JSON.stringify(json));
      setNewRounds(json);
    } catch (err) {
      console.error("Ошибка чтения файла:", err);
      setError({isError: true, textError: `Ошибка чтения файла: ${err}`});
    }
  };

  reader.readAsText(file);
};


export const handleExport = (event, rounds, setError) => {
  if (!validateRounds(rounds)) {
    console.error('Ошибка: данные раундов некорректные. Экспорт отменен.');
    setError({isError: true, textError: 'Невозможно экспортировать: проверьте все поля раундов, категорий и вопросов.'});
    return;
  }

  const blob = new Blob([JSON.stringify(rounds, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "data.json";
  a.click();

  URL.revokeObjectURL(url);
};
