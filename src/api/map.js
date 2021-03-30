import request from '@/utils/request'

const app_sn = 'ys_obc'
const map_id = 2
const params = {
  app_sn,
  map_id
}

export function tree() {
  return request({
    url: '/map/label/tree',
    method: 'get',
    params: {
      app_sn
    }
  })
}
export function info() {
  return request({
    url: '/map/info',
    method: 'get',
    params
  })
}
export function list() {
  return request({
    url: '/map/point/list',
    method: 'get',
    params
  })
}
export function get_map_pageLabel() {
  return request({
    url: '/map/get_map_pageLabel',
    method: 'get',
    params: {
      app_sn
    }
  })
}
export function get_icon_list() {
  return request({
    url: '/map/spot_kind/get_icon_list',
    method: 'get',
    params: {
      app_sn
    }
  })
}
export function get_public_notice() {
  return request({
    url: '/map/get_public_notice',
    method: 'get',
    params: {
      app_sn
    }
  })
}
export function get_map_anchor_list() {
  return request({
    url: '/map/map_anchor/list',
    method: 'get',
    params
  })
}
export function get_spot_kinds() {
  return request({
    url: '/map/spot_kind/get_spot_kinds',
    method: 'get',
    params
  })
}
export function mark_map_point_list() {
  return request({
    url: '/map/point/mark_map_point_list',
    method: 'get',
    params
  })
}

