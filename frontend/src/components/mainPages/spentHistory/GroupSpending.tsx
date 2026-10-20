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
          <div key={group.id} className="w-full p-2 px-4 mb-4 rounded">
            <div className="flex justify-between pb-4 border-b border-slate-300">
              <h2 className="text-xl font-bold">
                {group.title}{' '}
                <span className="text-slate-400">{`[${group.category}]`}</span>
              </h2>
              <h2 className="text-lg font-semibold text-green-600">
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
