
import store, { persistor, RootState } from "@/store/store";
import { MantineProvider } from "@mantine/core";
import { ReactNode } from "react";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Navigation from "../navigation.route";
import { NavigationProgress } from "@mantine/nprogress";
import { useAppSelector } from "@/store/hooks";
import { Toaster } from "react-hot-toast";
import { ModalsProvider } from "@mantine/modals";
import  { LoaderModal } from "../Common/GlobalLoader";
import { getCustomTheme } from "@/theme";

export interface MantineContentProps {
  children: ReactNode;
};

export default function MantineContent({ children }: MantineContentProps) {
  const primaryColor = useSelector((state: RootState) => state.theme.primaryColor);

  const customTheme = getCustomTheme(primaryColor);
  //const language = useAppSelector((state) => state.language.language);

  
  // useEffect(() => {
  //   i18next.changeLanguage(language);

  // }, [language]);

  return (

    <MantineProvider theme={customTheme} withCssVariables>
      <NavigationProgress />
      <Toaster
        position="bottom-center"
        reverseOrder={false} />
      <Navigation>
        <ModalsProvider modals={{ loader: LoaderModal }}>
          {children}
        </ModalsProvider>
      </Navigation>
    </MantineProvider>
  );
}
