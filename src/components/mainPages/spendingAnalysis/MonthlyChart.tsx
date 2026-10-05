import NumberFlowUI from "@/components/UI/NumberFlow";
import useMonthlyCashFlow from "@/hooks/Analytics/useMonthlyCashFlow";

interface MonthlyData {
    month: string;
    total_outgoing: number;
}

const months: Record<string, string> = {
    "1": "Jan",
    "2": "Feb",
    "3": "Mar",
    "4": "Apr",
    "5": "May",
    "6": "Jun",
    "7": "Jul",
    "8": "Aug",
    "9": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec",
};

const MonthlyChart = () => {
    const { monthlyCashFlow, loading, error } = useMonthlyCashFlow();

    if (loading) {
        return (
            <section className="lg:flex">
                <div className="flex py-4 gap-4 rounded-xl overflow-x-scroll lg:overflow-auto w-full">
                    Loading...
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="lg:flex">
                <div className="flex py-4 gap-4 rounded-xl overflow-x-scroll lg:overflow-auto w-full">
                    Failed to load monthly cash flow.
                </div>
            </section>
        );
    }

    const monthlyData: MonthlyData[] = monthlyCashFlow ?? [];

    const maxOutgoing = Math.max(
        ...monthlyData.map((month) => month.total_outgoing),
        0
    );

    return (
        <section className="lg:flex">
            <div className="flex py-4 gap-4 rounded-xl overflow-x-scroll lg:overflow-auto w-full">
                {monthlyData.map((e) => {
                    const barHeight =
                        maxOutgoing > 0
                            ? (e.total_outgoing / maxOutgoing) * 100
                            : 0;

                    const monthNumber = String(
                        Number(e.month.slice(0, 2))
                    );

                    return (
                        <div
                            className="min-w-14"
                            key={e.month}
                        >
                            <div className="h-60 flex items-end justify-center">
                                <div className="flex flex-col justify-end items-center h-full">
                                    <div className="text-[10px] dark:text-white mb-1">
                                        <NumberFlowUI
                                            value={e.total_outgoing}
                                            currency="PHP"
                                            style="currency"
                                        />
                                    </div>

                                    <div
                                        className="bg-orange-400 w-10 rounded-lg hover:bg-orange-500 cursor-pointer transition-all"
                                        style={{
                                            height: `${barHeight}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="text-center text-sm mt-2 dark:text-white">
                                {months[monthNumber]}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default MonthlyChart;