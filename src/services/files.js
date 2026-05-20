import { validateRounds } from "../utils/validate";
import { settings } from '../utils/data';

export const handleImport = (event, setNewRounds, setError) => {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > settings.maxPackageSize) {
    const limitMb = (settings.maxPackageSize / (1024 * 1024)).toFixed(0);
    console.error("Файл превышает допустимый размер.");
    setError({
      isError: true,
      textError: `Файл слишком большой: превышен предел ${limitMb} МБ.`,
    });
    event.target.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onerror = () => {
    console.error("Ошибка чтения файла:", reader.error);
    setError({ isError: true, textError: "Не удалось прочитать файл." });
  };

  reader.onload = (e) => {
    try {
      const json = JSON.parse(e.target.result);

      try {
        localStorage.setItem("rounds", JSON.stringify(json));
      } catch (storageErr) {
        console.error("Ошибка записи в локальное хранилище:", storageErr);
        setError({
          isError: true,
          textError: "Пакет не помещается в локальное хранилище браузера.",
        });
        return;
      }

      setNewRounds(json);
    } catch (err) {
      console.error("Ошибка чтения файла:", err);
      setError({ isError: true, textError: `Ошибка чтения файла: ${err}` });
    }
  };

  reader.readAsText(file);
  event.target.value = "";
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
