
interface CardProps {
    label: string;
    value: number | string;
    colorClass: string;
}

const Card = ({ label, value, colorClass }: CardProps) => {
    return(
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center min-w-[140px]">
            <span className="text-sm font-semibold text-black mb-1">{label}</span>
            <span className={`text-3xl font-bold ${colorClass}`}>{value}</span>
        </div>
    )
}

export default Card;