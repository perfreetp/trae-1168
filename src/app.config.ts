export default defineAppConfig({
  pages: [
    'pages/discover/index',
    'pages/calendar/index',
    'pages/messages/index',
    'pages/mine/index',
    'pages/boat-detail/index',
    'pages/order/index',
    'pages/trip/index',
    'pages/trip-list/index',
    'pages/favorites/index',
    'pages/reviews/index',
    'pages/invoice/index',
    'pages/deposit/index',
    'pages/blacklist/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#1A73B5',
    navigationBarTitleText: '海钓约船',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#8C96A6',
    selectedColor: '#1A73B5',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/discover/index',
        text: '发现'
      },
      {
        pagePath: 'pages/calendar/index',
        text: '日历'
      },
      {
        pagePath: 'pages/messages/index',
        text: '消息'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
