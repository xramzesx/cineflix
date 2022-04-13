import { useState } from 'react'
import './form.scss'

const Option = ({ name, value }) => (
        <option value={ value }>{ name }</option>
)



const Select = props => {
    const { label, id, name } = props
    const options = props.options || [ {name : "---", value : -1 } ]

    const [ focus, setFocus ] = useState(false)
    
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

    const handleChange = e => {
        if (props.onChange)
            props.onChange(e, name)
    }

    return (
        <div className={`select-box ${ focus ? "select-box--focused" : ""} ${ props.className || '' }`}>
            <select 
                className="select" 
                onChange={ handleChange }
                name={ props.name || '' }
                onFocus={handleFocus}
                onBlur={handleBlur} 
            >
                { 
                    options.map( 
                        ( {name, value} , i ) => <Option name={name} value={value} key={i}/> 
                    ) 
                }
            </select>
            { label || id ? (
                <label className="select__label">
                    { label || id }
                </label>
            ) : null }
        </div>
    )
}

export default Select