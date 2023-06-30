# 项目介绍

🌳🌇🏢

## 智慧园区前端3D场景

本项目是基于three.js和Vue构建的一个前端3D场景，旨在展示智慧园区的概念和特点。

## 功能特点

✨ 动态场景展示: 通过three.js创建逼真的3D场景，展示智慧园区的监测设备



## 快速开始

1. 安装依赖：

   ```
   npm install
   ```

2. 启动开发服务器：

   ```
   npm run serve
   ```

# 每个功能和文件的详细解读

## ZThree.js - 初始化和一些通用的函数

1. `initThree()`: 初始化Three.js场景，包括创建场景、相机、渲染器等，并将渲染器的DOM元素添加到指定的HTML元素中。
2. `initHelper()`: 添加一个坐标轴辅助对象到场景中，用于辅助定位和调试。
3. `initOrbitControls()`: 初始化轨道控制器，用于通过鼠标和触摸控制相机的旋转、缩放和平移操作。
4. `initLight()`: 初始化灯光，包括环境光和平行光，并设置它们的位置和投影。
5. `loaderModel(option)`: 根据传入的选项加载模型文件，支持gltf和glb格式的模型。
6. `iterateLoad(objFileList, onProgress, onAllLoad)`: 迭代加载多个模型文件，支持在加载过程中和加载完成后的回调函数。
7. `initRaycaster(callback, models = this.scene.children, eventName = "click")`: 初始化射线检测功能，用于检测鼠标点击或触摸事件与场景中的模型的交互，并通过回调函数处理交互事件。
8. `destroyRaycaster(eventName)`: 停止射线检测功能，移除事件监听器。
9. `fireRaycaster(pointer, models)`: 发射射线并检测与模型的交互，返回交互结果。
10. `getModelWorldPosition(model)`: 获取传入模型的世界坐标。
11. `flyTo(option)`: 控制相机飞行到指定位置和视角的动画效果。
12. `modelMove(option, obj)`: 控制模型移动到指定位置的动画效果。
13. `render(callback)`: 渲染循环，每帧执行回调函数进行渲染。



## loaderModel.js - 模型加载和管理的函数

1. `loaderModel(app)`: 这是一个异步函数，用于加载模型并添加到场景中。它接受一个`app`对象作为参数，返回一个Promise对象。在加载完成后，会将模型添加到`app.scene`中，并对模型进行一些设置，例如设置阴影、辉光渲染等。
2. `destroyControlsGroupText(app, className)`: 这个函数用于移除指定类名的HTML元素的点击事件监听器。它接受一个`app`对象和一个类名`className`作为参数。通过获取指定类名的元素列表，然后将其点击事件置空，实现移除事件监听器的效果。
3. `setModelDefaultMaterial(app)`: 这个函数用于恢复所有模型的默认材质。它接受一个`app`对象作为参数。通过遍历模型的子元素，如果子元素存在材质并且在`app.modelMaterials`中有对应的记录，就将子元素的材质恢复为默认材质。
4. `destroyControlsGroup(app, className)`: 这个函数用于移除控制组中的模型。它接受一个`app`对象和一个类名`className`作为参数。首先判断控制组中是否有模型，如果没有则直接返回。然后根据传入的类名移除相应的HTML元素的点击事件监听器。最后，使用倒序的方式遍历控制组的子元素，移除其中的Mesh对象并释放相关资源。



## cssRender.js - 生成场景标签的函数

ps : 在本项目中,该方法并没有直接使用,而是通过在HomeView.vue中实例化后挂载到了instance方法中.

1. `cssRender(cssRender, app)`: 这是一个导出的函数，用于渲染CSS样式。它接受两个参数，`cssRender`和`app`。`cssRender`应该是一个引用CSSRenderer的类或模块。函数内部创建了一个`T`对象来存储配置和方法。
2. `T.init()`: 这个方法用于初始化CSSRenderer。它创建一个`cssRenderer`对象，并设置其大小和位置，然后将其添加到指定的DOM元素(`app.el`)中。
3. `T.add(option)`: 这个方法用于添加CSS样式到场景中。它接受一个参数`option`，可以是一个包含多个样式配置的数组，或者单个样式配置对象。对于每个样式配置对象，它会将其对应的HTML元素插入到`document.body`中，并创建一个`cssObject`对象来表示该元素。然后设置`cssObject`的位置、名称和缩放等属性，并将其添加到指定的父级容器或场景中。最后，将`cssObject`添加到`T.config`中，以便后续管理和操作。
4. `T.removeAll(parent)`: 这个方法用于移除指定父级容器中的所有CSS样式。它接受一个参数`parent`，表示要移除样式的父级容器。通过遍历父级容器的子元素，如果子元素的`userData.isCss23D`属性为`true`，则将其从父级容器中移除，并从`T.config`中删除对应的配置。
5. `T.init()`: 在构造函数中调用`T.init()`来初始化CSSRenderer对象。









## material.js - 管理材质

如果要修改材质就直接在这里修改,其他方法使用材质时是直接引用这里暴露的材质,方便管理



## floorManage.js -管理楼层和房间的显示与操作

楼层管理中每栋楼的标签是通过查找到"楼顶"这个子模型,并在它的上方生成标签标签,而标签名是这个子模型的父模型名字,每层楼的标签也是要通过"F"关键词来查找的

1. `loaderFloorManage(app)`: 这个函数用于加载楼层管理相关的内容。它首先通过调用`app.flyTo()`将相机定位到指定位置，然后调用`createFloorText(app)`函数创建楼层标签。

2. `createFloorText(app)`: 这个函数用于创建楼层标签。它遍历模型中的对象，找到名称包含"楼顶"的对象，然后根据其位置和名称创建相应的HTML标签，并通过调用`app.instance.add()`将标签添加到场景中。同时，为标签添加点击事件监听器，当点击标签时会触发相应的操作。

3. `createRoomText(app, model)`: 这个函数用于创建房间标签。它遍历模型中的对象，找到符合条件的网格对象，然后根据定义的房间文本数据创建相应的HTML标签，并通过调用`app.instance.add()`将标签添加到场景中。同样，为标签添加点击事件监听器，当点击标签时会触发相应的操作。

4. `setModelLayer(app, model, layerName, layerData, callback)`: 这个函数用于设置模型的楼层。它接受参数`layerName`表示楼层的名称，`layerData`表示楼层数据，`callback`表示楼层设置完成后的回调函数。函数首先移除已有的房间标签，然后遍历模型的子对象，根据楼层名称和位置计算需要移动的位置，并通过`app.modelMove()`实现模型的平滑移动。在移动完成后，根据楼层名称进行进一步操作，如调整相机位置和创建房间标签。





## reprocessing.js -实现一些视觉效果，包括辉光、抗锯齿和边缘高亮。(很消耗性能,慎开)

1. 启用和设置辉光效果：
   - 创建`bloomLayer`作为辉光效果的图层。
   - 使用`UnrealBloomPass`创建辉光效果，并设置参数如阈值、强度和半径。
   - 创建`EffectComposer`对象`bloomComposer`，添加`RenderPass`和`UnrealBloomPass`。
2. 创建最终的后处理效果：
   - 使用自定义的着色器材质，通过将基础纹理和辉光纹理相加来创建最终的后处理效果。
   - 创建`EffectComposer`对象`finalComposer`，添加`RenderPass`和最终的后处理效果。
3. 添加GUI控件（注释掉了）：
   - 创建GUI控件，用于动态调整辉光、抗锯齿和边缘高亮的参数。
   - 将参数的变化应用到对应的后处理效果。



## parkElectricity.js 电力监测的功能,水力监测也同理

1. `loaderParkElectricity()`：
   - 执行飞行动画，将相机飞到指定位置和控制点。
   - 在动画完成后，调用`createParkElectricity(app)`方法创建电力监测相关的内容。
2. `createParkElectricity(app)`：
   - 遍历场景中的模型对象。
   - 如果是网格对象（Mesh），根据名称判断是否为电表。
   - 如果是电表，根据楼栋、楼层、房间号获取对应的电力数据。
   - 如果电力值大于设定值（460），将电表对象添加到`selectedObjects`数组，并显示警告通知。
   - 将电表对象添加到`rayModel`数组，并调整其放大倍数。
   - 初始化射线检测功能，监听点击事件，根据点击的对象显示对应的信息。
3. `destroyParkElectricity(app)`：
   - 清空`selectedObjects`数组和`outlinePass`的`selectedObjects`属性，取消电表对象的高亮效果。
   - 发送事件通知隐藏信息提示框。
   - 将模型恢复默认材质。
   - 销毁射线检测功能，取消点击事件的监听。





# 数据的处理

放在了assets文件夹的mock.js中.

存储了在房间模型里每个具体业务中的子模型的名称,样式,图片,数据







# 关于Blender建模部分的规范

## 命名部分

网页场景以命名来区分有多少栋楼,多少层楼,多少个监测设备,因此,这是模型与前端开发配合中极为重要的一环.

- 楼栋

​		每栋楼命名没有限制,但每栋楼都需要有一个**楼顶**的子模型.网页场景中以楼		顶的子模型来判断这是否是一栋楼,然后以**楼栋名称**作为楼层管理模块的标签		名称



- 楼层

​		楼层需要以**F**结尾 网页场景中以**F**结尾的子模型来判断这是否是一层楼



- 监测设备

​		由于监测设备的命名在具体业务中并不固定,因此只需与前端沟通好即可.	

​		前端需要在**mock.js**中更改监测设备模型的样式,在**park开头的文件**中以监测		设备的名称遍历所有模型,然后才能选中要监测的模型



## 建模中需要注意的细节

- 修改器中的如果使用了阵列之类的,要记得点击应用.才会在网页中生效,如果设置了不应用,只会在blender中有效果

- 如果引入了网上复杂的模型资源,可以在修改器中添加简化,减轻网页渲染的压力,还可以删除一些没有必要的父模型,留下外观形状的模型即可







# 整理关于功能实现的详细过程，面向过程编程

- 



