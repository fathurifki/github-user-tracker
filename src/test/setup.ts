import { afterEach } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { getQueriesForElement } from '@testing-library/dom'


afterEach(() => {
  cleanup()
})

const customRender = (ui: React.ReactElement) => {
  const container = document.createElement('div')
  const root = render(ui, { container })
  return {
    ...root,
    ...getQueriesForElement(container)
  }
}

export { customRender as render }