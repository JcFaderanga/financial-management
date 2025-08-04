import { ReactNode, useEffect, useRef } from "react";
import { FaXmark } from "react-icons/fa6";
import { useModal } from "@/store/useModal";

const CustomModal = ({ children, hidden }: { children?: ReactNode; hidden?: boolean }) => {
  const { isModal, setModal } = useModal();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable scroll when modal is open
    if (hidden) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [hidden]);

  const handleOverlayClick = () => {
    setModal(false); // close when clicking outside
  };

  const preventClose = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent closing when clicking inside
  };

  return (
    <section
      onClick={handleOverlayClick}
      className={`${
        hidden ? "fixed" : "hidden"
      } inset-0 flex justify-center items-center lg:justify-end 
          w-full px-4 lg:px-0 h-screen bg-[rgba(0,0,0,0.6)] backdrop-blur-sm z-[100]`}
    >
      <div
        ref={modalRef}
        onClick={preventClose}
        className="bg-white dark:bg-medium-dark rounded-xl lg:rounded-none max-w-200 lg:h-full"
      >
        <div onClick={() => setModal(!isModal)} className="flex justify-end p-2 cursor-pointer">
          <FaXmark size={20} className="text-slate-500" />
        </div>
        <div className="dark:text-white">{children}</div>
      </div>
    </section>
  );
};

export default CustomModal;
