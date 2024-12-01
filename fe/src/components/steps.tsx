export function Steps() {
  const steps = [
    {
      title: 'Project Setup',
      description: 'Initialize project with Vite and configure TypeScript',
      status: 'complete'
    },
    {
      title: 'Component Structure',
      description: 'Create basic component hierarchy and routing setup',
      status: 'current'
    },
    {
      title: 'State Management',
      description: 'Implement global state management with Zustand',
      status: 'pending'
    },
    {
      title: 'API Integration',
      description: 'Connect to backend services and implement data fetching',
      status: 'pending'
    },
    {
      title: 'Testing',
      description: 'Write unit tests and integration tests',
      status: 'pending'
    }
  ]

  return (
    <div className="p-4 space-y-4">
      <h2 className="font-semibold text-lg">Build Steps</h2>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  step.status === 'complete'
                    ? 'bg-green-500'
                    : step.status === 'current'
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
                }`}
              />
              <h3 className="font-medium">{step.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground pl-4">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

