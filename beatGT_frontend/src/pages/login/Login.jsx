import { NavLink, useNavigate } from 'react-router-dom';
import BackGroundSvg from '../../global_components/BackGroundSvg';
import {Loader} from '../../global_components/Loader';
import { FormControlLogin, FormControlPswd, FormControlSubmit } from '../../global_components/form_control';
import './scss/login.scss';
import { useState } from 'react';

import { AuthUser } from '../../service/route';

export default function Login() {

    const navigate = useNavigate();

    const [load, setLoad] = useState(false);
    const [loginStates, setLoginStates] = useState({
        login: '',
        password: '',
        error: null
    });

    function handleInputChange(e) {
        setLoginStates({
            ...loginStates,
            [e.target.name]: e.target.value
        });
    };

    function handleInputFocus() {
        if (loginStates.error) {
            setLoginStates({
                login: '',
                password: '',
                error: null,
                load: false
            })
        }
    }

    function handleSubmit(e) {
        e.preventDefault();

        setLoad(true);

        //Роут для входа
        const data = {
            login: loginStates.login,
            password: loginStates.password
        };

        AuthUser(data)
            .then(d => {
                localStorage.setItem('user', JSON.stringify({ 'id': d.id, 'nickname': d.login, 'role': d.role, 'avatar': d.avatar }));
                localStorage.setItem('jwtToken', d.token);
                navigate('/home');
            })
            .catch(e => {
                setLoginStates({
                    ...loginStates,
                    error: e.error
                })
            })
            .finally(_ => {
                setLoad(false)
            })
    };

    return (
        <>
            <BackGroundSvg />
            <form className='login-box' onSubmit={handleSubmit}>
                <h1 className='login-box__note'>Добро пожаловать в конфигуратор компьютера BeatGT!</h1>
                <FormControlLogin onFocus={handleInputFocus} value={loginStates.login} name="login" onChange={handleInputChange} />
                <FormControlPswd onFocus={handleInputFocus} value={loginStates.password} name="password" onChange={handleInputChange} placeholder="Введите пароль" />
                {
                    loginStates.error && (
                        <p className='login-box__error-label'>{loginStates.error}</p>
                    )
                }
                {
                    load ?
                        (
                            <Loader />
                        )
                        :
                        (
                            <FormControlSubmit>Войти</FormControlSubmit>
                        )
                }
                <p className='login-box__link'>{'Нет аккаунта? Создайте его! '}<NavLink to="/registration" className="login-box__link-active">Перейти к регистрации</NavLink></p>
                <NavLink className='login-box__link login-box__link-active' to="/home">На главную страницу</NavLink>
            </form>
        </>
    )
}