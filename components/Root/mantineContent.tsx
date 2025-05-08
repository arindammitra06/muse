
import store, { persistor } from "@/store/store";
import { MantineProvider } from "@mantine/core";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Navigation from "../navigation.route";
import { NavigationProgress } from "@mantine/nprogress";
import { orangeTheme } from "@/theme";
import { useAppSelector } from "@/store/hooks";
import { Toaster } from "react-hot-toast";
import { ModalsProvider } from "@mantine/modals";

export interface MantineContentProps {
  children: ReactNode;
};

export default function MantineContent({ children }: MantineContentProps) {
  const currentTheme = useAppSelector((state) => state.theme.theme);
  //const language = useAppSelector((state) => state.language.language);

  
  // useEffect(() => {
  //   i18next.changeLanguage(language);

  // }, [language]);

  return (

    <MantineProvider theme={currentTheme !== null && currentTheme !== undefined ? currentTheme : orangeTheme} withCssVariables>
      <NavigationProgress />
      <Toaster
        position="bottom-center"
        reverseOrder={false} />
      <Navigation>
        <ModalsProvider>
          {children}
        </ModalsProvider>
      </Navigation>
    </MantineProvider>
  );
}
