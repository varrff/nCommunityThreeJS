import * as THREE from 'three'
// 管理材质的文件
// 选中某个模块时其他模块透明的材质
export const floorBaseMaterial = new THREE.MeshBasicMaterial({
    color:0x00beff,
    transparent:true,
    opacity:.1,
    depthWrite:false
})
// 电力监测和水力监测的材质
export const floorBaseMaterial2 = new THREE.MeshBasicMaterial({
    color:0x00beff,
    transparent:true,
    opacity:.1,
    //开启线框
    wireframe:true
})

// 黑色材质
export const darkMaterial =new THREE.MeshBasicMaterial({
    color:'#000'
})