export function InputWithDelete ( {id, value, placeholder, maxlength, onChange, onDelete} ) {
    return (
        <div key={id} className="modal-content-row">
            <input
                type="text"
                className="modal-content-row__input"
                value={value}
                placeholder={placeholder}
                maxLength={maxlength}
                onChange={onChange}
            />
            <button className="modal-content-row__delete" onClick={() => onDelete(id)}>
                <i className="fas fa-times"></i>
            </button>
        </div>
    );
}