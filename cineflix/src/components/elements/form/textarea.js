import { useState } from 'react'
import './form.scss'

const Textarea = props => {
    const { id, label, name, onChange } = props

    const additionalProps = props.additionalProps || {}

    const [ focus, setFocus ] = useState(false)
    const [ isEmpty, setEmpty ] = useState( props.value ? false : true )


    const handleChange = e => {
        if ( props.onChange )
            props.onChange( e, name || id || label)
        setEmpty( e.target.value.length ? false : true )
    }

    const handleFocus = () => {
        if ( props.onFocus )
            props.onFocus()
        setFocus(true)
    }

    const handleBlur = () => {
        if ( props.onBlur )
            props.onBlur()
        setFocus(false)
    }


    return (
        <div className={`textbox textarea ${ focus ? "textbox--focus" : "" } ${ isEmpty ? "" : "textbox--fill" } ${ props.className || '' }`}>
            <textarea
                name={ name }
                id={ id }
                onChange={ handleChange }
                value={ props.value }
                className="textbox__input"
                onFocus={handleFocus}
                onBlur={handleBlur}
                type={ props.type }
                required={props.required}
                { ...additionalProps }
            >
                { props.value }
            </textarea>
            { label || id ? (
                <label className="textbox__label">
                    { label || id }
                </label>
            ) : null }
        </div>
    )
}

export default Textarea