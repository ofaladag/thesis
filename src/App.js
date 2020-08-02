import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Route, Switch
} from "react-router-dom";
import PlayGround from "./containers/Playground";
import { paths } from './commons/Constants';
import Survey from './containers/survey/Survey';
function App() {
  return (
    <Router>
      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Switch>
        <Route path={paths.SURVEY+"/:id?"}>
          <Survey />
        </Route>
        <Route path={paths.PLAYGROUND}>
          <PlayGround />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
