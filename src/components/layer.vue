<template>
    <div class="layers">
      <div
        class="layer"
        v-for="(item, key) in layers"
        :key="key + 'layer'"
        :class="active === item ? 'active' : ''"
        @click="handleClick(item)"
      >
        {{ item }}
      </div>
    </div>
  </template>
  
  <script>
    export default {
      name: 'layer',
      components: {},
      props: {
        layers: {
          type: [Object, Array],
          default: () => {
            return { '1F': {} };
          }
        },
        active: {
          type: String,
          default: '1F'
        },
        styles: {
          type: Object,
          default: () => {
            return {
              top: '-48%',
              left: '1%',
              height: '400px'
            };
          }
        }
      },
      data() {
        return {};
      },
      methods: {
        handleClick(item) {
          this.$emit('change', item);
        }
      },
      mounted() {}
    };
  </script>
  <style lang="less" scoped>
    .layers {
      position: fixed;
      top: 50%;
      left: 80%;
      border: 1px solid #5299d3;
      width: 60px;
      height: 400px;
      overflow: auto;
      font-size: 18px;
      .layer {
        width: 100%;
        height: 36px;
        margin-bottom: 8px;
        text-align: center;
        line-height: 40px;
        color: #fff;
        border: 2px solid transparent;
        cursor: pointer;
      }
      .active {
        background: linear-gradient(
          90deg,
          rgba(48, 122, 182, 0) 0%,
          #1d5a8c 31%,
          #5299d3 54%,
          #1d5a8c 76%,
          rgba(29, 90, 140, 0) 100%
        );
        border: 2px solid;
        border-image: linear-gradient(
            90deg,
            rgba(179, 233, 255, 0),
            rgba(150, 219, 255, 1),
            rgba(124, 207, 255, 0)
          )
          2 2;
      }
    }
  </style>
  <style>
    .layers::-webkit-scrollbar {
      width: 0 !important;
      display: none;
    }
  
    .layers::-webkit-scrollbar {
      width: 0 !important;
      display: none;
    }
  </style>
  