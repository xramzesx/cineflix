
// const Row = ({ data }) => {
//     return data.map( element => <div className="table__row"> {element} </div> )
// }

const Row = ({ data }) => {

    return (
        <tr>
            { data.map( elem => <td> { elem } </td> ) }
        </tr>
    )
}

export default Row