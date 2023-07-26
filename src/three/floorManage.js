import * as THREE from "three";
import { CSS3DSprite } from "three/examples/jsm/renderers/CSS3DRenderer";
import { floorBaseMaterial } from "./material";
import EventBus from "@/bus";
import { destroyControlsGroupText } from "./loaderModel";
import { roomTexts, parkData } from "@/assets/mock/mock";
export function loaderFloorManage(app) {
  app.flyTo({
    position: [18.31, 41.48, 32.01],
    controls: [17.38, -3.54, 1.71],
    done: () => {
      createFloorText(app);
    },
  });
}
// 创建文字标签
export function createFloorText(app) {
  app.model.traverse((obj) => {
    if (obj.name.indexOf("楼顶") > -1) {
      const name = obj.parent.name;
      const position = Object.values(app.getModelWorldPosition(obj));
      const html = `<div class="floorText-3d animated fadeIn" id="${name}"><p class="text">${name}</p></div>`;
      app.instance.add({
        element: html,
        position,
        cssObject: CSS3DSprite,
        name,
        scale: [0.025, 0.025, 0.025],
        parent: app.controlGroup,
      });
      const textDoms = document.getElementsByClassName("floorText-3d");
      for (let i = 0; i < textDoms.length; i++) {
        const textDom = textDoms[i];
        textDom.onclick = () => {
          for (let i = 0; i < app.model.children.length; i++) {
            const obj = app.model.children[i];
            if (obj.name === textDom.id) {
              EventBus.$emit("changeFloorUI", {
                isShowFloorBack: true,
                model: obj,
              });
              const centerPosition = Object.values(
                app.getModelWorldPosition(obj)
              );

              app.flyTo({
                position: [
                  centerPosition[0] + 10,
                  centerPosition[1] + 20,
                  centerPosition[2] + 10,
                ],
                controls: centerPosition,
              });

              obj.traverse((childrenObj) => {
                if (childrenObj.material) {
                  childrenObj.material =
                    app.modelMaterials[childrenObj.name].material;
                }
              });
            } else {
              obj.traverse((childrenObj) => {
                childrenObj.material = floorBaseMaterial;
              });
            }
          }
          destroyControlsGroupText(app, "floorText-3d");
        };
      }
    }
  });
}

// 楼层的文字
export function createRoomText(app, model) {
  console.log(model.name);
  model.traverse((obj) => {
    if (obj.isMesh) {
      roomTexts.forEach((item) => {
        if (obj.name.indexOf(item.name) > -1) {
  
          const name = obj.name;
          const position = Object.values(app.getModelWorldPosition(obj));
          const html = `<div class="room-3d animated fadeIn" id="${name}" _type="${item.type}"><p class="text">${name}</p>
            <div class="${item.class}"></div>
            </div>`;
          app.instance.add({
            element: html,
            position,
            cssObject: CSS3DSprite,
            name,
            scale: [0.007, 0.007, 0.007],
            parent: app.controlGroup,
          });
        }
      });
    }
  });
  const textDoms = document.getElementsByClassName("room-3d");
  console.log(textDoms);
  for (let i = 0; i < textDoms.length; i++) {
    const textDom = textDoms[i];
    textDom.onclick = event => {
        //点击某个具体的房间内容触发的点击事件，实际中替换成发送的api接口
        const type = textDom.getAttribute('_type')
        const model = app.model.getObjectByName(textDom.id)
        // 通知具体窗口的显示
        EventBus.$emit("changeRoomTooltip", {
            name: model.name,
            type,
            x:event.x,
            y:event.y,
            show:true
          });
    };
  }
}

// 楼层动画
export function setModelLayer(app, model, layerName, layerData, callback) {
    destroyControlsGroupText(app, "room-3d");
  const currentLayer = Number(layerName.substr(0, layerName.indexOf("F")));
  console.log(layerName);
  for (let i = 0; i < model.children.length; i++) {
    let mesh = model.children[i];
    let name = mesh.name;
    let num;
    //对楼顶进行特殊的处理
    if (name.indexOf("楼顶") > -1) {
      num = layerData.length + 1;
    } else {
      num = Number(name.substr(0, name.indexOf("F")));
    }
    let value = num - currentLayer;
    let position = mesh.position;
    let position_tmp = mesh.position_tmp;
    let toPosition;

    if (layerName === "全楼") {
      toPosition = [position_tmp.x, position_tmp.y, position_tmp.z];
    } else {
      if (value >= 1) {
        toPosition = [
          position_tmp.x,
          position_tmp.y + value * 20,
          position_tmp.z,
        ];
      } else {
        toPosition = [position_tmp.x, position_tmp.y, position_tmp.z];
      }
    }
    // 控制楼层模型的移动
    app.modelMove(
      {
        fromPosition: [position.x, position.y, position.z],
        toPosition,
        duration: 300,
        done: () => {
          if (layerName === "全楼") {
            if (callback) {
              callback();
              return;
            }
            const centerPosition = Object.values(
              app.getModelWorldPosition(model)
            );
            app.flyTo({
              //调整全楼的相机位置
              position: [
                centerPosition[0] + 20,
                centerPosition[1] + 10,
                centerPosition[2] + 20,
              ],
              controls: centerPosition,
            });
            return;
          } else {
            if (mesh.name.indexOf(layerName) > -1) {
              if (callback) {
                callback();
                return;
              }
              const centerPosition = Object.values(
                app.getModelWorldPosition(mesh)
              );
              app.flyTo({
                position: [
                  centerPosition[0] + 5,
                  centerPosition[1] + 10,
                  centerPosition[2] + 5,
                ],
                controls: centerPosition,
                done: () => {
                  console.log(mesh);
                  // 这里传入的是单层楼的模型
                  createRoomText(app, mesh);
                },
              });
            }
          }
        },
      },
      mesh
    );
  }
}
