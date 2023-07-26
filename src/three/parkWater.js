import { roomTexts, parkData } from "@/assets/mock/mock";
import { floorBaseMaterial2 } from "@/three/material";
import { Notification } from "element-ui";
import EventBus from "@/bus";
import { setModelDefaultMaterial } from '@/three/loaderModel';
// 处理水力监测功能
export function loaderParkWater() {
  app.flyTo({
    position: [5.14, 6.98, 1.84],
    controls: [11.71, -0.78, 12.35],
    done: () => {
      createParkWater(app);
    },
  });
}
export function createParkWater(app) {

  let notifIndex = 0;
  app.model.traverse((obj) => {
    if (obj.isMesh) {
      if (obj.name.indexOf("水管") === -1) {
        obj.material = floorBaseMaterial2;
      } else {
        //楼栋
        const floorName = obj.parent.parent.name;
        const layerName = obj.parent.name.substr(0, 2);
        const roomName = obj.name.substr(0, 3);
        // const value = parkData[floorName][layerName][roomName]["水"];
        const value =20
        //    如果大于设定值：460的处理逻辑
        if (value > 10) {
          app.selectedObjects.push(obj);
          setTimeout(() => {
            if (notifIndex < 6) {
              Notification({
                title: "警告",
                message: `${floorName}的${layerName}${roomName}的用水量为${value}方，已超出平均值，请留意`,
                type: "warning",
                duration: 6000,
              });
              notifIndex++;
            }
          }, notifIndex * 200);
        }
        app.rayModel.push(obj);
        console.log(obj);
         // 放大水管模型
        // obj.scale.set(1, 1, 1); // 调整放大倍数
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
        // const value = parkData[floorName][layerName][roomName]["水"];
        const value =20
        EventBus.$emit('changeTooltip', {
          楼栋: floorName,
          楼层: layerName,
          房间号: roomName,
          度数: value,
          name: obj.name,
          type: '水',
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
export function destroyParkWater(app) {
  app.selectedObjects = [];
  app.outlinePass.selectedObjects = app.selectedObjects;
  EventBus.$emit('changeTooltip', {
    show: false
  });
  setModelDefaultMaterial(app);
  app.destroyRaycaster('click');
}

// 批量添加模型
// export function addParkWater(app, arr) {
//   console.log(app.model);
//   try {
//     let foundModel = false; // 标志是否找到模型
//     app.model.traverse(obj => {
//       if (foundModel) {
//         return; // 如果已经找到模型，则退出遍历
//       }
//       if (obj.isMesh && obj.name.indexOf("水管") > -1) {
//         arr.forEach(e => {
//           const clonedModel = obj.clone(); // 克隆模型
//           clonedModel.name = e.name;
//           console.log(clonedModel);
//           clonedModel.position.set(e.x, e.y, e.z);
//           clonedModel.scale.set(1, 1, 1)
//           app.model.add(clonedModel); // 将克隆后的模型添加到场景中
//         });
//         foundModel = true; // 标记已找到模型
//       }
//     });
//   } catch (e) {
//     console.log(e);
//     return;
//   }
// }
