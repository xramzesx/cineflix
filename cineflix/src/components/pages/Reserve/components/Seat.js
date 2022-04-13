import { useState } from "react"

const Seat = props => {
    const { id, selected, disabled, index } = props
    
    const [ isSelected, setSelected ] = useState( selected )
    // console.log('selected',selected)
    

    const handleClick = e => {
        if ( !disabled ) {
            if ( props.onClick )
                setSelected( props.onClick( isSelected, id ) )
            else
                setSelected( !isSelected )
        }

    }

    const mclass = 'screening-room__seat'
    const className = `${mclass} ${ 
        isSelected ? `${mclass}--selected`:"" 
    } ${
        disabled ? `${mclass}--disabled` : ""
    }`

    // console.log(disabled ? id:"")

    return (
        <button 
            className={className}
            onClick={ handleClick }
        > 
            { id } 
        </button>
    )
}

export default Seat