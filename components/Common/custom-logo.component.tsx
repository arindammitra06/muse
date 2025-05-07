
import { Dispatch, FC, SetStateAction } from "react";
import logo from '../../assets/images/app_logo.png';
export type LogoProps = {
    logoPath: string,
    alt: string,
    size: string;
    isClosed?:boolean;
    setIsButtonClicked? : Dispatch<SetStateAction<boolean>>;
};
   
  



export const AppLogo: FC<LogoProps> = ({logoPath,alt}) => {
  
    return (
        <img src={logo.src} alt={alt} width="120px"/> 
)};
