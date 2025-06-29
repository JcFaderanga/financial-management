import React, { useState } from 'react'
import supabase from '@/lib/supabase'
import { itemTypes } from '@/types/itemTypes'

const useSaveItem = () => {
  const [spendings, setSpendings] = useState<itemTypes[] | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const handleSaveItem = async (item: itemTypes) => {
    setLoading(true)
    try {
      const { error: insertError, data } = await supabase
        .from('items')
        .insert(item)
        .select();

      if (insertError) {
        console.error('Error saving data:', insertError)
        setError(insertError)
      } else {
        setSpendings(data)
        setError(null) // Clear previous error if success
        return data;
      }
    } catch (err: any) {
      console.error('Unexpected error:', err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return { spendings, error, loading, handleSaveItem }
}

export default useSaveItem
