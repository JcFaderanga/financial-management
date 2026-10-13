import NumberFlowUI from "@/components/UI/NumberFlow";
import useMonthlyCashFlow from "@/hooks/Analytics/useMonthlyCashFlow";

interface MonthlyData {
    month: string;
    total_outgoing: number;
}

interface PendingBills {
    month: string;
    totalOutgoing: number;
}

const MONTH_LABELS: Record<string, string> = {
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

const PENDING_BILLS: PendingBills = {
    month: "10-2026",
    totalOutgoing: 2766.00
,
};

const getMonthLabel = (monthValue: string) => {
    const monthNumber = String(Number(monthValue.slice(0, 2)));
    return MONTH_LABELS[monthNumber] ?? monthValue;
};

const getBarHeight = (value: number, maxValue: number) => {
    if (maxValue <= 0) {
        return 0;
    }

    return (value / maxValue) * 100;
};

const MonthlyChart = () => {
    const { monthlyCashFlow, loading, error } = useMonthlyCashFlow();

    if (loading) {
        return (
            <section className="lg:flex">
                <div className="flex w-full gap-4 overflow-x-scroll rounded-xl py-4 lg:overflow-auto">
                    Loading...
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="lg:flex">
                <div className="flex w-full gap-4 overflow-x-scroll rounded-xl py-4 lg:overflow-auto">
                    Failed to load monthly cash flow.
                </div>
            </section>
        );
    }

    const monthlyData: MonthlyData[] = monthlyCashFlow ?? [];
    const maxOutgoing = Math.max(...monthlyData.map((entry) => entry.total_outgoing), 0);

    return (
        <section className="lg:flex">
            <div className="flex w-full gap-4 overflow-x-scroll rounded-xl py-4 lg:overflow-auto">
                {monthlyData.map((entry) => {
                    const hasPendingBills = entry.month === PENDING_BILLS.month && PENDING_BILLS.totalOutgoing > 0;
                    const monthlyOutgoingTotal = hasPendingBills
                        ? entry.total_outgoing + PENDING_BILLS.totalOutgoing
                        : entry.total_outgoing;

                    const barHeight = getBarHeight(entry.total_outgoing, maxOutgoing);
                    const barHeightWithPendingBills = getBarHeight(
                        monthlyOutgoingTotal,
                        maxOutgoing
                    );

                    const pendingBillHeight =
                        hasPendingBills && monthlyOutgoingTotal > 0
                            ? (PENDING_BILLS.totalOutgoing / monthlyOutgoingTotal) *
                              barHeightWithPendingBills
                            : 0;

                    return (
                        <div className="min-w-14" key={entry.month}>
                            <div className="flex h-60 items-end justify-center">
                                <div className="flex h-full flex-col items-center justify-end">
                                    <div className="mb-1 text-[10px] dark:text-white">
                                        <NumberFlowUI
                                            value={monthlyOutgoingTotal}
                                            currency="PHP"
                                            style="currency"
                                        />
                                    </div>

                                    {hasPendingBills && (
                                        <div
                                            title={`₱${PENDING_BILLS.totalOutgoing.toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                            })}`}
                                            className="w-10 rounded-t bg-orange-300 opacity-30 transition-all hover:bg-orange-500 cursor-pointer"
                                            style={{
                                                height: `${pendingBillHeight}%`,
                                            }}
                                        />
                                    )}

                                    <div
                                        title={`₱${entry.total_outgoing.toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                        })}`}
                                        className={`w-10 bg-orange-400 transition-all hover:bg-orange-500 cursor-pointer ${
                                            hasPendingBills ? "rounded-b" : "rounded"
                                        }`}
                                        style={{
                                            height: `${barHeight}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="mt-2 text-center text-sm dark:text-white">
                                {getMonthLabel(entry.month)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default MonthlyChart;