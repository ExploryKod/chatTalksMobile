import React, {useState, useEffect} from 'react';
import {useLoggedStore} from '../StateManager/userStore';
import Toast from 'react-native-toast-message';
export default function useGetData(apiEndPoint: string) {
  const {token} = useLoggedStore();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    async function fetchDatas() {
      try {
        const response = await fetch(apiEndPoint, {
          method: 'GET',
          mode: 'cors',
          credentials: 'same-origin',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          Toast.show({
            type: 'error',
            text1: 'Il y a eu une erreur dans la requête au serveur',
            text2:
              "il peut s'agir d'un problème de connexion: contactez l'administrateur",
          });
          return;
        }

        const responseData = await response.json();
        setError(null);
        setData(responseData);
        setIsLoading(false);
      } catch (err) {
        setData(null);
        setError('Il y a eu une erreur dans la requête');
        setIsLoading(false);
      }
    }

    fetchDatas();
  }, [apiEndPoint, token]);

  return {data, error, isLoading};
}
