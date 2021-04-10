import React, { ReactElement } from 'react'
import styled from '@emotion/styled'

const StyledLoadingMessage = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`

export const LoadingMessage = (): ReactElement<any> => {
  return (
    <StyledLoadingMessage>
      <span>Loading…</span>
    </StyledLoadingMessage>
  )
}
