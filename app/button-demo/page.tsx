"use client"

import Button from '@/components/Button'

export default function ButtonDemo() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Button Component Demo
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Button Variants</h2>
          
          <div className="space-y-6">
            {/* Primary Buttons */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Primary Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="sm">
                  Small Primary
                </Button>
                <Button variant="primary" size="md">
                  Medium Primary
                </Button>
                <Button variant="primary" size="lg">
                  Large Primary
                </Button>
                <Button variant="primary" disabled>
                  Disabled Primary
                </Button>
              </div>
            </div>

            {/* Secondary Buttons */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Secondary Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="secondary" size="sm">
                  Small Secondary
                </Button>
                <Button variant="secondary" size="md">
                  Medium Secondary
                </Button>
                <Button variant="secondary" size="lg">
                  Large Secondary
                </Button>
                <Button variant="secondary" disabled>
                  Disabled Secondary
                </Button>
              </div>
            </div>

            {/* Interactive Examples */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Interactive Examples</h3>
              <div className="flex flex-wrap gap-4">
                <Button 
                  variant="primary" 
                  onClick={() => alert('Primary button clicked!')}
                >
                  Click Me!
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => alert('Secondary button clicked!')}
                >
                  Also Clickable
                </Button>
                <Button 
                  variant="primary" 
                  disabled
                  onClick={() => alert('This should not show')}
                >
                  Won't Work
                </Button>
              </div>
            </div>

            {/* Code Examples */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Usage Examples</h3>
              <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-800">
{`// Primary button
<Button variant="primary" onClick={handleClick}>
  Primary Action
</Button>

// Secondary button
<Button variant="secondary" size="lg">
  Secondary Action
</Button>

// Disabled button
<Button variant="primary" disabled>
  Disabled Button
</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
