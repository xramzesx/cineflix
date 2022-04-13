import { forwardRef } from "react"

const Subsection = forwardRef( ( props, ref ) => {
    return (
        <div ref={ref} className={`subsection ${ props.className || '' }`}>
            { props.title 
                ? <h2> { props.title } </h2>
                : null
            }
            { props.children }
        </div>
    )
})

export default Subsection