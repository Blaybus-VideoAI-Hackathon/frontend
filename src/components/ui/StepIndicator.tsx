interface Step {
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  variant?: "light" | "dark";
}

export default function StepIndicator({
  steps,
  currentStep,
  variant = "light",
}: StepIndicatorProps) {
  const isDark = variant === "dark";

  return (
    <div className="w-full pb-6">
      <div className="flex w-full items-center">
        {steps.map((step, index) => {
          const isDone = index < currentStep;
          const isActive = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div
              key={step.label}
              className={`flex items-center ${isLast ? "" : "flex-1"}`}
            >
              {/* 원 + 라벨 */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium transition-all duration-300 ${
                    isDone
                      ? isDark
                        ? "border-indigo-500 bg-indigo-600 text-white"
                        : "border-green-400 bg-green-50 text-green-600"
                      : isActive
                        ? isDark
                          ? "border-indigo-400 bg-indigo-600 text-white ring-4 ring-indigo-500/25"
                          : "border-blue-400 bg-blue-50 text-blue-600 ring-4 ring-blue-100"
                        : isDark
                          ? "border-white/15 bg-[#2a2a2f] text-white/30"
                          : "border-gray-200 bg-white text-gray-400"
                  }`}
                >
                  {isDone ? "✓" : index + 1}
                </div>
              </div>

              {/* 연결선 */}
              {!isLast && (
                <div className="mx-3 h-px flex-1">
                  <div
                    className={`h-full w-full transition-colors duration-300 ${
                      isDone
                        ? isDark
                          ? "bg-indigo-500"
                          : "bg-green-400"
                        : isDark
                          ? "bg-white/10"
                          : "bg-gray-200"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
