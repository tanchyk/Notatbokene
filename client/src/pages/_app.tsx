import React from "react";
import {ChakraProvider, ColorModeProvider} from '@chakra-ui/react'
import theme from '../theme'

const MyApp: React.FC = ({ Component, pageProps }: any) => {
  return (
          <ChakraProvider resetCSS theme={theme}>
              <ColorModeProvider
                  options={{
                      useSystemColorMode: true,
                  }}
              >
                  <Component {...pageProps} />
              </ColorModeProvider>
          </ChakraProvider>
  )
}

export default MyApp
