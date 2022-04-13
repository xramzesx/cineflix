import { useState } from 'react'
import './form.scss'


const Input = props => {
    const { id, label } = props

    const [ focus, setFocus ] = useState( false )

    const handleFocus = e => {
        if ( props.onFocus )
            props.onFocus()
        setFocus(true)
    }

    const handleBlur = e => {
        if ( props.onBlur )
            props.onBlur()
        setFocus(false)
    }

    return (
        <div className={`input ${props.className}`}>
            <input
                {...props}
                className="input__inp"
            />
            <label className="input__label">
                {label || id}
            </label>
        </div>

    )
}

export default Input