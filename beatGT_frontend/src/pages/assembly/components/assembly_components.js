import { useState } from "react"

import { assembLike } from "../../../service/route";

export function AssemblyComponent({ logo, price, onClick, children }) {
    return (
        <li className='assembly-box_component-list_row'>
            <img className='assembly-box_component-list_row__logo' src={logo} alt='Изображение отсутствует' />
            <p className='assembly-box_component-list_row__note'>{children}</p>
            <div className='assembly-box_component-list_row_info-box'>
                <p className='assembly-box_component-list_row_info-box__price'>{price} Руб.</p>
                <button onClick={onClick} className='assembly-box_component-list_row_info-box__go-to-component'>Полная информация</button>
            </div>
        </li>
    )
}

export function LikeBtn({ userId, likes, assembId }) {
    const [like, setLike] = useState(likes.includes(userId));

     //Функция оценки
     function getLike(user_id, assembly_id) {
        const data = {
            user_id: user_id,
            assembly_id: assembly_id
        };

        assembLike(data)
            .then(d => setLike(d.like))
            .catch(e => alert('Что-то пошло не так'))
    }

    return (
        <button
            onClick={() => getLike(userId, assembId)}
            disabled={!localStorage.getItem('jwtToken')}
            className={like ? 'assembly-box_footer-box__like-btn assembly-box_footer-box__like-btn_dislike' : 'assembly-box_footer-box__like-btn assembly-box_footer-box__like-btn_like'}
        >
            {like ? 'Разонравилось' : 'Понравилось'}
        </button>
    )
}