import style from './InputWithDelete.module.css'

export function InputWithDelete ( {id, value, placeholder, maxlength, onChange, onDelete} ) {
    return (
        <div key={id} className={style.row}>
            <input
                type="text"
                className={style.rowInput}
                value={value}
                placeholder={placeholder}
                maxLength={maxlength}
                onChange={onChange}
            />
            <button className={style.rowDelete} onClick={() => onDelete(id)}>
                ✖
            </button>
        </div>
    );
}