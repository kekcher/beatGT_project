import AppSvg from "../../../svg/AppSvg"
import { Loader } from "../../../global_components/Loader"
import { component_header } from "../../../constants"
import { useNavigate } from "react-router-dom"

export function ComponentStatusBox({ type, error }) {
    return (
        <div className='create-assembly-box_assembly-msg-box_assembly-item-box'>
            <div className='create-assembly-box_assembly-msg-box_assembly-item-box_logo-box'>
                <AppSvg type={type} className='create-assembly-box_assembly-msg-box_assembly-item-box_logo-box__logo' />
                <h1 className='create-assembly-box_assembly-msg-box_assembly-item-box_logo-box__note'>{component_header[type]}</h1>
                <div className='create-assembly-box_assembly-msg-box_assembly-item-box_logo-box_status-box'>
                    <AppSvg type={error.length ? 'close' : 'accept'} className='create-assembly-box_assembly-msg-box_assembly-item-box_logo-box_status-box__icon' />
                </div>
            </div>
            {
                error.length > 0 && (
                    <ol className='create-assembly-box_assembly-msg-box_assembly-item-box_error-list'>
                        {
                            error.map((item, idx) => {
                                return <li key={idx} className='create-assembly-box_assembly-msg-box_assembly-item-box_error-list__error'>{item}</li>
                            })
                        }
                    </ol>
                )
            }
        </div>
    )
}

export function AddComponent({ className, header, type, load, onChange, components, idx, addComponent, search, count, next, back, onChangeCount }) {

    const navigate = useNavigate();

    return (
        <div className={className}>
            <h1 className='create-assembly-box_add-component-box__head'>{header}</h1>
            <div className='create-assembly-box_add-component-box_input-box'>
                <input value={search} onChange={(e) => onChange(e.target.value, type)} type='text' placeholder='Найти комплектующее' className='create-assembly-box_add-component-box_input-box__search' />
                <p className='create-assembly-box_add-component-box_input-box__note'>Введите строку типа "бренд,модель"</p>
                {
                    ['ram', 'gpu', 'hard_disk'].includes(type) && (
                        <>
                            <input min='1' onChange={onChangeCount} value={count || 0} type='number' className="create-assembly-box_add-component-box_input-box__number" />
                            <p className='create-assembly-box_add-component-box_input-box__note'>Кол-во</p>
                        </>
                    )
                }
            </div>
            <ul className='create-assembly-box_add-component-box_component-list'>
                {
                    load ?
                        (
                            <Loader />
                        )
                        :
                        (
                            <>
                                {
                                    components.length > 0 ?
                                        (
                                            <>
                                                {
                                                    components.map((item, idx) => {
                                                        return <li key={idx} onClick={() => addComponent(type, item)} className='create-assembly-box_add-component-box_component-list__item'>{item.brand} {item.model}</li>
                                                    })
                                                }
                                            </>
                                        )
                                        :
                                        (
                                            <>
                                                Комплектующее не найдено!
                                            </>
                                        )
                                }
                            </>
                        )
                }
            </ul>
            <div className='create-assembly-box_add-component-box_not-found-box'>
                <p className='create-assembly-box_add-component-box_not-found-box__note'>Не нашли комплектующее?</p>
                <button onClick={() => navigate(`/create_component?type=${type}`)} className='create-assembly-box_add-component-box_not-found-box__create-btn'>Создать</button>
            </div>
            <div className='create-assembly-box_add-component-box_navigate-box'>
                <button onClick={() => back(type)} disabled={idx === 0} className='create-assembly-box_add-component-box_navigate-box__navigate-btn'>Назад</button>
                <button onClick={next} disabled={idx === 7} className='create-assembly-box_add-component-box_navigate-box__navigate-btn'>Далее</button>
            </div>
        </div>
    )
}

export function SaveAssembly({ className, info, clear, error, name, handleChangeName, handleSubmit, load }) {
    function getAllPrice() {
        let result = 0;
        info.forEach(item => {
            result += item.price
        })
        return result;
    }

    return (
        <form onSubmit={(e) => handleSubmit(e, getAllPrice())} className={className}>
            <p onClick={clear} className='create-assembly-box_assembly-form__clear'>Очистить</p>
            {
                info.map(item => {
                    return (
                        <div key={item.id} className='create-assembly-box_assembly-form_component-box'>
                            <img className='create-assembly-box_assembly-form_component-box__logo' src={item.logo} alt='' />
                            <p className='create-assembly-box_assembly-form_component-box__name'>{item.name}</p>
                            <p className='create-assembly-box_assembly-form_component-box__price'>{item.price} Руб.</p>
                        </div>
                    )
                })
            }
            <input onChange={handleChangeName} value={name} className="create-assembly-box_assembly-form__name" type="text" placeholder="Введите название сборки" />
            <div className='create-assembly-box_assembly-form_save-box'>
                <div className='create-assembly-box_assembly-form_save-box_price-box'>
                    <p className='create-assembly-box_assembly-form_save-box_price-box__note'>Итого:</p>
                    <p className='create-assembly-box_assembly-form_save-box_price-box__price'>{getAllPrice()} Руб.</p>
                </div>
                {
                    !Object.keys(error).find(k => error[k].length > 0) && (
                        <>
                            {
                                load ?
                                    (
                                        <Loader />
                                    )
                                    :
                                    (
                                        <input type='submit' className='create-assembly-box_assembly-form_save-box__save' value='Создать' />
                                    )
                            }
                        </>
                    )
                }
            </div>
        </form>
    )
}