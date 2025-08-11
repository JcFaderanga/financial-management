import { 
  IoFastFoodOutline,
  IoGameControllerOutline,
  IoGiftOutline,
  IoBusinessOutline,
  IoPhonePortraitOutline,
  IoPeopleOutline  } from "react-icons/io5";
import { GrMapLocation } from "react-icons/gr";
import { PiJeep ,PiGraduationCap,PiShoppingCartSimple  } from "react-icons/pi";
import { LiaGrinHeartsSolid } from "react-icons/lia";
import { HiOutlineNewspaper } from "react-icons/hi2";
import { BsCashCoin } from "react-icons/bs";
import { CgData } from "react-icons/cg";
import { GrMore } from "react-icons/gr";
import { RiBilliardsLine } from "react-icons/ri";
import { ReactNode } from "react";

export const itemCategory: Array<string> = [
    "Bills", "Education", "Food", "Games", "Gifts", "Hotel", "Load", "Lottery",
    "Others", "Payments", "Phone", "Shopping", "Social", "Staycation",
    "Transportation", "Wants"
  ];

export const Icon: Record<string, ReactNode> ={
Food: <IoFastFoodOutline/>,
Games: <IoGameControllerOutline/>,
Gifts: <IoGiftOutline/>,
Hotel: <IoBusinessOutline/>,
Phone: <IoPhonePortraitOutline/>,
Social: <IoPeopleOutline/>,
Staycation: <GrMapLocation/>,
Transportation: <PiJeep/>,
Wants: <LiaGrinHeartsSolid/>,
Bills: <HiOutlineNewspaper/>,
Education: <PiGraduationCap/>,
Shopping: <PiShoppingCartSimple/>,
Payments: <BsCashCoin/>,
Load: <CgData/>,
Others: <GrMore/>,
Lottery: <RiBilliardsLine/>,
}