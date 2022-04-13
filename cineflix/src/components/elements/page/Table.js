import Row from "./Row"

const Table = props => {

    const { 
        name
    } = props

    const data = props.data || []

    return (
        <>
            <h3> { name } </h3>
            <table className="table" style={ `grid-template-columns:repeat(${ data.length }, auto` }>
                {
                    data.map( ( row, i ) => (
                        <Row data={row} key={i}/>
                    ))
                }
            </table>
        </>
    )
    // return (
    //     <>
    //         <h3> { name } </h3>
    //         <div className="table" style={ `grid-template-columns:repeat(${ data.length }, auto` }>
    //             {
    //                 () => data.map( ( row, i ) => (
    //                     <Row data={row} key={i}/>
    //                 ))
    //             }
    //         </div>
    //     </>
    // )
}

export default Table