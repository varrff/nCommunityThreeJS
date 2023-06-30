import { roomTexts, parkData } from "@/assets/mock/mock";
import { floorBaseMaterial2 } from "@/three/material";
import { Notification } from "element-ui";
import EventBus from "@/bus";
import { setModelDefaultMaterial } from '@/three/loaderModel';
// 处理电力监测功能
export function loaderParkElectricity() {
  app.flyTo({
    position: [17.05, 5.51,19.18],
    controls: [5.68, 1.39, 4.69],
    done: () => {
      createParkElectricity(app);
    },
  });
}
export function createParkElectricity(app) {
  let notifIndex = 0;
  app.model.traverse((obj) => {
    if (obj.isMesh) {
      if (obj.name.indexOf("电表") === -1) {
        obj.material = floorBaseMaterial2;
      } else {
        //楼栋
        const floorName = obj.parent.parent.name;
        const layerName = obj.parent.name.substr(0, 2);
        const roomName = obj.name.substr(0, 3);
        const value = parkData[floorName][layerName][roomName]["电"];
        //    如果大于设定值：460的处理逻辑
        if (value > 460) {
          app.selectedObjects.push(obj);
          setTimeout(() => {
            if (notifIndex < 6) {
              Notification({
                title: "警告",
                message: `${floorName}的${layerName}${roomName}的用电量为${value}度，已超出平均值，请留意`,
                type: "warning",
                duration: 6000,
              });
              notifIndex++;
            }
          }, notifIndex * 200);
        }
        app.rayModel.push(obj);
         // 放大电表模型
        obj.scale.set(2.3, 2.3, 2.3); // 调整放大倍数
      }
    }
  });
  app.initRaycaster(
    (activeObj, app, event) => {
      if (activeObj.object) {
        const obj = activeObj.object;
        const floorName = obj.parent.parent.name;
        const layerName = obj.parent.name.substr(0, 2);
        const roomName = obj.name.substr(0, 3);
        const value = parkData[floorName][layerName][roomName]['电'];
        EventBus.$emit('changeTooltip', {
          楼栋: floorName,
          楼层: layerName,
          房间号: roomName,
          度数: value,
          name: obj.name,
          type: '电',
          x: event.x,
          y: event.y,
          show: true
        });
      } else {
        EventBus.$emit('changeTooltip', {
          show: false
        });
      }
    },
    app.rayModel,
    'click'
  )
}

// 销毁
export function destroyParkElectricity(app) {
  app.selectedObjects = [];
  app.outlinePass.selectedObjects = app.selectedObjects;
  EventBus.$emit('changeTooltip', {
    show: false
  });
  setModelDefaultMaterial(app);
  app.destroyRaycaster('click');
}
