import React from 'react'

type item={
    price: string,
    item: string
}

interface listProps{
    props: item;
}
    
    
const ItemList = ({props}:listProps) => {
  return (
    <div>
          { props.item ??
        <div
          className="fixed bottom-0 z-10 bg-white border-t w-full text-center py-3 transition-all duration-300"
        >
          {props.item ||  "Type something..."}
        </div>
        }
        { props.price ??
        <div
          className="fixed bottom-0 z-10 bg-white border-t w-full text-center py-3 transition-all duration-300"
        >
          {props.price ||  "Type something..."}
        </div>
        }
    </div>
  )
}

export default ItemList