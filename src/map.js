import { loadList, loadDetails } from './api';
import { getDetailsContentLayout } from './details';
import { createFilterControl } from './filter';

export default function initMap(ymaps, containerId) { //добавил default, т.к. это единственная функция, которую экспортирует модуль
  const myMap = new ymaps.Map(containerId, {
    center: [55.76, 37.64],
    controls: [],
    zoom: 10
  });

  const objectManager = new ymaps.ObjectManager({
    clusterize: true,
    gridSize: 64,
    clusterIconLayout: 'default#pieChart',
    clusterDisableClickZoom: false,
    geoObjectOpenBalloonOnClick: false,
    geoObjectHideIconOnBalloonOpen: false,
	geoObjectBalloonContentLayout: getDetailsContentLayout(ymaps)
  });

  objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');


  // details
  objectManager.objects.events.add('click', event => {
    const objectId = event.get('objectId');
    const obj = objectManager.objects.getById(objectId);


    if (!obj.properties.details) {
      loadDetails(objectId).then(data => {
		console.log(data);
        obj.properties.details = data;
		console.log(obj)
        objectManager.objects.balloon.setData(obj);
      });
    }
	
    objectManager.objects.balloon.open(objectId);
	
  });

  // filters
 /* const listBoxControl = createFilterControl(ymaps);
  myMap.controls.add(listBoxControl);

  var filterMonitor = new ymaps.Monitor(listBoxControl.state);
  filterMonitor.add('filters', filters => {
    objectManager.setFilter(
      obj => filters[obj.isActive ? 'active' : 'defective']
    );
  });*/
  
  
  loadList().then(data => {
	console.log(data); //проверил получение данных с api
	myMap.geoObjects.add(objectManager); //привязываем менеджер к нашей карте
    objectManager.add(data);
  });
}
