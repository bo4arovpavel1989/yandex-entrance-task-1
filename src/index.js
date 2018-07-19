import { initMap } from "./map"; //добавляем скобки, т.к. экспорт из файла map указан не по дефолту 

ymaps.ready(() => {
  initMap(ymaps, "map");
  console.log("inited");
});
