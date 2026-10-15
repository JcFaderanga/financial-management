import { useMemo, useState } from "react";
import NumberFlowUI from "@/components/UI/NumberFlow";
import useMonthlyCashFlow from "@/hooks/Analytics/useMonthlyCashFlow";
import type { MonthlyCashFlow } from "@/hooks/Analytics/useMonthlyCashFlow";

interface PendingBills {
    dueDate: string;
    amount: number;
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

const PENDING_BILLS: PendingBills[] = [
    {
        dueDate: "2026-10-01",
        amount: 2766,
    },
];
const SHOW_BILLS_TO_PAY_STORAGE_KEY = "showBillsToPay";

const getMonthLabel = (monthValue: string) => {
    const [month] = monthValue.split("-");
    return MONTH_LABELS[String(Number(month))] ?? monthValue;
};

const getBarHeight = (value: number, maxValue: number) => {
    if (maxValue <= 0) {
        return 0;
    }

    return (value / maxValue) * 100;
};

const MonthlyChart = () => {
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedCategory, setSelectedCategory] = useState<"spending" | "savings">("spending");
    const [showBillsToPay, setShowBillsToPay] = useState(
        () => localStorage.getItem(SHOW_BILLS_TO_PAY_STORAGE_KEY) === "true"
    );
    const { monthlyCashFlow, loading, error } = useMonthlyCashFlow();

    const availableYears = useMemo(() => {
        const years = new Set(
            (monthlyCashFlow ?? []).flatMap((entry) => {
                const year = Number(entry.month.split("-")[1]);
                return Number.isInteger(year) ? [year] : [];
            })
        );
        years.add(currentYear);
        return [...years].sort((a, b) => b - a);
    }, [currentYear, monthlyCashFlow]);

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

    const monthlyData: MonthlyCashFlow[] = monthlyCashFlow ?? [];
    const selectedMonths = new Map<string, { total: number; pendingBills: number }>();

    monthlyData.forEach((entry) => {
        const [, year] = entry.month.split("-");
        if (Number(year) !== selectedYear) {
            return;
        }

        selectedMonths.set(entry.month, {
            total: Number(
                selectedCategory === "spending"
                    ? entry.total_outgoing
                    : entry.savings_increase
            ) || 0,
            pendingBills: 0,
        });
    });

    if (showBillsToPay && selectedCategory === "spending") {
        PENDING_BILLS.forEach((bill) => {
            const date = new Date(`${bill.dueDate}T00:00:00`);
            if (date.getFullYear() !== selectedYear) {
                return;
            }

            const month = `${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
            const monthData = selectedMonths.get(month) ?? { total: 0, pendingBills: 0 };
            monthData.pendingBills += bill.amount;
            selectedMonths.set(month, monthData);
        });
    }

    const chartData = [...selectedMonths.entries()]
        .map(([month, data]) => ({ month, ...data }))
        .sort((a, b) => {
            const [aMonth, aYear] = a.month.split("-").map(Number);
            const [bMonth, bYear] = b.month.split("-").map(Number);
            return aYear - bYear || aMonth - bMonth;
        });
    const maxTotal = Math.max(
        ...chartData.map((entry) => entry.total + entry.pendingBills),
        0
    );
    const barColor = selectedCategory === "spending" ? "bg-orange-400" : "bg-green-400";
    const pendingBillColor = "bg-orange-300 opacity-30";

    return (
        <section>
            <div className="flex flex-wrap items-end gap-3 pb-2 mt-3">
                <label className="text-sm dark:text-white">
                    <select
                        aria-label="Filter by year"
                        value={selectedYear}
                        onChange={(event) => setSelectedYear(Number(event.target.value))}
                        className="rounded-xl border border-gray-400 bg-white px-3 py-2 dark:bg-dark dark:text-white"
                    >
                        {availableYears.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </label>

                <label className="text-sm dark:text-white">
                    <select
                        aria-label="Filter by category"
                        value={selectedCategory}
                        onChange={(event) => setSelectedCategory(event.target.value as "spending" | "savings")}
                        className="rounded-xl border border-gray-400 bg-white px-3 py-2 dark:bg-dark dark:text-white"
                    >
                        <option value="spending">Spending</option>
                        <option value="savings">Savings Increase</option>
                    </select>
                </label>
                
                {selectedCategory === "spending" && (
                    <label className="flex items-center gap-2 pb-2 text-sm dark:text-white">
                        <input
                            type="checkbox"
                            checked={showBillsToPay}
                            onChange={(event) => {
                            const isChecked = event.target.checked;
                            localStorage.setItem(SHOW_BILLS_TO_PAY_STORAGE_KEY, String(isChecked));
                            setShowBillsToPay(isChecked);
                        }}
                        aria-label="Show Bills to Pay"
                        className="h-4 w-4 accent-orange-500"
                    />
                    Show Bills to Pay
                </label>
            )}
            </div>

            {chartData.length === 0 ? (
                <div className="py-4 text-sm text-gray-500 dark:text-gray-300">
                    No {selectedCategory === "spending" ? "spending" : "savings increase"} data for {selectedYear}.
                </div>
            ) : (
                <div className="flex w-full gap-4 overflow-x-scroll rounded-xl py-4 lg:overflow-auto">
                    {chartData.map((entry) => {
                        const total = entry.total + entry.pendingBills;
                        const barHeight = getBarHeight(entry.total, maxTotal);
                        const pendingBillHeight = getBarHeight(entry.pendingBills, maxTotal);

                        return (
                            <div className="min-w-14" key={entry.month}>
                                <div className="flex h-60 items-end justify-center">
                                    <div className="flex h-full flex-col items-center justify-end">
                                        <div className="mb-1 text-[10px] dark:text-white">
                                            <NumberFlowUI value={total} currency="PHP" style="currency" />
                                        </div>

                                        {entry.pendingBills > 0 && (
                                            <div
                                                title={`Pending bills: ₱${entry.pendingBills.toLocaleString(undefined, {
                                                    minimumFractionDigits: 2,
                                                })}`}
                                                className={`w-10 cursor-pointer rounded-t transition-all hover:bg-orange-500 ${pendingBillColor}`}
                                                style={{ height: `${pendingBillHeight}%` }}
                                            />
                                        )}

                                        <div
                                            title={`₱${entry.total.toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                            })}`}
                                            className={`w-10 cursor-pointer transition-all hover:opacity-80 ${barColor} ${
                                                entry.pendingBills > 0 ? "rounded-b" : "rounded"
                                            }`}
                                            style={{ height: `${barHeight}%` }}
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
            )}
        </section>
    );
};

export default MonthlyChart;