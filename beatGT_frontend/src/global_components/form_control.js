import '../global_styles/form_control.scss';

import { useState } from 'react';

import AppSvg from '../svg/AppSvg';

export function FormControlLogin({name, onChange, value, onFocus }) {
    return (
        <div className='form-control__input-box'>
            <input pattern="[A-Za-z0-9]+" onFocus={onFocus} value={value}  onChange={onChange} name={name} type='text' placeholder='Введите логин' />
            <AppSvg className="form-control__input-box__form-icon" type="login" />
        </div>
    )
}

export function FormControlPswd({ placeholder, name, onChange, value, onFocus}) {

    const [pswdVisible, setPswdVisible] = useState(false);

    return (
        <div className='form-control__input-box'>
            <input onFocus={onFocus} value={value} onChange={onChange} name={name} type={pswdVisible ? "text" : "password"} placeholder={placeholder} />
            <AppSvg onClick={() => setPswdVisible(!pswdVisible)} className="form-control__input-box__form-icon" type={pswdVisible ? "pswd-visible" : "pswd-not-visible"} />
        </div>
    )
}

export function FormControlSubmit({ children }) {
    return <input className='form-control__submit' value={children} type='submit' />
}

export function FormControlRange({ onChange, scale }) {
    return <input className='form-control__range' type="range" min="1" max="2" step="0.01" value={scale} onChange={onChange} />
}

export function FormControlImage({onChange, children}) {
    return (
        <label htmlFor='file' className="form-control__file">
            <input accept='image/*' onChange={onChange} type="file" id="file" />
            <span className="form-control__file__file-btn">Выберите файл</span>
            <span className="form-control__file__file-text">{children}</span>
        </label>
    )
}

export function FormControlSubmitBtn({ children, onClick }) {
    return <button onClick={onClick} className='form-control__submit'>{children}</button>
}