<template>
  <div>
    <l-map
      ref="myMap"
      style="width: 100vw; height: 100vh;"
      :crs="crs"
      :zoom="zoom"
      :max-bounds="maxBounds"
      :max-zoom="maxZoom"
      :min-zoom="minZoom"
      :center="center"
      :options="{zoomControl: false,noWrap:true,continuousWorld:true}"
      @click="selectPoint(-1)"
      @ready="doSomethingOnReady()"
    >
      <l-image-overlay :url="url" :bounds="bounds" />
      <l-control-zoom position="bottomright" />
      <l-marker
        v-for="(item) in markers"
        :key="item.id"
        :lat-lng="item.oneLatLang"
        :icon="setIcon(item)"
        :opacity="item.isMark?0.3:1.0"
        @click="selectPoint(item.id)"
      >
        <l-popup :content="setText(item)" />
      </l-marker>
    </l-map>
    <div class="map-layer-control" :class="openLayer?'map-layer-control--visible':'map-layer-control--hidden'">
      <div class="layer-control__header">
        <h1>
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAMAAABmmnOVAAADAFBMVEVHcEy5p3clNSMrPCswQCsfLx8gMB8rOi06SDEgMR8sPiseLh4gMCAfLx8yQiwoOScgMB8nNiQeLh4mNyYwQywfLx4vQis5SzUpOCYbMBsuQzGPkoY4UUAnOScsOyckNCJDQy0xQCkkNSQzPysfLh8eLh6LkIAkNySSimJBSjO2pHUxQy4sPiwwQCrRzsMeLR4+TzIfLx8fLh8eLh4+UzseLx7DwrZ/hHkeLx6vsKRIU0VudmguPC0eLh4wQzQ2QzKfo5YeLh5ze2DDwrdwfVD58+nSuIMeLh4lLiU9m6hcaUIgeIf368AfLx/RuII4fn/Qt4IiMiFvfE9ue09dakNgbERhbkZodUs0QCxkckjNtYFnckkqOSZtek5ibkWxoXI5RC/CrXuil2lreE2+qng6SC5xflF/iVxtdEvm4tf28ebEr3zv6uBDTzOlmWswPinz57yakmQ+TDEbKxf26r/z7uQtOyf48ujv5LkhOStHUDjh3dLLs38kNCNzgFPKxppkb0fDwJXr4bYlNB6dlGa0pHOQl2q4uKupnGwnfo2CfVi7uI9RXzxVYz9ETz9gY0U2Qy2SjWBNhH/Jsn46j5h6hVh6dlOOiGKpqZ0pMyo9maU5hIg3gINOVjyboHN3glWWm2+Kk2Y7Rjg4iZJ/1OJHVjcsNy7Z0qfHsX1eZljO29ZYX1Rqd0uIhVpAgX86kp49mqfd1qupq3+ysobn3rOFjmK3tYvi2q98gHTZ1cvT0MWMnoGB1+XUzqJwd03r5twqRDs4hYszPjPd2c+hpXmVjmRMWEjMyr91elA8lqJtxNOZnY9zc1GEiXuAgVWNiF66r4MoUUqsrYKunnBSXUzIx7ljal1scmbFs4JWXEJzempxb06xsaTKvZBLWTmio5ejmW9Gjplyt8IviJcxb29+mIFocWDGxLqqx8aBr7Pp7eXS08tgnaRmkIA4WVVKorF5x9NLc3NZscAtZWNnpKudpIIyc3RZk5lBYV9guMelqHyAgF7It4lEZ2Ztc1ahnXWzlMDaAAAAwHRSTlMA/vQ3IfryAhv8eeg+2FbK3/7+8aGffyrWChX+Bt5MngqZ6vl0Q/4q9vXsppLB/ERqfSzBTmH++cvr6Ovn1fPZ7LBq8f////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4IZ1MtAAASeUlEQVR42uyZCVAUZxbH5ZjhEuQQo6LifUtEV6Mm1Ca1MzxobNaGgeGY4RqIcolSAQI4CUYNYrgCLCLqZkvAsLgctbupoFIRYT2CUhujUddYuhqNxvKOGi0r2X3f1z3D9MxwqrFqa18VFDPdxffrd/zf+74eNuz/9r9kNmPG2LxsBuup7u5TrV8uw3BHCYDEcfjLDMU0BwAXFwCHV3+NkNgMd7IyXWeaD8CsmTNnAfi8+isweDtIHbyNKYajH6bMDgycPQV98cIjYrNICgDSRXqKibbWMyZMwi9LLXzRLErx6qQJM6xtJ744iAU+IHlDAj4L6CdbJ3vP0W52iAWp0b7UolPJJzu30Z72TrYvhmHcQldY5rUMXBeOGzZs/jxnKQVAi4kO5CECo2OEr+ykzvPmvwCGiXMB3LzkXm4A7iMt6VKsKiwm5/ihTfGxyeUrVpQnx8ZvOnQ8JyZMxdLLliOtbJ9vuYz1loLbUrk8a6kL/7BcTkllnEW94IQeC6y3iKssyeGoQ0aMeuU5hmKRjwQkr2XI5fKUVvKcmVtOxq4zAdCDrIs9uSWMYEic5zwnIbVZ8BbGX7onV06s85QWI7EzulcEwSI2loQRf1iOsn4OQRmzyBE9u+zNRDlvicdO4T8vbSynD10eH715ddzGtWs3xq3eHB1fbsAWsWkLDct4+7HP3B89UQkmv5mYJNdZUuJF9LW2pD45rvHoqsi8qJAQBcMoQkKi8iJXHW2MS9ZjrIj9mJStxGfCs0HYLiRu2CsXW+cefMS0Isa8fdG4On6dwLHunwl4q2Tus6TGAmRwmJ6r80Gu4I+s3G6sksxC4oDQvPDw8MhI/JUXSlzCMEVpG9LPPTwrYFhUopS6LnEacmZYo0JNzs8QGDI8ij30f+ergE0L0aiDg4OCZNSCgoKD1RpllCJhA5f9qKnsqoAREf0vovfe44aoDktQoZZm8cseOF/s5+dXfP6A4IyqNIyIUmZqeSyrvfJ7tKb9X63gc2NrGguu7kPS8rFvAbwhMGTkn97tR2z3acEz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" alt="">
          {{ infoData.info.name }}
        </h1>
        <div class="layer-control__announcement">更新日志</div>
        <div class="layer-control__operation">
          <a class="layer-control__btn-wiki" href="https://blog.csdn.net/Cting1997" target="_blank">
            查看攻略
          </a>
          <div class="layer-control__btn-add">新建标点</div>
        </div>
      </div>
      <div class="layer-control__panel-list">
        <ul>
          <li :class="selectPanel===1?'active':''" @click="selectPanel=1">观测者标点</li>
          <li :class="selectPanel===2?'active':''" @click="selectPanel=2">我的标点</li>
        </ul>
      </div>
      <ul class="layer-control__tabs" :class="selectPanel===1?'visible':''">
        <!--        <li :class="selectTab===0?'active':''" @click="selectTab=0">-->
        <!--          <img class="tab__img&#45;&#45;pc" src="data:image/png;base64,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" alt="">-->
        <!--          <img class="tab__img&#45;&#45;pc tab__img&#45;&#45;active" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXwAAABkCAMAAACyy3u6AAADAFBMVEVHcEz19O309O308+308+709O308+308+709O308+308+708+708+708+308+308+308+709O308+308+318+308+z08+308u308+708+309O308+308+308+z08+z19O308+308+z08+308+z08+308+319O319O708+308+708+319O308u319O308+zz8+3z8+308+308+z09O308+z08+719O719O308u308+308u309O319O7z8+319O319O719O319O318+708+319O708+308+708+z19O3z8+319O718+7z8+308+308+308+308+z09O709O319O3z8+309O708+718+719O719O709O709O7z8u319O709O309O719O708+7x8ev08+7z8+3z8u309O719O708uzz8+3z8+z08+319O7z8u309O719O719O1RWGZASFhHTl7z8+309O709O5YX2zz8+1QV2ZJUGD08+5rcXz19O7Fxsf09O3z8+2VmJ7z8+zz8+1MU2Pr6eVcY3CPk5pfZXLz8u1jaXbz8uzl5eHr6uWGi5PX2NZ4foicoKWAhY3R0tCztbe5u7yHjJNbYW+4urvd3tpwdoA9RVbS0tGSlpzv7+nd3dppb3v09O2/wMHr6+bm5uLQ0c/09O2eoabV1dSCh4+gpKilqKx1eoT29u+7vb6MkJdmbHmtsLOlqKzDxMTJysnv7um1t7l1eoVvdYBgZ3T18+729vL7+/P19O7s6+ZXXm3x8eudoKXw7+rq6eT18+6oq6/v7unExcXMzMzm5eLX19WanaPT1NKvsrX08+718+5obnp9gYrMzMzf4Nx8govw7+rIyczv7umFipLi4t/d3dvNzs3m5eH19O3////08+719O709O/19O308+3p6eju7eny8u7s6+Y9RVb////08+1DSlv7/Py8v8WKj5mvs7p7gYzd3uH39/icoKnHys7x8vPY2t3s7e/Q0tahpa3i4+aTl6Dm5+mmqrKDiJLp6uwZ0/NDAAAA6HRSTlMA5OPT+eH80uLR0Pv6/fLU7uXnz/PO8ODv8ebp6PjM9O3N1ers/vXf9+rrzN/26fLz9ujM2+vf9/TM3vb48Obh5eDd1vn17PXj78/c8djX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" alt="">-->
        <!--        </li>-->
        <li v-for="(item) in mapPageLabel.list" :key="item.id" @click="selectTab=item.id,closedGroup=[]">
          <img alt="" :src="selectTab===item.id?item['pc_icon_url2']:item['pc_icon_url']">
        </li>
      </ul>
      <ul v-show="selectPanel===1" class="layer-control__panel">
        <li
          v-for="(item) in treeData.tree"
          :key="item.id"
          class="layer-control__group"
          :class="closedGroup.includes(item.id)?'layer-control__group--folded':''"
        >
          <div class="layer-control__group-title" @click="closeGroup(item.id)">{{ item.name }}</div>
          <ul class="layer-control__list">
            <li
              v-for="(jtem) in item.children"
              :key="jtem.id"
              class="layer-control__item"
              :class="selectPointType.includes(jtem.id)?'visible':''"
              @click="selectPointKind(jtem.id)"
            >
              {{ jtem.visible }}
              <img :src="jtem.icon" alt="">{{ jtem.name }}
            </li>
          </ul>
        </li>
      </ul>
      <div v-show="selectPanel===2" class="custom-filter">dddd</div>
      <div class="layer-control__footer" />
      <div class="layer-control__copyright">taitChan-学习专用</div>
      <div class="layer-control__handle" @click="openLayer=!openLayer" />
    </div>
    <div class="bbs-qr">
      <el-row style="width: 105px;padding-top: 10px">
        扫码加微信<br>=v=<br>诶嘿~<br>
      </el-row>
    </div>
  </div>
</template>

<script>
import L from 'leaflet'
import { LMap, LImageOverlay, LMarker, LPopup, LControlZoom } from 'vue2-leaflet'
import wechat from '@/assets/images/wechat.jpg'
import { deepClone } from '@/utils'
import { tree, info, list, get_map_pageLabel, get_icon_list, get_public_notice, get_map_anchor_list, get_spot_kinds, mark_map_point_list } from '@/api/map'

export default {
  name: 'ImageMap',
  components: {
    LMap,
    LImageOverlay,
    LMarker,
    LPopup,
    LControlZoom
  },
  data() {
    return {
      map: {},
      wechat: wechat,
      selectId: -1,
      selectPanel: 1,
      selectPointType: [],
      closedGroup: [],
      selectTab: 0,
      openLayer: true,
      // L.control.zoom({ position: 'bottomright', zoomInTitle: '放大', zoomOutTitle: '缩小' })
      infoData: { info: {}},
      treeData: [],
      listData: { label_list: [], point_list: [] },
      iconList: [],
      mapAnchorList: [],
      mapPageLabel: { list: [] },
      publicNotice: [],
      markers: [],
      // url: 'http://leafletjs.com/examples/crs-simple/uqm_map_full.png',
      url: 'https://uploadstatic.mihoyo.com/ys-obc/2021/02/24/76892539/8b089185befd5f9deec76de5fd40f225_8511148262888359032.jpeg',
      bounds: [[0, 0], [8192, 8192]],
      maxBounds: L.latLngBounds(L.latLng(0, 0), L.latLng(8192 + 1024, 8192 + 1026)),
      zoom: -3,
      maxZoom: 1,
      minZoom: -5,
      center: L.latLng([8192 / 2, 8192 / 2]),
      crs: L.CRS.Simple,
    }
  },
  computed: {
    // "origin":[4843,2796],
    // "total_size":[8192,8192],
    // "padding":[1024,1026]}

  },
  created() {
    const self = this
    window.markPoint = self.markPoint
    this.test()
    this.test2()
  },
  mounted() {
  },
  methods: {
    async test() {
      const [infoData, treeData, listData] = await Promise.all([info(), tree(), list()])
      infoData.info.detail = JSON.parse(infoData.info.detail)
      this.infoData = infoData
      this.listData = listData
      this.markers = []
      const { label_list, point_list } = listData
      const markers = point_list.slice(1, 10)
      for (const point of markers) {
        point['label_name'] = label_list.find((item) => { return item.id === point['label_id'] }).name
        point['icon'] = label_list.find((item) => { return item.id === point['label_id'] }).icon
        point['isMark'] = false
        point['oneLatLang'] = L.latLng(-point.y_pos + 5395, point.x_pos + 4843)
      }
      this.markers = deepClone(markers)
      this.treeData = treeData
    },
    async test2() {
      const [iconList, mapAnchorList, mapPageLabel, publicNotice] = await Promise.all([get_icon_list(), get_map_anchor_list(), get_map_pageLabel(), get_public_notice()])
      this.iconList = iconList
      this.mapAnchorList = mapAnchorList
      // arr.unshift(key);
      mapPageLabel.list.unshift({
        id: 0,
        name: '全地图',
        pc_icon_url: 'data:image/png;base64,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',
        pc_icon_url2: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXwAAABkCAMAAACyy3u6AAADAFBMVEVHcEz19O309O308+308+709O308+308+709O308+308+708+708+708+308+308+308+709O308+308+318+308+z08+308u308+708+309O308+308+308+z08+z19O308+308+z08+308+z08+308+319O319O708+308+708+319O308u319O308+zz8+3z8+308+308+z09O308+z08+719O719O308u308+308u309O319O7z8+319O319O719O319O318+708+319O708+308+708+z19O3z8+319O718+7z8+308+308+308+308+z09O709O319O3z8+309O708+718+719O719O709O709O7z8u319O709O309O719O708+7x8ev08+7z8+3z8u309O719O708uzz8+3z8+z08+319O7z8u309O719O719O1RWGZASFhHTl7z8+309O709O5YX2zz8+1QV2ZJUGD08+5rcXz19O7Fxsf09O3z8+2VmJ7z8+zz8+1MU2Pr6eVcY3CPk5pfZXLz8u1jaXbz8uzl5eHr6uWGi5PX2NZ4foicoKWAhY3R0tCztbe5u7yHjJNbYW+4urvd3tpwdoA9RVbS0tGSlpzv7+nd3dppb3v09O2/wMHr6+bm5uLQ0c/09O2eoabV1dSCh4+gpKilqKx1eoT29u+7vb6MkJdmbHmtsLOlqKzDxMTJysnv7um1t7l1eoVvdYBgZ3T18+729vL7+/P19O7s6+ZXXm3x8eudoKXw7+rq6eT18+6oq6/v7unExcXMzMzm5eLX19WanaPT1NKvsrX08+718+5obnp9gYrMzMzf4Nx8govw7+rIyczv7umFipLi4t/d3dvNzs3m5eH19O3////08+719O709O/19O308+3p6eju7eny8u7s6+Y9RVb////08+1DSlv7/Py8v8WKj5mvs7p7gYzd3uH39/icoKnHys7x8vPY2t3s7e/Q0tahpa3i4+aTl6Dm5+mmqrKDiJLp6uwZ0/NDAAAA6HRSTlMA5OPT+eH80uLR0Pv6/fLU7uXnz/PO8ODv8ebp6PjM9O3N1ers/vXf9+rrzN/26fLz9ujM2+vf9/TM3vb48Obh5eDd1vn17PXj78/c8djX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'
      })
      for (const page of mapPageLabel.list) {
        if (page.type === 2) {
          mapPageLabel.list.unshift(page)
          break
        }
      }
      mapPageLabel.list.pop()
      this.mapPageLabel = mapPageLabel
      this.publicNotice = publicNotice
    },
    async test3() {
      const d = await get_spot_kinds()
      console.log(d)
    },
    async test4() {
      const e = await mark_map_point_list()
      console.log(e)
    },
    doSomethingOnReady() {
      this.map = this.$refs.myMap.mapObject
      // console.log(this.map)
    },
    selectPoint(id) {
      this.selectId = (this.selectId === id ? -1 : id)
      this.$nextTick(() => {
        const el = document.getElementsByClassName('leaflet-popup-close-button')[0]
        if (el) {
          el.addEventListener('click', () => {
            this.selectId = -1
          })
        }
      })
    },
    selectPointKind(id) {
      if (this.selectPointType.includes(id)) {
        this.selectPointType.splice(this.selectPointType.findIndex(item => item.id === id), 1)
      } else {
        this.selectPointType.push(id)
      }
      // this.selectPointType=[...new Set(this.selectPointType)]
      const { label_list, point_list } = this.listData
      const markers = []
      for (const type of this.selectPointType) {
        markers.push(...point_list.filter((item) => { return item['label_id'] === type }))
      }
      for (const point of markers) {
        point['label_name'] = label_list.find((item) => { return item.id === point['label_id'] }).name
        point['icon'] = label_list.find((item) => { return item.id === point['label_id'] }).icon
        point['isMark'] = false
        point['oneLatLang'] = L.latLng(-point.y_pos + 5395, point.x_pos + 4842)
        console.log(point)
        console.log(point['oneLatLang'])
      }
      console.log(markers)
      this.markers = deepClone(markers)
    },
    closeGroup(id) {
      if (this.closedGroup.includes(id)) {
        this.closedGroup.splice(this.closedGroup.findIndex(item => item.id === id), 1)
      } else {
        this.closedGroup.push(id)
      }
    },
    markPoint(point) {
      this.markers.find((item) => { return item.id === point.id }).isMark = !point.isMark
      this.markers = deepClone(this.markers)
    },
    setIcon(item) {
      const oneIcon = L.divIcon({
        html: `<div class="mhy-game-gis-icon">
                <div class="gis-icon" style="background-image: url(` + item.icon + `)"></div>
              <div/>`,
        iconSize: this.selectId === item.id ? [48, 48] : [32, 32],
        iconAnchor: this.selectId === item.id ? [24, 60] : [16, 41.97], // 解决marker偏移（图标大小32|41.9，48|65.58） 参考网址https://blog.csdn.net/chenmo2019/article/details/108565246
        popupAnchor: [0, -48],
        className: 'mhy-game-gis-marker'
      })
      return oneIcon
    },
    setText(item) {
      let str = ''
      str = (item.isMark ? '取消' : '')
      let classStr = ''
      classStr = (item.isMark ? 'map-popup__switch--marked' : 'map-popup__switch--unmarked')
      // return `marker<div class="map-popup__switch ${classStr}" onclick=bbb(\'${str}\')>${str}标记</div>`
      const expStr = item.exp ? `<div class="map-popup__exp"><label>获取：</label><div><p>` + item.exp + `</p></div></div>` : ''
      const descStr = item.desc ? `<div class="map-popup__desc"><p><img src="` + this.baseUrl + item.desc + `"></p></div>` : ''
      const contentStr = (item.desc || item.exp) ? `<div class="map-popup__content">${expStr}${descStr}</div>` : ''
      const pointObj = { id: item.id, isMark: item.isMark }
      const htmlStr =
          `<div class="map-popup">
            <span class="map-popup__name-link"><label>名称：</label>${item['label_name']}</span>
            <div class="map-popup__type"><label>类型：</label>xxx</div>
            ${contentStr}
            <div class="map-popup__switch ${classStr}" onclick=markPoint(` + JSON.stringify(pointObj) + `)>${str}标记</div>
          </div>`
      return htmlStr
    }
  }
}
</script>

<style scoped>

</style>
