import * as THREE from "three";

export function loaderModel(app) {
  return new Promise((resolve) => {
    app.controlGroup = new THREE.Group();
    app.scene.add(app.controlGroup);
    // 存储模型的所有材质
    app.modelMaterials = {};
    app.rayModel = []
    let urls = [
      {
        type: "glb",
        //模型地址
        url: "model/model.glb",
        onLoad: (object) => {
          app.scene.add(object.scene);
          app.model = object.scene;
          //需要接收阴影的小模型
          // const receiveModel = ["路面", "人行道", "道路", "斑马线"];
          const receiveModel = []
          // 使用辉光渲染的模型
          // const bloomModels = ['承重柱','楼底面','窗户','楼片面','路灯2灯面','路灯灯面']
          const bloomModels=[]
          //遍历模型里的小模型
          app.model.traverse((obj) => {
            // 如果模型的材质存在
            if (obj.material) {
              app.modelMaterials[obj.name] = {
                material: obj.material,
              };
            }

            let { x, y, z } = obj.position;
            obj.position_tmp = { x, y, z };

            if (receiveModel.includes(obj.name)) {
              obj.receiveShadow = true;
            } else {
              obj.castShadow = true;
              obj.receiveShadow = false;
            }

            for (let i = 0; i <bloomModels.length; i++){
              const value = bloomModels[i]
              if(obj.name.indexOf(value)>-1){
                obj.layers.enable(1)
                break
              }else{
                obj.layers.enable(0)
              }
            }
          });
        },
      },
    ];

    app.iterateLoad(urls, null, () => {});
    resolve();
  });
}
// 删除标签
export function destroyControlsGroupText(app, className) {
  const textDoms = document.getElementsByClassName(className);
  for (let i = 0; i < textDoms.length; i++) {
    const textDom = textDoms[i];
    textDom.onclick = null;
  }
  app.instance.removeAll(app.controlGroup);
}

// 恢复所有模型的材质
export function setModelDefaultMaterial(app) {
  app.model.traverse((obj) => {
    if (obj && obj.material && app.modelMaterials[obj.name]) {
      obj.material = app.modelMaterials[obj.name].material;
    }
  });
}

// 删除模型
export function destroyControlsGroup(app, className) {
  if (app?.controlGroup?.children?.length === 0) {
    return;
  }
  if (className) {
    destroyControlsGroupText(app, className);
  }
  // three.js对组的遍历最好是倒序，否则有时容易出bug
  for (let i = app.controlGroup.children.length - 1; i > -1; i--) {
    const obj = app.controlGroup.children[i];
    if (obj.isMesh) {
      obj.geometry.dispose();
      obj.material.dispose();
      app.controlGroup.remove(obj);
    }
  }
}
