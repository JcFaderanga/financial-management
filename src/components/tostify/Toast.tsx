import React, { useEffect, useState } from 'react';
import './toast.css';
import { LiaTrashSolid } from "react-icons/lia";
import { itemTypes } from '@/types/itemTypes';

interface ToastType {
  toastList?: itemTypes[];
  duration: number;
  onClick?: (id: string | number | undefined) => void;
}

const Progress: React.FC<{ duration: number }> = ({ duration }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev - 100 / (duration * 10);
        return next <= 0 ? 0 : next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div
      className="bg-white h-full transition-all duration-[30ms]"
      style={{ width: `${progress}%` }}
    />
  );
};

export const ToastDelete: React.FC<ToastType> = ({ toastList = [], duration, onClick }) => {
  return (
    <div className="absolute top-10 right-5 space-y-2">
      {toastList.map((item) => (
        <div key={item.id} className="flex justify-end toast-animation">
          <div className="rounded bg-[#e23e32] text-white w-fit grid shadow-lg">
            <div className="flex items-center px-4 py-2">
              <div className="bg-white rounded-2xl p-1">
                <LiaTrashSolid size={18} className="text-red-600" />
              </div>
              <h3 className="pl-2 pr-8">{item.title}</h3>
              <button
                onClick={() => onClick?.(item.id)}
                className="bg-red-400 px-4 py-1 rounded-xl ml-2"
              >
                Undo
              </button>
              <button className="ml-2">x</button>
            </div>
            <div className="h-1.5 bg-red-300 w-full rounded-b overflow-hidden">
              <Progress duration={duration} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
