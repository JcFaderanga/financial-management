import supabase from '@/lib/supabase'
import { useEffect, useState } from 'react'

const GroupSpending = ({ groupId }: { groupId: string | number | undefined }) => {
    const [groupItem, setGroupItem] = useState<any>(null)

    const fetchItemInGroup = async () => {
    const { data } = await supabase
      .from('grouped_item')
      .select('*, items(*)')
      .eq('id', groupId)

    setGroupItem(data)
  }

  useEffect(() => {
    if (groupId) {
      fetchItemInGroup()
    }
  }, [groupId])

  return (
    <div>
      {groupItem?.map((group: any) => {
        // Calculate total
        const totalPrice = group.items?.reduce(
          (sum: number, item: any) => sum + Number(item.price || 0),
          0
        )

        return (
          <div key={group.id} className="mb-4 p-2 px-4 rounded w-full">
            <div className="border-b border-slate-300 pb-4 flex justify-between">
              <h2 className="font-bold text-xl">
                {group.title}{' '}
                <span className="text-slate-400">{`[${group.category}]`}</span>
              </h2>
              <h2 className="font-semibold text-lg text-green-600">
                ₱{totalPrice.toLocaleString()}
              </h2>
            </div>

            {group.items?.map((item: any) => (
              <div key={item.id} className="flex justify-between p-2">
                <div>
                  <span>{item.title}</span>
                </div>
                <span>₱{Number(item.price).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

export default GroupSpending
