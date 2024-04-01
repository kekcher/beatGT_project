import { AppContext } from "../../App"

import { useNavigate, useLoaderData, defer, Await } from "react-router-dom"

import { Suspense, useContext, useState } from "react"

import AppSvg from "../../svg/AppSvg"

import { component_header, pc_components } from '../../constants'

import { GetComponent } from "../../service/route"

import { PageLoader } from "../../global_components/Loader"

import NotFound from "../not_found/NotFound"

import "./scss/component.scss"

//Прогрузка комплектующего
export const ComponentLoader = () => {
    const searchParams = new URLSearchParams(window.location.search)

    const id = searchParams.get('id');
    const type = searchParams.get('type');
    console.log(window.location)

    const componentInfo = GetComponent(id, type);

    return defer({
        infoData: componentInfo,
        type_component: type || 'motherboard'
    });

}

export default function Component() {
    const { deviceSize } = useContext(AppContext);

    //Информация о комлектиющем
    const { infoData, type_component } = useLoaderData();

    const navigate = useNavigate();

    const [compWindow, setCompWindow] = useState(true);


    return (
        <div className="pc-component-container">
            <Suspense fallback={<PageLoader />}>
                <Await errorElement={<NotFound>Комплектующее не найдено!</NotFound>} resolve={infoData}>
                    {
                        (data) => (
                            <>
                                <h1 className="pc-component-container__head">{component_header[type_component]}</h1>

                                <ul className={deviceSize < 720 && !compWindow ? "none" : "pc-component-container_note-box"}>
                                    {
                                        pc_components[type_component].map((item, idx) => {
                                            return (
                                                <li key={idx}>
                                                    <p className="pc-component-container_note-box__note">{item['note']}</p>
                                                    <p className={item['code_name'] === 'status' ? data[item['code_name']] === 'accepted' ? "pc-component-container_note-box__note-item_green": "pc-component-container_note-box__note-item_red" : "pc-component-container_note-box__note-item"}>{data[item['code_name']]}</p>
                                                </li>
                                            )
                                        })
                                    }
                                    <li>
                                        <button onClick={() => navigate(-1)} className="pc-component-container__back-btn">Назад</button>
                                    </li>
                                </ul>
                                <div className={deviceSize < 720 && compWindow ? "none" : "pc-component-container_logo-box"}>
                                    <img className="pc-component-container_logo-box__logo" src={data['logo']} alt='нет' />
                                </div>

                                <div className='choose-box'>
                                    <AppSvg onClick={() => setCompWindow(!compWindow)} className="row-svg" type='left-row' />
                                    <AppSvg onClick={() => setCompWindow(!compWindow)} className="row-svg" type='right-row' />
                                </div>
                            </>
                        )
                    }
                </Await>
            </Suspense>
        </div>
    )
}