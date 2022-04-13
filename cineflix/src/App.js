// import logo from './logo.svg';
import './App.scss';
import { 
  BrowserRouter as Router, 
  // HashRouter as Router,
  Route, 
  Link, 
  Switch
} from "react-router-dom";

import { basename } from './Settings.json'

import Main from './components/pages/Main/Main';
import Movie from './components/pages/Movie/Movie';
import Account from './components/pages/Account/Account';
import Reserve from './components/pages/Reserve/Reserve';
import Check from './components/pages/Check/Check';
import Wildcard from './components/pages/Wildcard/Wildcard';
// import Settings from './Settings.json'
// const useUrl = () => {
//   let location = useLocation()
//   useEffect( () => {

//     console.log(location.pathname)
//   }, [location])
// }


const App = () => {
  const apiRegex = /^\/api\/?.*/
  const apiRegex2 = /^\/jkedra\/api\/?.*/
  
  console.log(apiRegex.test(window.location.pathname), window.location.pathname)

  if ( apiRegex.test(window.location.pathname ) || apiRegex2.test(window.location.pathname)) {
    return <div/>
  } else {
    return (
      <div className="container">
        <Router> {/*  basename={ Settings.basename } */}
          <header className="navbar">
            {/* <div className="navbar__logo">
              logo
            </div> */}
            <Link to={`${basename}`}> 
              Home 
            </Link>
            <nav>
              <Link to={`${basename}movies`}> Filmy </Link>
              <Link to={`${basename}check`}> Sprawdź rezerwację </Link>
              {/* <Link to={`${basename}account`} className="link--icon"><img srcSet="/account.svg" alt="account"/>Konto</Link> */}
              <Link to={`${basename}account`}><img srcSet={`${basename}user.svg`} alt="account"/>Konto</Link>
            </nav>

          </header>
          <Switch onChange={() => { console.log('zmieniono route') }}>
            <Route exact path={`${basename}`} component={ Main } />
            <Route exact path={`${basename}check/:id`} component={ Check }/>
            <Route exact path={`${basename}check` } component={ Check }/>
            
            <Route exact path={`${basename}movies`}>
              <Main scrollTo="movies"/>
            </Route>
            <Route exact path={`${basename}movie/:id`} component={ Movie }/>
            <Route exact path={`${basename}reserve/:id`} component={ Reserve }/>
            {/* <Route exact path=`${basename}account/:id` component={Account} /> */}
            <Route exact path={`${basename}account/add/:id`} component={ Account }/>
            <Route exact path={`${basename}account/:id`} component={ Account }/>
            <Route exact path={`${basename}account/`} component={ Account }/>
            {/* <Route component={ Wildcard }/> */}
            <Route component={ Wildcard }/>
          </Switch>
          <footer className="footer">
            <h1> O nas! </h1>
            <p> Do prawidłowego funkcjonowania strony wykorzystywane są pliki cookies</p>
            <p> Strona ta stanowi część projektu na zajęcia szkolne. Została ona zrobiona z wykorzystaniem technologii PHP oraz React. Kino Cineflix nie istnieje naprawdę, a wszelkie dane gromadzone na stronie będą usunięte </p>
          </footer>
        </Router>

        {/* {window.location.pathname}    */}
      </div>
    )
  }


}


export default App;
