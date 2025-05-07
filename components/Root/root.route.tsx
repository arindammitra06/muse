
import store, { persistor } from "@/store/store";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import MantineContent from "./mantineContent";


export interface RootAppProps {
  children: ReactNode;
};

export default function RootApp({ children}:RootAppProps) {
  
  return (

    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <MantineContent>
          {children}
          </MantineContent>
          </PersistGate>
      </Provider>
  );
}
