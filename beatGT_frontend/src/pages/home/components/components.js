import { assembLike } from "../../../service/route";
import { assembly } from "../../../constants";
import assemblyImg from "../../../img/assembly.jpeg";
import AppSvg from "../../../svg/AppSvg";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function AssemblyBox({ assemblyInfo }) {

    const userId = JSON.parse(localStorage.getItem('user'))?.id;
    const [like, setLike] = useState(assemblyInfo.likes.includes(userId));
    const [countLike, setCountLike] = useState(assemblyInfo.likes.length);

    //Функция поставки лайка
    function getLike() {
        const data = {
            user_id: userId,
            assembly_id: assemblyInfo.assembly_id
        }

        assembLike(data).then(d => {
            setLike(d.like);
            setCountLike(count => { return d.like ? count + 1 : count - 1 })
        })
    }

    //Функция перехода к сборке
    function goToAssembly() {
        window.location.href = `/assembly?id=${assemblyInfo.assembly_id}`;
    }

    return (
        <div className="home-box_assembly-box">
            <div className="home-box_assembly-box_logo-box">
                <img className="home-box_assembly-box_logo-box__logo" src={assemblyImg} alt='сборка' />
            </div>
            <div className="home-box_assembly-box_info-box">
                <h2 className="home-box_assembly-box_info-box__name">Название сборки: {assemblyInfo.assembly_name}</h2>
                <h3 className="home-box_assembly-box_info-box__author">Автор сборки: {assemblyInfo.author}</h3>
                {
                    assembly.map((item, idx) => {
                        return <p className="home-box_assembly-box_info-box__item" key={idx}>* {item.note} {assemblyInfo[item['code_name']].name || assemblyInfo[item['code_name']][0].name}</p>
                    })
                }
            </div>
            <div className="home-box_assembly-box_stats-box">
                <p className="home-box_assembly-box_stats-box__price">{assemblyInfo.price} Руб.</p>
                <button onClick={goToAssembly} className="home-box_assembly-box_stats-box__navigate-btn">Подробнее о сборке</button>
                <div className="home-box_assembly-box_stats-box_like-box">
                    <p className="home-box_assembly-box_stats-box_like-box__note">{countLike}</p>
                    <AppSvg onClick={getLike} type='like' className={like ? "home-box_assembly-box_stats-box_like-box__icon home-box_assembly-box_stats-box_like-box__icon_dislike" : "home-box_assembly-box_stats-box_like-box__icon home-box_assembly-box_stats-box_like-box__icon_like"} />
                </div>
            </div>
        </div>
    )
}

export function FilterBox() {

    const location = useLocation();

    return (
        <div className="home-box_filter-box">
            <p className="home-box_filter-box__note">Отфильтровать:</p>
            <NavLink to='/home' className={!location.search ? "home-box_filter-box__filter home-box_filter-box__filter_active" : 'home-box_filter-box__filter '}>Все</NavLink>
            <NavLink to='/home?filter=low_price' className={location.search?.includes('low_price') ? "home-box_filter-box__filter home-box_filter-box__filter_active" : 'home-box_filter-box__filter '}>По цене +</NavLink>
            <NavLink to='/home?filter=high_price' className={location.search?.includes('high_price') ? "home-box_filter-box__filter home-box_filter-box__filter_active" : 'home-box_filter-box__filter '}>По цене -</NavLink>
            <NavLink to='/home?filter=low_like' className={location.search?.includes('low_like') ? "home-box_filter-box__filter home-box_filter-box__filter_active" : 'home-box_filter-box__filter '}>По лайкам +</NavLink>
            <NavLink to='/home?filter=high_like' className={location.search?.includes('high_like') ? "home-box_filter-box__filter home-box_filter-box__filter_active" : 'home-box_filter-box__filter '}>По лайкам -</NavLink>
        </div>
    )
}