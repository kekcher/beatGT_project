import { useNavigate } from "react-router-dom";
import "../global_styles/header.scss";

import beatGtLogo from "../img/beatGT_LOGO.png";
import AppSvg from "../svg/AppSvg";
import { useState } from "react";

export default function Header() {
    const navigate = useNavigate();
    const nickname = JSON.parse(localStorage.getItem('user'))?.nickname;
    const avatar = JSON.parse(localStorage.getItem('user'))?.avatar;

    const [modal, setModal] = useState(false)

    //Функция выхода из профиля
    function goOut() {
        localStorage.clear();
        navigate('/login');
    }

    return (
        <>
            <header className="header-box">
                <img className="header-box__logo" src={beatGtLogo} alt='logo' />
                <div className="header-box_note-box">
                    <h1 className="header-box_note-box__note1">Конфигуратор компьютера BeatGt</h1>
                    <h2 className="header-box_note-box__note2">Собери компьютер своей мечты!</h2>
                </div>
                <div className="header-box_navigate-box">
                    <button onClick={() => navigate('/home')} className="header-box_navigate-box__navigate-btn">Домой</button>
                    <button onClick={() => navigate('/create_assembly')} className="header-box_navigate-box__navigate-btn">Приступить к сборке ПК</button>
                    <button onClick={() => navigate('/home?type=my')} className="header-box_navigate-box__navigate-btn">Мои сборки</button>
                    <button onClick={() => navigate('/home?type=like')} className="header-box_navigate-box__navigate-btn">Понравившиеся сборки</button>
                </div>
                <div className="header-box_profile-box">
                    {
                        nickname ?
                            (
                                <>
                                    <p className="header-box_profile-box__nickname">{nickname}</p>
                                    <img className="header-box_profile-box__avatar" src={avatar} alt='avatar' />
                                    <button onClick={goOut} className="header-box_profile-box__out-btn">Выйти</button>
                                </>
                            )
                            :
                            (
                                <>
                                    <button onClick={() => navigate('/login')} className="header-box_profile-box__auth-btn">Вход</button>
                                    <button onClick={() => navigate('/registration')} className="header-box_profile-box__auth-btn">Регистрация</button>
                                </>
                            )
                    }
                </div>
                <AppSvg onClick={() => setModal(!modal)} type="burger" className="header-box__burger" />
            </header>
            {
                modal && (
                    <ul className="modal-navigete-list">
                        <AppSvg onClick={() => setModal(false)} type='close' className="modal-navigete-list__close" />
                        {
                            nickname ?
                                (
                                    <li className="modal-navigete-list_profile-box">
                                        <p className="modal-navigete-list_profile-box__nickname">{nickname}</p>
                                        <img className="modal-navigete-list_profile-box__avatar" src={avatar} alt='avatar' />
                                        <button onClick={goOut} className="modal-navigete-list_profile-box__out-btn">Выйти</button>
                                    </li>
                                )
                                :
                                (
                                    <>
                                        <li onClick={() => navigate('/login')} className="modal-navigete-list__item">Вход</li>
                                        <li onClick={() => navigate('/registration')} className="modal-navigete-list__item">Регистрация</li>
                                    </>
                                )
                        }
                        <li onClick={() => {setModal(false); navigate('/home')}} className="modal-navigete-list__item">Домой</li>
                        <li onClick={() => navigate('/create_assembly')} className="modal-navigete-list__item">Приступить к сборке</li>
                        <li onClick={() => {setModal(false); navigate('/home?type=my')}} className="modal-navigete-list__item">Мои сборки</li>
                        <li onClick={() => {setModal(false); navigate('/home?type=like')}} className="modal-navigete-list__item">Понравившиеся сборки</li>
                    </ul>
                )
            }
        </>
    )
}