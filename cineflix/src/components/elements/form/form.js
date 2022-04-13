import './form.scss'
import Textbox from './textbox'

const Form = props => {

    const { 
        method, 
        onSubmit,
        children,
        submitClassName,
        className,
        submitValue,
        message
    } = props

    return (
        <form method={ method } onSubmit={ onSubmit } className={`form ${ className }`} >
            <fieldset disabled={ props.disabled }>            
                { children }

                { 
                    message 
                    ? (
                        <div className="form__message"> {message} </div>
                    )
                    : null 
                }
                <Textbox
                    className={ `submit ${ submitClassName || '' }` }
                    type="submit"
                    value={ submitValue }
                    required
                />
            </fieldset>
        </form>
    )

}

export default Form