
import React, { useContext, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import BackGroundSvg from "../../global_components/BackGroundSvg"
import { Loader } from '../../global_components/Loader';
import AvatarEditor from 'react-avatar-editor';
import {
    FormControlLogin,
    FormControlPswd,
    FormControlSubmit,
    FormControlRange,
    FormControlImage,
    FormControlSubmitBtn
} from '../../global_components/form_control';

import AppSvg from '../../svg/AppSvg';
import { AppContext } from '../../App';
import { CreateUser } from '../../service/route';
import { defaultAvatarUrl } from '../../constants';

import "./scss/registration.scss";

export default function Registration() {

    const { deviceSize } = useContext(AppContext);

    const navigate = useNavigate();

    const avatarEditorRef = useRef(null);

    const [load, setLoad] = useState(false);
    const [regStates, setRegStates] = useState({
        login: '',
        password: '',
        second_password: '',
        avatar: null,
        avatarSave: null,
        avatarScale: 2,
        regWindow: true,
        avatarError: null,
        regError: null
    })

    function handleSubmit(e) {
        e.preventDefault();

        setLoad(true);

        const data = {
            login: regStates.login,
            password: regStates.password,
            second_password: regStates.second_password,
            avatarUrl: sessionStorage.getItem('avatar') || defaultAvatarUrl
        }
        //Роут регистрации
        CreateUser(data)
            .then(_ => {
                navigate('/login');
            })
            .catch(e => {
                setRegStates({
                    ...regStates,
                    regError: e.error
                })
            })
            .finally(_ => {
                setLoad(false);
            });
    }

    function handleSaveAvatar() {
        if (avatarEditorRef.current) {
            const canvas = avatarEditorRef.current.getImageScaledToCanvas();
            const avatarURL = canvas.toDataURL();

            //Закидываем в sessionStorage
            sessionStorage.setItem('avatar', avatarURL);

            setRegStates({
                ...regStates,
                avatarSave: 'Фото сохранено!'
            })
        }
    }

    function handleChangeAvatar(e) {
        if (!e.target.files.length) {
            setRegStates({
                ...regStates,
                avatar: null,
                avatarSave: null
            })
        } else {
            const file_type = e.target.files[0].type;
            setRegStates({
                ...regStates,
                avatar: file_type.includes('image') ? e.target.files[0] : null,
                avatarSave: null,
                avatarScale: 2,
                avatarError: file_type.includes('image') ? null : 'Загружать можно только фото!'
            })
        }
    };

    function handleInputChange(e) {
        setRegStates({
            ...regStates,
            [e.target.name]: e.target.value
        });
    };

    function handleInputFocus() {
        if (regStates.regError) {
            setRegStates({
                login: '',
                password: '',
                second_password: '',
                regError: null
            })
            sessionStorage.clear();
        }
    }

    function handleAvatarScale(e) {
        setRegStates({
            ...regStates,
            avatarScale: parseFloat(e.target.value)
        });
    };

    function removeRegWindow() {
        setRegStates({
            ...regStates,
            regWindow: !regStates.regWindow
        })
    }
    return (
        <>
            <BackGroundSvg />
            <div className='registration-container'>
                <form onSubmit={handleSubmit} className={deviceSize < 720 && !regStates.regWindow ? 'none' : 'registration-container__form'}>
                    <h1 className='registration-container__form__note'>Регистрация</h1>
                    <FormControlLogin onFocus={handleInputFocus} value={regStates.login} name="login" onChange={handleInputChange} />
                    <FormControlPswd onFocus={handleInputFocus} value={regStates.password} name="password" onChange={handleInputChange} placeholder='Введите пароль' />
                    <FormControlPswd onFocus={handleInputFocus} value={regStates.second_password} name="second_password" onChange={handleInputChange} placeholder='Повторите пароль' />
                    {
                        load ?
                            (
                                <Loader />
                            )
                            :
                            (
                                <FormControlSubmit>Зарегистрироваться</FormControlSubmit>
                            )
                    }
                    {
                        regStates.regError && (
                            <p className='registration-container__form__error-label'>{regStates.regError}</p>
                        )
                    }
                    <p className='registration-container__form__link'>{'Есть аккаунт? Войдите в него! '}<NavLink to="/login" className="registration-container__form__link-active">Перейти к входу</NavLink></p>
                    <NavLink className='registration-container__form__link registration-container__form__link-active' to="/home">На главную страницу</NavLink>
                </form>
                <div className={deviceSize < 720 && regStates.regWindow ? 'none' : 'registration-container__avatar-box'}>
                    <h1 className='registration-container__form__note'>Выберите аватар</h1>
                    <FormControlImage onChange={handleChangeAvatar}>{regStates.avatar?.name || 'Файл не выбран'}</FormControlImage>
                    {regStates.avatar && (
                        <AvatarEditor
                            ref={avatarEditorRef}
                            image={regStates.avatar}
                            width={200}
                            height={200}
                            border={20}
                            borderRadius={100}
                            color={[255, 255, 255, 0.4]}
                            scale={regStates.avatarScale}
                            rotate={0}
                        />
                    )}
                    <FormControlRange scale={regStates.avatarScale} onChange={handleAvatarScale} />
                    {
                        regStates.avatarError && (
                            <p className='registration-container__avatar-box__error-label'>{regStates.avatarError}</p>
                        )
                    }
                    <FormControlSubmitBtn onClick={handleSaveAvatar}>Сохранить</FormControlSubmitBtn>
                    {
                        regStates.avatarSave && (
                            <p className='registration-container__avatar-box__note'>{regStates.avatarSave}</p>
                        )
                    }
                </div>
            </div>

            <div className='choose-box'>
                <AppSvg onClick={removeRegWindow} className="row-svg" type='left-row' />
                <AppSvg onClick={removeRegWindow} className="row-svg" type='right-row' />
            </div>

        </>
    );
} 