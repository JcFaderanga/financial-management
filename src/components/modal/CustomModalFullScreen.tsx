import { ReactNode, useEffect, useRef } from "react";
import { FaXmark } from "react-icons/fa6";
import { useModalFull } from "@/store/useModal";

const CustomModalFullScreen = ({ children, hidden }: { children?: ReactNode; hidden?: boolean }) => {
  const { isModalFS, setModalFS } = useModalFull();
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
    setModalFS(false); // close when clicking outside
  };

  const preventClose = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent closing when clicking inside
  };

  return (
    <section
      onClick={handleOverlayClick}
      className={`${
        hidden ? "fixed" : "hidden"
      } lg:justify-end overflow-y-scroll
          w-full lg:px-0 h-screen bg-[rgba(0,0,0,0.6)] z-[100]`}
    >
      <div
        ref={modalRef}
        onClick={preventClose}
        className="bg-white dark:bg-dark rounded-xl lg:rounded-none h-full lg:mt-0"
      >
        <div onClick={() => setModalFS(!isModalFS)} className="flex justify-end p-2 cursor-pointer">
          <FaXmark size={20} className="text-slate-500" />
        </div>
        <div className="dark:text-white">{children}</div>
      </div>
    </section>
  );
};

export default CustomModalFullScreen;
