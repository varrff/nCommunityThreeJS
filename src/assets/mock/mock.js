import * as THREE from 'three'

//  样式，具体可以在blender中对应其模型的名字然后生成图片
export const roomTexts = [
    {
        name:'摄像头',
        class:'camera-bg',
        type:'摄像头'
    }, 
    {
        name:'水管',
        class:'water-bg',
        type:'水'
    }, 
    {
        name:'电表',
        class:'electricity-bg',
        type:'电'
    },
]
//模拟数据，实际中替换成接口的数据即可
const floors = ['A栋','B栋','C栋','D栋']
const layers = ['1F','2F','3F','4F','5F','6F','7F','8F','9F','10F']
const rooms = ['101','102','103','104']
export const parkData = {}

floors.forEach(v =>{
    parkData[v] = {}
    layers.forEach(k=>{
        parkData[v][k] = {}
        rooms.forEach(j=>{
            parkData[v][k][j] = {
                水:THREE.MathUtils.randInt(5,20),
                电:THREE.MathUtils.randInt(200,500)
            }
        })
    })
})

export const cameraUrls = {
    摄像头A:`movie/${THREE.MathUtils.randInt(1,3)}.mp4`,
    摄像头B:`movie/${THREE.MathUtils.randInt(1,3)}.mp4`,
    摄像头C:`movie/${THREE.MathUtils.randInt(1,3)}.mp4`
}