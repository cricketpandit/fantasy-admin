// eslint-disable-next-line import/no-anonymous-default-export
export default {
  items: [
    {
      name: 'Dashboard',
      url: '/fantasy-dashboard',
      icon: 'nav-icon fa fa-tachometer',
    },
    // {
    //   name: 'Sub Admins',
    //   url: '/sub-admins',
    //   icon: 'nav-icon fa fa-users',
    // },
    {
      name: 'User Management',
      url: '/users',
      icon: 'nav-icon fa fa-users',
    },
    // {
    //   name: 'Quiz',
    //   url: '/questions',
    //   icon: 'nav-icon fa fa-list-alt',
    //   children: [
    //     {
    //       name: 'Category',
    //       url: '/questions/category',
    //       icon: 'nav-icon fa fa-flag',
    //     },
    //     {
    //       name: 'Question Management',
    //       url: '/questions',
    //       icon: 'nav-icon fa fa-users',
    //     },
    //   ]
    // },
    
    {
      name: 'Banners',
      url: '/banners',
      icon: 'nav-icon fa fa-list-alt',
      children: [
        {
          name: 'Fantasy Banners',
          url: '/banners',
          icon: 'nav-icon fa fa-flag',
        },
        // {
        //   name: 'Promotional Banners',
        //   url: '/promotional-banners',
        //   icon: 'nav-icon fa fa-flag',
        // },
        // {
        //   name: 'Home Banners',
        //   url: '/home-banners',
        //   icon: 'nav-icon fa fa-flag',
        // },
      ]
    },

    // {
    //   name: 'Booster Shop',
    //   url: '/booster',
    //   icon: 'nav-icon fa fa-list-alt',
    //   children: [
    //     {
    //       name: 'Booster',
    //       url: '/booster-shop',
    //       icon: 'nav-icon fa fa-flag',
    //     },
    //     // {
    //     //   name: 'Subscription',
    //     //   url: '/booster-subscription',
    //     //   icon: 'nav-icon fa fa-flag',
    //     // },

    //   ]
    // },

    // {
    //   name: 'Coupons',
    //   url: '/coupons',
    //   icon: 'nav-icon fa fa-gift',
    // },
    {
      name: 'Influencers',
      url: '/influencers',
      icon: 'nav-icon fa fa-gift',
    },
    {
      name: 'Cricket',
      url: '/cricket',
      icon: 'nav-icon fa fa-list-alt',
      children: [
        {
          name: 'Category',
          url: '/cricket/category',
          icon: 'nav-icon fa fas fa-list',
        },
        {
          name: 'Contests',
          url: '/cricket/contests',
          icon: 'nav-icon fa fa-arrows-alt',
        },
        {
          name: 'User Contests',
          url: '/cricket/user-contests',
          icon: 'nav-icon fa fa-arrows-alt',
        },
        // {
        //   name: 'Season Contests',
        //   url: '/cricket/season-contests',
        //   icon: 'nav-icon fa fa-arrows-alt',
        // },
        {
          name: 'Series',
          url: '/cricket/series',
          icon: 'nav-icon fa fa-list-alt',
        },
        {
          name: 'Point System',
          url: '/cricket/point-system',
          icon: 'nav-icon fa fa-list-alt',
        },
        {
          name: 'Teams',
          url: '/cricket/mst-teams',
          icon: 'nav-icon fa fa-list-alt',
        },
        {
          name: 'Player Manager',
          url: '/cricket/series-players',
          icon: 'nav-icon fa fa-list-alt',
        },
        {
          name: 'Schedule Contest',
          url: '/cricket/schedule-contest',
          icon: 'nav-icon fa fa-list',
        },
        // {
        //   name: 'Boosters',
        //   url: '/cricket/boosters',
        //   icon: 'nav-icon fa fa-list',
        // }
      ]
    },
    {
      name: 'Wallet Manager',
      url: '/wallets',
      icon: 'nav-icon fa fa-money',
    },
    {
      name: 'Earning Manager',
      url: '/earning/daily-cricket',
      icon: 'nav-icon fa fa-list-alt',
    },
    {
      name: 'Logs',
      url: '/logs',
      icon: 'nav-icon fa fa-gift',
    },

    // {
    //   name: 'Account Statement',
    //   url: '/statements',
    //   icon: 'nav-icon fa fa-list-alt',
    // },
    // {
    //   name: 'Withdraw Request',
    //   url: '/withdarwals',
    //   icon: 'nav-icon fa fa-arrow-down',
    // },
    {
      name: 'Transactions',
      url: '/transactions',
      icon: 'nav-icon fa fa-exchange',
    },
    {
      name: 'TDS Details',
      url: '/tds-details',
      icon: 'nav-icon fa fa-list',
    },
    {
      name: 'Gst Report',
      url: '/gst-report',
      icon: 'nav-icon fa fa-money',
    },
    // {
    //   name: 'Notifications',
    //   url: '/notifications',
    //   icon: 'nav-icon fa fa-bell',
    // },
    // {
    //   name: 'Email Templates',
    //   url: '/email-templates',
    //   icon: 'nav-icon fa fa-folder-open-o',
    // },
    // {
    //   name: 'Static Pages',
    //   url: '/static-pages',
    //   icon: 'nav-icon fa fa-file',
    // },

    // {
    //   name: 'Faqs',
    //   url: '/faqs',
    //   icon: 'nav-icon fa fa-flag',
    // },
    // {
    //   name: 'Settings',
    //   url: '/settings',
    //   icon: 'nav-icon fa fa-gear',
    // },
    // {
    //   name: 'Merchandise',
    //   url: '/merchandise',
    //   icon: 'nav-icon fa fa-gear',
    // },
  ],
}
