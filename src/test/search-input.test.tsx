import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchInput from "@/components/ui/search-input"

describe('SearchInput', () => {
  it('renders with the default placeholder', () => {
    render(<SearchInput />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.getAttribute('placeholder')).toMatch(/search/i)
  })

  it('renders with a custom placeholder', () => {
    render(<SearchInput placeholder="Custom placeholder" />)
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeTruthy()
  })

  it('calls onSubmit with the input value when the form is submitted', async () => {
    const onSubmit = vi.fn()
    render(<SearchInput onSubmit={onSubmit} />)

    const input = screen.getByRole('textbox') as HTMLInputElement
    await userEvent.type(input, 'test query')

    const form = input.closest('form')
    expect(form).not.toBeNull()
    if (form) {
      fireEvent.submit(form)
    }

    expect(onSubmit).toHaveBeenCalledWith('test query')
  })

  it('calls onChange with the input value as it changes', async () => {
    const onChange = vi.fn()
    render(<SearchInput onChange={onChange} />)

    const input = screen.getByRole('textbox') as HTMLInputElement
    await userEvent.type(input, 'test')

    expect(onChange).toHaveBeenCalled()
    const lastCallArg = onChange.mock.calls[onChange.mock.calls.length - 1][0]
    expect(lastCallArg).toBe('test')
  })

  it('clears the input when the clear button is clicked', async () => {
    render(<SearchInput />)

    const input = screen.getByRole('textbox') as HTMLInputElement
    await userEvent.type(input, 'test')

    const clearButton = screen.getByLabelText(/clear/i)
    await userEvent.click(clearButton)

    expect(input.value).toBe('')
  })

  it('is disabled when the disabled prop is true', () => {
    render(<SearchInput disabled />)

    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.disabled).toBe(true)
  })

  it('updates the value when valueSearch prop changes', () => {
    const { rerender } = render(<SearchInput valueSearch="initial" />)

    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.value).toBe('initial')

    rerender(<SearchInput valueSearch="updated" />)
    expect(input.value).toBe('updated')
  })
})