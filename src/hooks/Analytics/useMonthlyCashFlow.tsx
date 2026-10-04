import React from 'react'
import supabase from '@/lib/supabase'
import { useUserStore } from '@/store/useUserStore'

type MonthlyCashFlow = {
    email: string
    month: string
    total_incoming: number
    total_outgoing: number
}

const useMonthlyCashFlow = () => {
    const [monthlyCashFlow, setMonthlyCashFlow] = React.useState<MonthlyCashFlow[]>([])
    const [loading, setLoading] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string | null>(null)

    const { user } = useUserStore();

    const fetchMonthlyCashFlow = React.useCallback(async () => {
        if (!user?.id) {
            setMonthlyCashFlow([])
            setError('Owner ID is required')
            return
        }

        setLoading(true)
        setError(null)

        const { data, error } = await supabase.rpc(
            'get_monthly_cash_flow',
            {
                p_owner: user.id,
            }
        )

        if (error) {
            console.error('Error fetching monthly cash flow:', error)

            setMonthlyCashFlow([])
            setError(error.message)
            setLoading(false)

            return
        }

        setMonthlyCashFlow(data ?? [])
        setLoading(false)
    }, [user?.id])

    React.useEffect(() => {
        fetchMonthlyCashFlow()
    }, [fetchMonthlyCashFlow])

    return {
        monthlyCashFlow,
        loading,
        error,
        refetch: fetchMonthlyCashFlow,
    }
}

export default useMonthlyCashFlow