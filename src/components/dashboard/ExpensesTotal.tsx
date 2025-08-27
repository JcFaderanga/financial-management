import OverviewDate from '@/hooks/OverviewDate';
import { useOverviewTotal } from '@/store/useOverviewTotal';
import NumberFlowUI from '../UI/NumberFlow';

const OverView = () => {
  const {timeRange } = OverviewDate();
  const {total} = useOverviewTotal();

  return (
    <div className="text-center items-center justify-between ">
      <div>
        <p className="text-slate-400 md:text-xl">Expenses</p>
        <h2 className="text-sm text-slate-400 ">{timeRange}</h2>
      </div>

      <section className="text-center"> 
        <strong className="text-2xl md:text-3xl dark:text-white !text-red-400">
            <NumberFlowUI
              value={total}
              currency='PHP'
              style='currency'
            />
        </strong>
      </section>

    </div>
  );
};

export default OverView;
