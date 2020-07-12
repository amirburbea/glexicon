import classNames from 'classnames';
import React, { FunctionComponent } from 'react';
import { useLocation } from 'react-router';
import { Link, Route, Switch } from 'react-router-dom';
import { Edit } from '../Edit';
import { Examine } from '../Examine';
import { Home } from '../Home';
import './styles.scss';

const App: FunctionComponent = () => {
  const location = useLocation();

  return (
    <div className="app-container">
      <table style={{ margin: '0 auto' }}>
        <tbody>
          <tr>
            <td>
              <h3>gLexicon</h3>
            </td>
            <td>
              <Link
                to="/"
                className={classNames({
                  active: location.pathname === '/',
                })}
              >
                | Home |
              </Link>
            </td>
            <td>
              <Link
                to="/examine"
                className={classNames({
                  active: location.pathname === '/examine',
                })}
              >
                | Examine |
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
      <Switch>
        <Route path="/examine" component={Examine} />
        <Route path="/edit" component={Edit} />
        <Route path="/" component={Home} />
      </Switch>
    </div>
  );
};

export default App;
