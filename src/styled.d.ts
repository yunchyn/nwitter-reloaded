import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    textColor: string;
    inputColor: string;
    bgColor: string;
    themeColor: string;
    hoverColor: string;
    borderColor: string;
  }
}
