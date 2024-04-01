import { useLocation, useNavigate } from "react-router-dom";
import { create_component } from "../../constants";
import { CreateComponentItem } from "./components/components";
import "./scss/create_component.scss";
import NotFound from "../not_found/NotFound";
import { Loader } from "../../global_components/Loader";
import { useState } from "react";
import { postComponent } from "../../service/route";

export default function CreateComponent() {
    const location = useLocation();
    const navigate = useNavigate();
    const type = new URLSearchParams(location.search)?.get('type');

    const obj = Object.keys(create_component[type])
        .filter(item => item !== 'head')
        .reduce((item, key) => {
            item[key] = '';
            return item;
        }, {});

    const [createComponentState, setCreateComponentState] = useState({
        ...obj,
        logo: null
    });
    const [load, setLoad] = useState(false);
    const [error, setError] = useState(null);


    //Функция добавления лого
    function handleChangeLogo(e) {
        if (e.target.files[0]) {
            if (e.target.files[0].type.includes('image')) {
                const file = e.target.files[0];
                const reader = new FileReader();

                reader.readAsDataURL(file);

                reader.onloadend = () => {
                    setCreateComponentState({
                        ...createComponentState,
                        logo: reader.result
                    })
                }

            } else {
                alert('Загружайте, пожалуйста, изображения!')
            }
        } else {
            setCreateComponentState({
                ...createComponentState,
                logo: null
            })
        }
    }

    //Функция заполнения остальных полей
    function handleChangeInput(e) {
        setCreateComponentState({
            ...createComponentState,
            [e.target.name]: e.target.value
        })
    }

    //Функция записи нового комплектующего
    function handleSubmit(e) {
        e.preventDefault();

        setLoad(true);

        postComponent(type, { ...createComponentState, status: 'confirmation' })
            .then(_ => navigate(-1))
            .catch(e => setError(e.error))
            .finally(_ => {
                setLoad(false);
            });
    }

    return (
        <>
            {
                create_component[type] ?
                    (
                        <>
                            <form onSubmit={handleSubmit} className="create-component-box">
                                <h1 className="create-component-box__head">{create_component[type].head}</h1>
                                <ul className="create-component-box_component-items-list">
                                    {
                                        Object.keys(create_component[type])
                                            .filter(item => item !== 'head')
                                            .map(item => {
                                                return (
                                                    <CreateComponentItem
                                                        key={item}
                                                        name={item}
                                                        onChange={handleChangeInput}
                                                        value={createComponentState[item]}
                                                        type={create_component[type][item].type}
                                                        note={create_component[type][item].note}
                                                        icon_type={type}
                                                    >
                                                        {create_component[type][item].label}
                                                    </CreateComponentItem>
                                                )
                                            })
                                    }
                                    <li className="create-component-box_component-items-list_item-box">
                                        <input onChange={handleChangeLogo} accept="image/*" type='file' />
                                        {
                                            createComponentState.logo && (
                                                <img className="create-component-box__logo" src={createComponentState.logo} alt='нет' />
                                            )
                                        }
                                    </li>
                                </ul>
                                <div className="create-component-btn-box">
                                    {
                                        load ?
                                            (
                                                <Loader />
                                            )
                                            :
                                            (
                                                <>
                                                    <input type="submit" value="Создать" className="create-component-btn-box__create-btn" />
                                                    {
                                                        error && (
                                                            <p className="create-component-btn-box__error">{error}</p>
                                                        )
                                                    }
                                                </>
                                            )
                                    }
                                </div>
                            </form>
                            <button onClick={() => navigate(-1)} className="create-component-back-btn">Назад</button>
                        </>
                    )
                    :
                    (
                        <NotFound>Страница не найдена!</NotFound>
                    )
            }
        </>
    )
}