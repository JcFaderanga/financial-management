import { ReactNode } from "react";
import { IoPeopleOutline, IoBusiness, IoCart, IoNewspaperSharp, IoFastFoodSharp, IoGiftSharp, IoCardSharp, IoPhonePortrait } from "react-icons/io5";
import { GiGraduateCap, GiConsoleController } from "react-icons/gi";
import { LiaGrinHeartsSolid } from "react-icons/lia";
import { FaBusAlt } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import { CgData } from "react-icons/cg";
import { GrMore } from "react-icons/gr";
import { RiBilliardsLine } from "react-icons/ri";

export const itemCategory: string[] = [
  "Bills", "Education", "Food", "Games", "Gifts", "Hotel", "Load", "Lottery",
  "Others", "Payments", "Phone", "Shopping", "Social", "Staycation",
  "Transportation", "Wants"
];

export const CategoryIcon: Record<string, ReactNode> = {
  Food: <IoFastFoodSharp />,
  Games: <GiConsoleController />,
  Gifts: <IoGiftSharp />,
  Hotel: <IoBusiness />,
  Phone: <IoPhonePortrait />,
  Social: <IoPeopleOutline />,
  Staycation: <FaMapLocationDot />,
  Transportation: <FaBusAlt />,
  Wants: <LiaGrinHeartsSolid />,
  Bills: <IoNewspaperSharp />,
  Education: <GiGraduateCap />,
  Shopping: <IoCart />,
  Payments: <IoCardSharp />,
  Load: <CgData />,
  Others: <GrMore />,
  Lottery: <RiBilliardsLine />,
};
