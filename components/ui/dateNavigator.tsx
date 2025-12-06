import { ChevronLeft, ChevronRight } from "lucide-react";

interface DateNavigatorProps {
    label: 'Mes' | 'Semana',
    onPrev: () => void,
    onNext: () => void,
}

export default function DateNavigator({ label, onPrev, onNext}: DateNavigatorProps) {
    return (
        <div className="flex items-center gap-2">
            <button className="h-10 w-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            onClick={onPrev}>
                <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button className="h-10 px-6 flex items-center justify-center rounded-lg bg-gray-200 hover:bg-gray-300 font-medium text-gray-700 transition-colors">
                <span>{label}</span>
            </button>
            <button className="h-10 w-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            onClick={onNext}>
                <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
        </div>
    )
}