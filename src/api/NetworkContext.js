import React, {createContext, useState, useEffect, useContext} from 'react';
import NetInfo from '@react-native-community/netinfo';

const NetInfoContext = createContext();

export const NetInfoProvider = ({children}) => {
  const [isConnected, setIsConnected] = useState(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  return (
    <NetInfoContext.Provider value={{isConnected}}>
      {children}  
    </NetInfoContext.Provider>
  );
};

export const useNetInfo = () => {
  return useContext(NetInfoContext);
};