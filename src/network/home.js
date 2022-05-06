import { request } from "./index";

export function getHomeMultidata() {
  return request({
    url: '/home/multidata'
  })
}
export function getHomeGoods(type, page) {
  return request({
    url: 'http://www.blogry.cn/test/index',
    params: {
      type,
      page,
    }
  })
}


