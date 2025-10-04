import type { Meta, StoryObj } from '@storybook/react'
import PromptBar from './PromptBar'

const meta: Meta<typeof PromptBar> = {
  title: 'Components/PromptBar',
  component: PromptBar,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PromptBar>

export const Default: Story = {
  args: {
    placeholder: 'Type your prompt...'
  },
  render: (args) => (
    <div className="max-w-xl">
      <PromptBar {...args} onSend={() => {}} />
    </div>
  )
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <div className="max-w-xl">
      <PromptBar {...args} onSend={() => {}} />
    </div>
  )
}


