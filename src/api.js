import { mapServerData } from './mappers';

export function loadList() {
  return fetch('/api/stations')
    .then(response => response.json())
    .then(mapServerData)
    .catch(err=>Promise.reject(err)); //добавляем обработку ошибок
}

export function loadDetails(id) 
{
  return fetch(`/api/stations/${id}`)
    .then(response => response.json()) //делаем цепочки промисов в едином стиле с переносом
    .catch(err=>Promise.reject(err)); //добавляем обработку ошибок
}
