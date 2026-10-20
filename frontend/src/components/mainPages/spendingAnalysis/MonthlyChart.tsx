import { useMemo, useState } from "react";
import NumberFlowUI from "@/components/UI/NumberFlow";
import useMonthlyCashFlow from "@/hooks/Analytics/useMonthlyCashFlow";
import type { MonthlyCashFlow } from "@/hooks/Analytics/useMonthlyCashFlow";
import useMonthlyBillTotals from "@/hooks/bills/useMonthlyBillTotals";
import { Link } from "react-router-dom";

interface ChartData {
    month: string;
    total: number;
    pendingBills: number;
}

type Category = "spending" | "savings";

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

const SHOW_BILLS_TO_PAY_STORAGE_KEY = "showBillsToPay";

const getMonthLabel = (monthValue: string): string => {
    const [month] = monthValue.split("-");
    return MONTH_LABELS[String(Number(month))] ?? monthValue;
};

const getBarHeight = (value: number, maxValue: number): number => {
    if (maxValue <= 0) {
        return 0;
    }

    return (value / maxValue) * 100;
};

const getInitialShowBillsToPay = (): boolean => {
    if (typeof window === "undefined") {
        return false;
    }

    return localStorage.getItem(SHOW_BILLS_TO_PAY_STORAGE_KEY) === "true";
};

const MonthlyChart = () => {
    const currentYear = new Date().getFullYear();

    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedCategory, setSelectedCategory] =
        useState<Category>("spending");

    const [showBillsToPay, setShowBillsToPay] = useState(
        getInitialShowBillsToPay
    );

    const { monthlyCashFlow, loading, error } = useMonthlyCashFlow();
    const {
        monthlyBillTotals,
        loading: billsLoading,
        error: billsError,
    } = useMonthlyBillTotals();

    const availableYears = useMemo(() => {
        const years = new Set<number>();

        (monthlyCashFlow ?? []).forEach((entry) => {
            const [, yearValue] = entry.month.split("-");
            const year = Number(yearValue);

            if (Number.isInteger(year) && year > 0) {
                years.add(year);
            }
        });

        years.add(currentYear);

        return [...years].sort((a, b) => b - a);
    }, [currentYear, monthlyCashFlow]);

    const chartData = useMemo(() => {
        const monthlyData: MonthlyCashFlow[] = monthlyCashFlow ?? [];
        const selectedMonths = new Map<string, ChartData>();

        // Get monthly spending or savings data for the selected year.
        monthlyData.forEach((entry) => {
            const [, yearValue] = entry.month.split("-");
            const year = Number(yearValue);

            if (year !== selectedYear) {
                return;
            }

            const total =
                Number(
                    selectedCategory === "spending"
                        ? entry.total_outgoing
                        : entry.savings_increase
                ) || 0;

            selectedMonths.set(entry.month, {
                month: entry.month,
                total,
                pendingBills: 0,
            });
        });

        // Include pending bills only when displaying spending.
        if (showBillsToPay && selectedCategory === "spending") {
            monthlyBillTotals.forEach((bill) => {
                const [, yearValue] = bill.month.split("-");
                const year = Number(yearValue);

                if (year !== selectedYear) {
                    return;
                }

                const monthData = selectedMonths.get(bill.month) ?? {
                    month: bill.month,
                    total: 0,
                    pendingBills: 0,
                };

                monthData.pendingBills += bill.unpaid;

                selectedMonths.set(bill.month, monthData);
            });
        }

        return [...selectedMonths.values()].sort((a, b) => {
            const [aMonth, aYear] = a.month.split("-").map(Number);
            const [bMonth, bYear] = b.month.split("-").map(Number);

            return aYear - bYear || aMonth - bMonth;
        });
    }, [
        monthlyCashFlow,
        monthlyBillTotals,
        selectedYear,
        selectedCategory,
        showBillsToPay,
    ]);

    const maxTotal = Math.max(
        ...chartData.map((entry) => entry.total + entry.pendingBills),
        0
    );

    const barColor =
        selectedCategory === "spending"
            ? "bg-orange-400"
            : "bg-green-400";

    if (loading || billsLoading) {
        return (
            <section className="lg:flex">
                <div className="flex w-full gap-4 overflow-x-scroll rounded-xl py-4 lg:overflow-auto">
                    Loading...
                </div>
            </section>
        );
    }

    if (error || billsError) {
        return (
            <section className="lg:flex">
                <div className="flex w-full gap-4 overflow-x-scroll rounded-xl py-4 lg:overflow-auto">
                    {error
                        ? "Failed to load monthly cash flow."
                        : "Failed to load monthly bill totals."}
                </div>
            </section>
        );
    }

    return (
        <section>
            {/* Chart filters */}
            <div className="mt-3 flex flex-wrap items-end gap-3 pb-2">
                <label className="text-sm dark:text-white">
                    <select
                        aria-label="Filter by year"
                        value={selectedYear}
                        onChange={(event) =>
                            setSelectedYear(Number(event.target.value))
                        }
                        className="rounded-xl border border-gray-400 bg-white px-3 py-2 dark:bg-dark dark:text-white"
                    >
                        {availableYears.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="text-sm dark:text-white">
                    <select
                        aria-label="Filter by category"
                        value={selectedCategory}
                        onChange={(event) =>
                            setSelectedCategory(
                                event.target.value as Category
                            )
                        }
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

                                localStorage.setItem(
                                    SHOW_BILLS_TO_PAY_STORAGE_KEY,
                                    String(isChecked)
                                );

                                setShowBillsToPay(isChecked);
                            }}
                            aria-label="Show Bills to Pay"
                            className="h-4 w-4 accent-orange-500"
                        />

                        Show Bills to Pay
                    </label>
                )}
            </div>

            {/* Monthly chart */}
            {chartData.length === 0 ? (
                <div className="py-4 text-sm text-gray-500 dark:text-gray-300">
                    No{" "}
                    {selectedCategory === "spending"
                        ? "spending"
                        : "savings increase"}{" "}
                    data for {selectedYear}.
                </div>
            ) : (
                <div className="flex w-full gap-4 overflow-x-scroll rounded-xl py-4 lg:overflow-auto">
                    {chartData.map((entry) => {
                        const total = entry.total + entry.pendingBills;

                        const barHeight = getBarHeight(
                            entry.total,
                            maxTotal
                        );

                        const pendingBillHeight = getBarHeight(
                            entry.pendingBills,
                            maxTotal
                        );

                        return (
                            <div className="min-w-14" key={entry.month}>
                                <div className="flex h-60 items-end justify-center">
                                    <div className="flex h-full flex-col items-center justify-end">
                                        <div className="mb-1 text-[10px] dark:text-white">
                                            <NumberFlowUI
                                                value={total}
                                                currency="PHP"
                                                style="currency"
                                            />
                                        </div>

                                        {/* Pending bills segment */}
                                        {entry.pendingBills > 0 && (
                                            <Link
                                             to="/bills"
                                                title={`Pending bills: ₱${entry.pendingBills.toLocaleString(
                                                    undefined,
                                                    {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    }
                                                )}`}
                                                className="w-10 cursor-pointer rounded-t bg-orange-200 opacity-70 transition-opacity hover:opacity-100"
                                                style={{
                                                    height: `${pendingBillHeight}%`,
                                                }}
                                            />
                                        )}

                                        {/* Spending or savings segment */}
                                        <div
                                            title={`₱${entry.total.toLocaleString(
                                                undefined,
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }
                                            )}`}
                                            className={`w-10 cursor-pointer transition-opacity hover:opacity-80 ${barColor} ${
                                                entry.pendingBills > 0
                                                    ? "rounded-b"
                                                    : "rounded"
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
            )}
        </section>
    );
};

export default MonthlyChart;