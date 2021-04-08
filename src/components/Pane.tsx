import styled from '@emotion/styled'

export const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`

export const LeftPane = styled.div`
  width: 300px;
  background-color: blue;
`

export const MainPane = styled.div`
  flex-grow: 1;
  position: relative;
`
