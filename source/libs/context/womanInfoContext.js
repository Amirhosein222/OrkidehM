import React, { useState } from 'react';
import moment from 'moment-jalaali';

const WomanInfoContext = React.createContext();

let saveWomanRelations;
let saveFullInfo;
let saveActiveRel;

const WomanInfoProvider = function ({ children }) {
  const [rels, setRels] = useState([]);
  const [fullInfo, setFullInfo] = useState(null);
  const [periodInfo, setPeriodInfo] = useState(null);
  const [activeRel, setActiveRel] = useState(null);
  const [settings, setSettings] = useState(null);
  const [registerStage, setRegisterStage] = useState(0);
  const [userCalendar, setUserCalendar] = useState(null);
  const [userPeriodDays, setUserPeriodDays] = useState(null);
  const [isPeriodDay, setIsPeriodDay] = useState(false);

  saveWomanRelations = function (relations) {
    setRels(relations);
  };

  saveFullInfo = function (info) {
    setFullInfo(info);
  };

  saveActiveRel = function (rel) {
    setActiveRel(rel);
  };

  const saveSettings = (sets) => {
    setSettings(sets);
  };

  const handleRegisterStage = (stage) => {
    setRegisterStage(stage);
  };

  const savePeriodInfo = (info) => {
    setPeriodInfo(info);
  };

  const handleUserPeriodDays = (pDays) => {
    setUserPeriodDays(pDays);
    const today = moment().locale('en').format('YYYY-MM-DD');
    const result = pDays.find(
      (d) => moment(d.date, 'X').locale('en').format('YYYY-MM-DD') === today,
    );
    setIsPeriodDay(result ? true : false);
  };

  const handleUserCalendar = (calendar) => {
    setUserCalendar(calendar);
  };

  return (
    <WomanInfoContext.Provider
      value={{
        relations: rels,
        activeRel: activeRel,
        settings,
        saveSettings,
        fullInfo: fullInfo,
        saveFullInfo,
        registerStage,
        handleRegisterStage,
        handleUserPeriodDays,
        userPeriodDays,
        isPeriodDay,
        periodInfo,
        savePeriodInfo,
        userCalendar,
        handleUserCalendar,
      }}>
      {children}
    </WomanInfoContext.Provider>
  );
};

export {
  WomanInfoContext,
  WomanInfoProvider,
  saveWomanRelations,
  saveFullInfo,
  saveActiveRel,
};
