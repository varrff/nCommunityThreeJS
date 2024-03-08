import * as THREE from "three";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import TWEEN from "three/examples/jsm/libs/tween.module.js";
import { addParkWater } from "@/three/parkWater";
export default class ZThree {
  constructor(id) {
    this.id = id;
    this.el = document.getElementById(id);
  }
  // 初始化场景
  initThree() {
    let width = this.el.offsetWidth;
    let height = this.el.offsetHeight;
    // 创建场景
    this.scene = new THREE.Scene();
    // 初始化加载器
    this.textureLoader = new THREE.TextureLoader();
    // 创建相机
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    // 设置相机位置
    this.camera.position.set(30, 30, 30);
    this.camera.lookAt(0, 0, 0);
    //初始化渲染器
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.el.append(this.renderer.domElement);

    // this.gui = new GUI();

    window.addEventListener("resize", () => {
      this.camera.aspect = this.el.offsetWidth / this.el.offsetHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.el.offsetWidth, this.el.offsetHeight);

      if (this.cssRenderer) {
        this.cssRenderer.setSize(this.el.offsetWidth, this.el.offsetHeight);
      }
    });
  }
  //辅助
  initHelper() {
    this.scene.add(new THREE.AxesHelper(100));
  }
  //控制器
  initOrbitControls() {
    //初始化控制器实例
    let controls = new OrbitControls(this.camera, this.renderer.domElement);
    // 开启阻尼效果，让相机在旋转后有一定的惯性
    controls.enableDamping = true;
    // 开启缩放功能
    controls.enableZoom = true;
    // 禁用自动旋转
    controls.autoRotate = false;
    // 设置自动旋转的速度
    controls.autoRotateSpeed = 0.5;
    // 开启平移功能
    controls.enablePan = true;

    // 限制缩放范围
    controls.minDistance = 1;
    controls.maxDistance = 100;
    // 限制垂直旋转范围
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI / 2;

    // 将创建的控制对象赋值给this.controls，以便其他方法能够访问和使用这个控制对象
    this.controls = controls;
  }
  //灯光
  initLight() {
    // const ambientLight = new THREE.AmbientLight(0x404040);
    const ambientLight = new THREE.AmbientLight("#6d78b0", 0.4);
    this.scene.add(ambientLight);
    //平行光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    // const directionalLight = new THREE.DirectionalLight('#3e9ae0', 0.2);

    directionalLight.position.set(100, 100, -100);
    //开启投影
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    //投影的参数
    directionalLight.shadow.mapSize.width = 512;
    directionalLight.shadow.mapSize.HEIGHT = 512;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.bias = 0.05;
    directionalLight.shadow.normalBias = 0.05;
    // 辅助对象
    // const helper = new THREE.CameraHelper(directionalLight.shadow.camera)
    // this.scene.add(helper)
  }

  loaderModel(option) {
    switch (option.type) {
      case "gltf":
      case "glb":
        if (!this.gltfLoader) {
          this.gltfLoader = new GLTFLoader();
          let dracoLoader = new DRACOLoader();
          dracoLoader.setDecoderPath("draco/");
          this.gltfLoader.setDRACOLoader(dracoLoader);
        }
        this.gltfLoader.load(
          option.url,
          option.onLoad,
          option.onProgre,
          option.onError
        );
        break;

      default:
        break;
    }
  }

  //加载模型
  iterateLoad(objFileList, onProgress, onAllLoad) {
    let fileIndex = 0;
    let that = this;

    function iterateLoadForIt() {
      that.loaderModel({
        type: objFileList[fileIndex].type,
        url: objFileList[fileIndex].url,
        onLoad: function (object) {
          if (objFileList[fileIndex].onLoad) {
            objFileList[fileIndex].onLoad(object);
          }
          fileIndex++;
          if (fileIndex < objFileList.length) {
            iterateLoadForIt();
          } else {
            if (onAllLoad) {
              onAllLoad();
              // let position = [
              //   {
              //     x: 2,
              //     y: 1,
              //     z: 3,
              //     name: "103水管",
              //   },  {
              //     x: 5,
              //     y: 2,
              //     z: 2,
              //     name: "104水管",
              //   },
              //   {
              //     x: 5,
              //     y: 2,
              //     z: 1,
              //     name: "105水管",
              //   }
              // ];
              // addParkWater(window.app,position);
            }
          }
        },
        onProgress: function (xhr) {
          if (objFileList[fileIndex].onProgress) {
            objFileList[fileIndex].onProgress(xhr, fileIndex);
          }
          if (onProgress) {
            onProgress(xhr, fileIndex);
          }
        },
      });
    }
    iterateLoadForIt();
  }

  // 鼠标射线
  // 初始化射线
  initRaycaster(callback, models = this.scene.children, eventName = "click") {
    this.raycaster = new THREE.Raycaster();
    this.rayFn = this.rayEventFn.bind(this, models, callback);
    // 绑定点击事件
    this.el.addEventListener(eventName, this.rayFn);
  }

  rayEventFn(models, callback) {
    let evt = window.event;
    let mouse = {
      x: (evt.clientX / window.innerWidth) * 2 - 1,
      y: -(evt.clientY / window.innerHeight) * 2 + 1,
    };

    let activeObj = this.fireRaycaster(mouse, models);
    // if (activeObj.point) {
    //   console.log([activeObj.point.x, activeObj.point.y, activeObj.point.z]);
    //   console.log(activeObj);
    // }
    if (callback) {
      callback(activeObj, this, evt, mouse);
    }

    // 判断是否与模型相交，设置鼠标样式
    let isIntersected = false;
    for (let i = 0; i < models.length; i++) {
      if (activeObj.object === models[i]) {
        isIntersected = true;
        break;
      }
    }

    // if (isIntersected) {
    //   document.body.style.cursor = "pointer"; // 与模型相交时，设置为小手指针样式
    // } else {
    //   document.body.style.cursor = "default"; // 未与模型相交时，设置为默认样式
    // }
    //鼠标的变换
    // document.body.style.cursor = "pointer";
  }
  //删除文本标签
  destroyRaycaster(eventName) {
    this.raycaster = null;
    this.el.removeEventListener(eventName, this.rayFn);
  }

  // 返回选中物体
  fireRaycaster(pointer, models) {
    // 使用一个新的原点和方向来更新射线
    this.raycaster.setFromCamera(pointer, this.camera);

    let intersects = this.raycaster.intersectObjects(models, true);
    //
    if (intersects.length > 0) {
      let selectedObject = intersects[0];
      return selectedObject;
    } else {
      return false;
    }
  }

  // 获取传入模型模型的世界坐标
  getModelWorldPosition(model) {
    this.scene.updateMatrixWorld(true);
    const worldPosition = new THREE.Vector3();
    model.getWorldPosition(worldPosition);
    return worldPosition;
  }

  //相机跳转
  flyTo(option) {
    option.position = option.position || [];
    option.controls = option.controls || [];
    option.duration = option.duration || 1000;
    option.easing = option.easing || TWEEN.Easing.Linear.None;

    const curPosition = this.camera.position;
    const curControls = this.controls.target;

    const tween = new TWEEN.Tween({
      x1: curPosition.x,
      y1: curPosition.y,
      z1: curPosition.z,
      x2: curControls.x,
      y2: curControls.y,
      z2: curControls.z,
    })
      .to(
        {
          x1: option.position[0],
          y1: option.position[1],
          z1: option.position[2],
          x2: option.controls[0],
          y2: option.controls[1],
          z2: option.controls[2],
        },
        option.duration
      )
      .easing(option.easing);

    tween.onStart(() => {
      this.controls.enabled = false;
      if (option.start instanceof Function) {
        option.start();
      }
    });
    tween.onUpdate((object) => {
      this.controls.enabled = false;
      this.camera.position.set(object.x1, object.y1, object.z1);
      this.controls.target.set(object.x2, object.y2, object.z2);
      if (option.update instanceof Function) {
        option.update();
      }
    });
    tween.onComplete(() => {
      this.controls.enabled = true;
      if (option.done instanceof Function) {
        option.done();
      }
    });
    tween.onStop(() => {
      this.controls.enabled = true;
      if (option.stop instanceof Function) {
        option.stop();
      }
    });
    tween.start();
    return tween;
  }

  // 移动楼层
  modelMove(option, obj) {
    option.fromPosition = option.fromPosition || [];
    option.toPosition = option.toPosition || [];
    option.duration = option.duration || 1000;
    option.easing = option.easing || TWEEN.Easing.Linear.None;

    const curPosition = this.camera.position;
    const curControls = this.controls.target;

    const tween = new TWEEN.Tween({
      x1: option.fromPosition[0],
      y1: option.fromPosition[1],
      z1: option.fromPosition[2],
    })
      .to(
        {
          x1: option.toPosition[0],
          y1: option.toPosition[1],
          z1: option.toPosition[2],
        },
        option.duration
      )
      .easing(option.easing);

    tween.onStart(() => {
      this.controls.enabled = false;
      if (option.start instanceof Function) {
        option.start();
      }
    });
    tween.onUpdate((object) => {
      this.controls.enabled = false;
      obj.position.set(object.x1, object.y1, object.z1);
      if (option.update instanceof Function) {
        option.update();
      }
    });
    tween.onComplete(() => {
      this.controls.enabled = true;
      if (option.done instanceof Function) {
        option.done();
      }
    });
    tween.onStop(() => {
      this.controls.enabled = true;
      if (option.stop instanceof Function) {
        option.stop();
      }
    });
    tween.start();
    return tween;
  }

  render(callback) {
    callback();
    this.frameId = requestAnimationFrame(() => this.render(callback));
  }
}
