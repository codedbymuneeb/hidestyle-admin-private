export default function StatsCard({ title, value, icon, trend, color = "blue" }) {
    const colorClasses = {
        blue: "from-blue-500 to-blue-600",
        green: "from-green-500 to-green-600",
        purple: "from-purple-500 to-purple-600",
        orange: "from-orange-500 to-orange-600"
    };

    return (
        <div className="float-card p-6 group cursor-pointer">
            <div className="flex items-start justify-between">
                <div className="flex-grow">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        {title}
                    </p>
                    <h3 className="text-3xl font-bold mt-2 transition-all duration-300 group-hover:scale-105" style={{ color: 'var(--text-primary)' }}>
                        {value}
                    </h3>
                    {trend && (
                        <div className="flex items-center gap-1 mt-2">
                            <svg className={`w-4 h-4 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`} fill="currentColor" viewBox="0 0 20 20">
                                {trend > 0 ? (
                                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                ) : (
                                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                )}
                            </svg>
                            <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {Math.abs(trend)}%
                            </span>
                        </div>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}
