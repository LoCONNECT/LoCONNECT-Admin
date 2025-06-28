import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      mainColor: string;
      mainLightColor: string;
      gray2Color: string;
      gray4Color: string;
      gray5Color: string;
      blackColor: string;
    };
  }
}

declare global {
  export interface Window {
    daum: any;
  }
}
