import { ReactNode } from "react";
import { TransactionInfoType } from "@/types/AccountTypes";
import {  FaArrowDown } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import NumberFlow from "../UI/NumberFlow";
import { MdModeEdit } from "react-icons/md";
import { CategoryIcon } from '@/utils/DropDownList';
import { useCategoryColors } from '@/store/useCatogoryColors';
import { BankList } from "@/utils/BankList";
const TransactionCard = ({
    transaction_data
}:{
    transaction_data : TransactionInfoType
}) => {

    const { colors: categoryColors } = useCategoryColors();
    const bank_name = BankList.find((b)=> b.key == transaction_data?.bank_key)?.code;

    const Deposit =()=>{

        return(
            <div className="flex items-center justify-between">
                <div className="dark:text-white flex items-center py-4">
                        <span className="text-2xl font-bold text-white px-1 rounded-full mr-2">
                            <FaArrowDown className="text-green-500"/>
                        </span>
                    <div className="flex flex-col">
                        
                        <p className="text-sm font-semibold md:text-base">DEPOSIT</p>
                        <p className="text-xs leading-2.5 text-gray-400 font-semibold md:text-base">{bank_name}</p>
                    </div>
                </div>
                <div className="">      
                    <div className="flex w-full justify-end">
                        <strong className={ `text-green-500`}>
                            <NumberFlow
                                value={Number(transaction_data.transaction_detail.delta_amount)}
                                currency='PHP'
                                style='currency'
                            />
                        </strong>
                    </div>                  
                    
                    
                    <div className="flex items-center text-sm gap-2">
                        <NumberFlow
                            value={Number(transaction_data.transaction_detail.prev_amount)}
                            currency='PHP'
                            style='currency'
                        />

                        <FaArrowRightLong/>
                        <NumberFlow
                            value={Number(transaction_data.transaction_detail.new_amount)}
                            currency='PHP'
                            style='currency'
                        />
                    </div>
                </div>
                
            </div>
        )
    }

    const Activity =()=>{
    
    const data = transaction_data?.transaction_detail?.item_details;
    const catBg = categoryColors.find(c => c.category === data?.category)?.color;

        return(
            <div key={data?.id}
                className={`
                    cursor-pointer hover:bg-slate-50 dark:hover:bg-light-dark 
                    flex justify-between w-full
                    
                `}>
                    <div className="dark:text-white flex items-center py-4">
                        <span
                            className="text-2xl font-bold text-white px-1 rounded-full mr-2"
                            style={{ color: catBg }}
                        >
                            {CategoryIcon[data?.category!]}
                        </span>
                        <div className="flex flex-col">
                            
                            <p className="text-sm font-semibold md:text-base">{data?.title}</p>
                            <p className="text-xs leading-2.5 text-gray-400 font-semibold md:text-base">{data?.sub_category}</p>
                        </div>
                    </div>

                <div className="text-right dark:text-white flex items-center">
                    <p className="text-sm font-semibold text-red-500 md:text-base">
                        -₱{data?.price?.toLocaleString()}
                    </p>
                </div>
                
            </div>
        )
    }

    const Edit =()=>{
        const prev_amt = transaction_data?.transaction_detail?.prev_amount || 0;
        const new_amt = transaction_data?.transaction_detail?.new_amount || 0;
        if(prev_amt < new_amt) null;
        
        return(
            <div className="flex items-center justify-between ">
                
                <div className="dark:text-white flex items-center py-4">
                        <span className="text-2xl font-bold text-white px-1 rounded-full mr-2">
                            <MdModeEdit className="text-orange-500"/>
                        </span>
                    <div className="flex flex-col">
                        
                        <p className="text-sm font-semibold md:text-base">EDIT</p>
                        <p className="text-xs leading-2.5 text-gray-400 font-semibold md:text-base">{bank_name}</p>
                    </div>
                </div>
                <div className="">      
                    <div className="flex w-full justify-end">
                        <strong className={ prev_amt < new_amt ? `text-green-500` : `text-red-500`}>
                            { prev_amt < new_amt && '+'}
                            <NumberFlow
                                value={Number(transaction_data.transaction_detail.delta_amount)}
                                currency='PHP'
                                style='currency'
                            />
                        </strong>
                    </div>                  
                    
                    
                    <div className="flex items-center text-sm gap-2">
                        <NumberFlow
                            value={Number(transaction_data.transaction_detail.prev_amount)}
                            currency='PHP'
                            style='currency'
                        />

                        <FaArrowRightLong/>
                        <NumberFlow
                            value={Number(transaction_data.transaction_detail.new_amount)}
                            currency='PHP'
                            style='currency'
                        />
                    </div>
                </div>
                
            </div>
        )
    }


    const Card: Record<string, ReactNode>= {
        'deposit': <Deposit/>,
        'activity': <Activity/>,
        'edit':<Edit/>
    }
 
    return Card[transaction_data.transaction_type];
}

export default TransactionCard
