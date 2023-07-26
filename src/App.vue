<template>
  <div id="app">
    <h1 class="title">智慧园区</h1>
    <img class="header-img" src="@/assets/image/header.png" alt="">
    <router-view />
  </div>
</template>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  .title{
    position: fixed;
    top: 0vh;
    font-size: 35px;
    color: aliceblue;
    width: 100vw;
    left: 50%;
    z-index: 3;
    transform: translateX(-50%);
  }
  .header-img {
    position: fixed;
    top: -6vh;
    width: 100vw;
    left: 50%;
    z-index: 2;
    transform: translateX(-50%);
  }
}
</style>
