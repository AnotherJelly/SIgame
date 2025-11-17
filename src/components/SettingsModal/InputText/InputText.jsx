import style from './InputText.module.css';

export function InputText ( {id, text, value, placeholder, maxlength, onChange} ) {
    return (
        <div key={id} className={style.question}>
            <span>{text}</span>
            <input
                type="text"
                value={value}
                placeholder={placeholder}
                maxLength={maxlength}
                onChange={onChange}
            />
        </div>
    );
}