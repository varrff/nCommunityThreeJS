<template>
  <div class="main">
    <big-control class="control"></big-control>
    <div id="screen" class="screen"></div>
  </div>
</template>

<script>
import ZThree from '@/three/ZThree.js'
import * as THREE from 'three'
import { loaderModel } from '@/three/loaderModel.js'
import bigControl from '@/views/bigControl'
import TWEEN from 'three/examples/jsm/libs/tween.module.js'
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer'
import { cssRender } from '@/three/cssRender'
import { createReprocessing } from '@/three/reprocessing';
import { darkMaterial } from '@/three/material'
import {addParkWater} from '@/three/parkWater'
let app, camera, scene, renderer, controls, clock, reprocessing, materials={}
export default {
  name: 'HomeView',
  components: { bigControl },
  methods: {
    async initZThree() {
      app = await new ZThree('screen');
      app.initThree()
      // app.initHelper()
      app.initOrbitControls()
      app.initLight()
      window.app = app

      app.cameraPosition = [68, 27, 47]
      app.controlsTarget = [-9.94, 1.36, 3.18]

      controls = app.controls
      controls.target.set(...app.controlsTarget)
      clock = new THREE.Clock()
      camera = app.camera
      camera.position.set(...app.cameraPosition)
      scene = app.scene
      renderer = app.renderer

      // 开启辉光
      renderer.outputEncoding = THREE.sRGBEncoding
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      // 开启场景投影
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap

      let instance = new cssRender(CSS3DRenderer, app)
      app.cssRenderer = instance.cssRenderer
      app.instance = instance

      //开启辉光
      reprocessing = createReprocessing(app)

      await loaderModel(app)
      app.render(() => {
        const delta = clock.getDelta()
        controls.update(delta)

        renderer.render(scene, camera)


        // 开启辉光
        scene.traverse(this.darkenNonBloomed)
        reprocessing.render()
        scene.traverse(this.restoreMaterial)
        app.finalComposer.render()

        app.cssRenderer.render(scene, camera)
        TWEEN.update()
      })

    }
    //开启辉光
    ,
    darkenNonBloomed(obj) {
      if (obj.isMesh && app.bloomLayer.test(obj.layers) === false) {
        materials[obj.uuid] = obj.material;
        obj.material = darkMaterial;
      }
    },
    restoreMaterial(obj) {
      if (materials[obj.uuid]) {
        obj.material = materials[obj.uuid];
        delete materials[obj.uuid];
      }
    }

  },
  mounted() {
    this.initZThree();
  }
}
</script>

<style lang="less">
.main {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000;

  .control {
    height: 5%;
    position: absolute;
    bottom: 3%;
    // left: 50%;
    width: 100%;
    // transform: translateX(-50%);
    z-index: 3;
    float: left;
    font-size: 30px;
    display: flex;
    justify-content: center;
  }
}

.screen {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>