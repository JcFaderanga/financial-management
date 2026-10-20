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
          className="fixed bottom-0 z-10 w-full py-3 text-center transition-all duration-300 bg-white border-t"
        >
          {props.item ||  "Type something..."}
        </div>
        }
        { props.price ??
        <div
          className="fixed bottom-0 z-10 w-full py-3 text-center transition-all duration-300 bg-white border-t"
        >
          {props.price ||  "Type something..."}
        </div>
        }
    </div>
  )
}

export default ItemList