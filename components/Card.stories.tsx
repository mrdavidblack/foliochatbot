import type { Meta, StoryObj } from '@storybook/react'
import Card from './Card'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Card>

export const WithImage: Story = {
  args: {
    title: 'Card with Image',
    description: 'This card shows an image with text content.',
    imageSrc: 'https://picsum.photos/400/225',
    imageAlt: 'Sample landscape',
  },
}

export const TextOnly: Story = {
  args: {
    title: 'Text-only Card',
    description: 'A simple card without image.',
  },
}

export const Linked: Story = {
  args: {
    title: 'Linked Card',
    description: 'This card is clickable and goes to Next.js website.',
    href: 'https://nextjs.org',
  },
}


