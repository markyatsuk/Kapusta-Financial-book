import React, { useEffect, useState } from 'react';
import AddTransaction from '../../components/AddTransaction/AddTransaction';
// import Container from '../../components/Container';
import BalanceContainer from '../../components/Container/BalanceContainer';

import TransactionsList from '../../components/TransactionsList/TransactionsList';
import TransactionsListMobile from '../../components/TransactionsList/TransactionListMobile';
import Summary from '../../components/Summary';
import Balance from '../../components/Balance';
import ToGoReport from '../../components/ToGoReport';
import DateForm from '../../components/DateForm';

import useWindowDimensions from '../../hooks/useWindowDimensions';

import contextProps from '../../context/context';
import s from './BalanceView.module.css';
// import { useSelector } from 'react-redux';
// import { getLoader } from '../../redux/transactions';
// import OnLoader from '../../components/OnLoader';

const BalanceView = () => {
  const [type, setType] = useState('income');
  const [date, setDate] = useState('');
  const [year, setYear] = useState('');
  const [picker, setPicker] = useState(false);
  const [listRender, setListRender] = useState(true);
  // const loader = useSelector(getLoader);

  useEffect(() => {
    setDate(startDate);
    setYear(startDate.split('.')[2]);
    /* eslint-disable-next-line */
  }, []);

  const setNewDate = date => {
    setDate(date);
    setYear(date.split('.')[2]);
  };
  const handleCalendarClick = () => {
    setPicker(true);
  };

  const closePicker = dateNew => {
    const newDate = `${dateNew.getUTCDate()}.${
      dateNew.getUTCMonth() + 1
    }.${dateNew.getUTCFullYear()}`;

    setDate(newDate);
    setYear(newDate.split('.')[2]);
    setPicker(false);
  };
  const contextValueBalance = {
    type,
    picker,
    handleCalendarClick,
    closePicker,
    date,
    setNewDate,
  };
  const typeToggle = e => {
    setType(`${e.target.title}`);
  };

  const onArrow = e => {
    typeToggle(e);
    return listRender ? setListRender(false) : setListRender(true);
  };
  const onBack = () => {
    setListRender(true);
  };

  const viewPort = useWindowDimensions();

  const day = new Date();

  const startDate = `${day.getDate()}.${
    day.getMonth() + 1
  }.${day.getFullYear()}`;

  return (
    <contextProps.Provider value={contextValueBalance}>
      <BalanceContainer>
        {/* {loader && <OnLoader />} */}
        {viewPort.width >= 768 && (
          <>
            <div className={s.balanceContainer}>
              <div>
                <Balance />
              </div>
              <div>
                <ToGoReport />
              </div>
            </div>
            <div className={s.holst}>
              <div className={s.buttonContainer}>
                <button
                  className={`${s.buttonSpentIncome} ${
                    type === 'expense' && s.buttonSpentIncomeActive
                  }`}
                  onClick={typeToggle}
                  title="expense"
                >
                  EXPENSE
                </button>
                <button
                  className={`${s.buttonSpentIncome} ${
                    type === 'income' && s.buttonSpentIncomeActive
                  }`}
                  onClick={typeToggle}
                  title="income"
                >
                  INCOME
                </button>
              </div>
              <AddTransaction />
              <div className={s.dataContainer}>
                <TransactionsList transactionType={type} date={date} />
                {viewPort.width > 1280 && <Summary type={type} />}
              </div>
            </div>
            <div className={s.containerSummary768}>
              {viewPort.width <= 1279 && viewPort.width > 768 && (
                <Summary type={type} />
              )}
            </div>
          </>
        )}
        {viewPort.width < 768 && (
          <>
            {listRender ? (
              <>
                <div className={s.holst}>
                  <ToGoReport />
                </div>
                <div className={s.balanceContainer}>
                  <Balance />
                </div>
                <DateForm
                  date={date}
                  handleCalendarClick={handleCalendarClick}
                  closePicker={closePicker}
                  picker={picker}
                />
                <TransactionsListMobile transactionType={type} date={date} />
                <div className={s.buttonContainer}>
                  <button
                    className={`${s.buttonExpense} ${
                      type === 'expense' && s.buttonSpentIncomeActive
                    }`}
                    onClick={onArrow}
                    title="expense"
                  >
                    CONSUMPTION
                  </button>
                  <button
                    className={`${s.buttonIncome} ${
                      type === 'income' && s.buttonSpentIncomeActive
                    }`}
                    onClick={onArrow}
                    title="income"
                  >
                    INCOME
                  </button>
                </div>
              </>
            ) : (
              <>
                <button className={s.buttonArrowGoBack} onClick={onArrow}>
                  &#8592;
                </button>
                <AddTransaction
                  onCloseForm={onBack}
                  transactionType={type}
                  date={date}
                />
              </>
            )}
          </>
        )}
      </BalanceContainer>
    </contextProps.Provider>
  );
};

export default BalanceView;
