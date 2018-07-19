import { loadList, loadDetails } from './api';
import { getDetailsContentLayout } from './details';
import { createFilterControl } from './filter';

export function initMap(ymaps, containerId) { 
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
  
  // Будем менять цвет кластера, если в нем присутствует дефективный элемент
  objectManager.clusters.events.add('add', function (e) {
    const cluster = objectManager.clusters.getById(e.get('objectId')),
    objects = cluster.properties.geoObjects;
	  
	objects.map((el,i)=>{
	  if(!el.isActive){
	      objectManager.clusters.setClusterOptions(cluster.id, {
	      preset: 'islands#redClusterIcons'
	    })
	  }
	})
  });

  loadList().then(data => {
	console.log(data); //проверил получение данных с api
	myMap.geoObjects.add(objectManager); //привязываем менеджер к нашей карте
    objectManager.add(data);
  });
  
  // details
  objectManager.objects.events.add('click', event => {
    const objectId = event.get('objectId');
    const obj = objectManager.objects.getById(objectId);

    objectManager.objects.balloon.open(objectId);

    if (!obj.properties.details) {
      loadDetails(objectId).then(data => {
	    console.log(data); //проверил получение данных с api
        obj.properties.details = data;
        objectManager.objects.balloon.setData(obj);
      });
    }
	
	
  });

  // filters
  const listBoxControl = createFilterControl(ymaps);
  myMap.controls.add(listBoxControl);

  const filterMonitor = new ymaps.Monitor(listBoxControl.state); //раз уж мы придерживаемся стандарта es6, то так и продолжаем - вместо var используем const
  filterMonitor.add('filters', filters => {
    objectManager.setFilter(
      obj => filters[obj.isActive ? 'active' : 'defective']
    );
  });
  
}
