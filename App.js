import { registerRootComponent } from "expo";
import * as React from "react";
import Navigator from "./routes/Drawer";
import {AppProvider} from "./context/AppProvider";

export default class App extends React.Component {
  render() {
    return (
      <>
        <AppProvider>
          <Navigator></Navigator>
        </AppProvider>
      </>
    );
  }
}

registerRootComponent(App);
