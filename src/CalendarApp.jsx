import { Provider } from "react-redux";
import { AppRouter } from "./router";
import { BrowserRouter } from "react-router-dom"
import { store } from "./store";


export const CalendarApp = () => {
  return (
    <Provider store={ store } >
      <BrowserRouter>
      {/* <HashRouter> */}
        <AppRouter />
      {/* </HashRouter> */}
      </BrowserRouter>
    </Provider>
  )
}
