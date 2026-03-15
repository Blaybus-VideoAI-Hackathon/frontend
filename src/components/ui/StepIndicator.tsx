interface Step {
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number; // 0-based index
}

export default function StepIndicator({
  steps,
  currentStep,
}: StepIndicatorProps) {
  return (
    <div className="flex items-start w-full py-6">
      {steps.map((step, index) => {
        const isDone = index < currentStep;
        const isActive = index === currentStep;

        return (
          <div
            key={index}
            className="flex flex-col items-center flex-1 relative"
          >
            {/* 연결선 */}
            {index < steps.length - 1 && (
              <div
                className={`absolute top-4 left-1/2 w-full h-px transition-colors duration-300 ${
                  isDone ? "bg-green-400" : "bg-gray-200"
                }`}
              />
            )}

            {/* 원 */}
            <div
              className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border transition-all duration-300 ${
                isDone
                  ? "bg-green-50 border-green-400 text-green-600"
                  : isActive
                    ? "bg-blue-50 border-blue-400 text-blue-600 ring-4 ring-blue-100"
                    : "bg-white border-gray-200 text-gray-400"
              }`}
            >
              {isDone ? "✓" : index + 1}
            </div>

            {/* 라벨 */}
            <span
              className={`mt-2 text-xs text-center leading-snug max-w-16 transition-colors duration-300 ${
                isActive
                  ? "text-gray-900 font-medium"
                  : isDone
                    ? "text-gray-500"
                    : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
