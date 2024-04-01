import AppSvg from "../../../svg/AppSvg"

export const CreateComponentItem = ({ id, children, type, note, icon_type, name, onChange, value }) => {
    return (
        <li className="create-component-box_component-items-list_item-box">
            <label className="create-component-box_component-items-list_item-box__label" htmlFor={id}>{children}</label>
            <div className="create-component-box_component-items-list_item-box_input-box">
                <input name={name} value={value} onChange={onChange} id={id} className="create-component-box_component-items-list_item-box_input-box__input" type={type} />
                <AppSvg className="create-component-box_component-items-list_item-box_input-box__icon" type={icon_type} />
            </div>
            <p className="create-component-box_component-items-list_item-box__note">{note}</p>
        </li>
    )
}