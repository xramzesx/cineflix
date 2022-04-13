import { Redirect } from "react-router"
import { basename } from '../../../../../Settings.json'

const Add = props => {

    console.log(props)

    return (
        <>
            <Redirect to={ basename + 'account' }/>
        </>
    )
}

export default Add