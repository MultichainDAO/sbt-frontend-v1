// import original module declarations
import "styled-components"

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme {    
    colors: {
      main: string,
      secondary: string,
      tertiary: string,
      highlight: string,
      text: string,
      highlightFaint: string
    }
  }
}

