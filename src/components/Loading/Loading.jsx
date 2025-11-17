import style from './Loading.module.css';

export default function Loading () {
    return (
        <div className={style.overlay}>
            <div className={style.spinner}></div>
        </div>
    );
}