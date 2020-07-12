import classNames from 'classnames';
import React, { FunctionComponent } from 'react';
import { useLocation } from 'react-router';
import { Link, Route, Switch } from 'react-router-dom';
import { Edit } from '../edit';
import { Examine } from '../examine';
import { Home } from '../home';
import './styles.scss';

const tabs = { home: '/', examine: '/examine' };

const App: FunctionComponent = () => {
  const { pathname } = useLocation();
  return (
    <div className="app-container">
      <table>
        <tbody>
          <tr>
            <td>
              <h3>gLexicon</h3>
            </td>
            {Object.entries(tabs).map(([key, path]) => (
              <td key={key}>
                <Link
                  to={path}
                  className={classNames({ active: pathname === path })}
                >
                  {`| ${key.charAt(0).toUpperCase()}${key.substr(1)} |`}
                </Link>
              </td>
            ))}
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
