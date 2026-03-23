interface Step {
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number; // 0-based index
  variant?: "light" | "dark";
}

export default function StepIndicator({
  steps,
  currentStep,
  variant = "light",
}: StepIndicatorProps) {
  const isDark = variant === "dark";

  return (
    <div className="flex items-start w-full py-6">
      {steps.map((_, index) => {
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
                  isDone
                    ? isDark
                      ? "bg-indigo-500"
                      : "bg-green-400"
                    : isDark
                      ? "bg-white/10"
                      : "bg-gray-200"
                }`}
              />
            )}

            {/* 원 */}
            <div
              className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border transition-all duration-300 ${
                isDone
                  ? isDark
                    ? "bg-indigo-600 border-indigo-500 text-white"
                    : "bg-green-50 border-green-400 text-green-600"
                  : isActive
                    ? isDark
                      ? "bg-indigo-600 border-indigo-400 text-white ring-4 ring-indigo-500/25"
                      : "bg-blue-50 border-blue-400 text-blue-600 ring-4 ring-blue-100"
                    : isDark
                      ? "bg-[#2a2a2f] border-white/15 text-white/30"
                      : "bg-white border-gray-200 text-gray-400"
              }`}
            >
              {isDone ? "✓" : index + 1}
            </div>
          </div>
        );
      })}
    </div>
  );
}
