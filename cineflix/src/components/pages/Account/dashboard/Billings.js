import { useEffect } from "react"
import Subsection from "../../../elements/page/Subsection"
// import Table from "../../../elements/page/Table"

const Table = ( { name, content} ) => {
    let keys = []
    if ( content.length )
        keys = Object.keys( content[0] )

    return (
        <div className="billings--table">
            <h2> 
                {name} 
            </h2>
            {
                content.length ? (
                    <table>
                        <thead>
                            <tr>
                                { keys.map( ( header, i ) => <th key={i}> { header } </th> ) }
                            </tr>
                        </thead>
                        <tbody>
                            { content.map( ( row, i ) => {
                                const rowResult = []
                                for ( let j in keys ) {
                                    rowResult.push( <td key={j}> { row[ keys[j] ] || "--- null ---" } </td> )
                                }

                                return (
                                    <tr key={i}> 
                                        { rowResult } 
                                    </tr>
                                )
                            }) }
                        </tbody>
                    </table>
                ) : <p> Nie ma jeszcze żadnych elementów </p>
            }
        </div>
    )
}

const Billings = ({ tables }) => {
    console.log(tables)
    
    // console.log('czy to działa?')

    tables = tables || []

    return (
        <>
            <h2> Billingi </h2>
            {
                tables.length
                ? tables.map( ( { name, content }, i ) => <Table name={name} content={content} key={i}/>  ) 

                // JSON.stringify( tables )
                // tables.map( 
                //     ( table, i ) => <Table key={i} data={ table } />
                // )
                : <h2> Aktualnie brak jakichkolwiek danych do przedstawienia </h2>
            }
        </>
    )
}

export default Billings